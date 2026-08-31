import { Page } from '@playwright/test';
import { BASE_URL } from './config';

/** Maps Gherkin-facing field labels to the site's data-test id (without page prefix).
 * Confirmed live 2026-08-11/12 against /auth/register, /auth/login, /account/profile —
 * all three forms share the same data-test names for overlapping fields. */
const FIELD_TEST_IDS: Record<string, string> = {
  'First name': 'first-name',
  'Last name': 'last-name',
  'Date of Birth': 'dob',
  Country: 'country',
  'Postal code': 'postal_code',
  'House number': 'house_number',
  Street: 'street',
  City: 'city',
  State: 'state',
  Phone: 'phone',
  Email: 'email',
  'Email address': 'email',
  Password: 'password',
};

export interface RegisterFormFields {
  'First name': string;
  'Last name': string;
  'Date of Birth': string;
  Country: string;
  'Postal code': string;
  'House number': string;
  Street: string;
  City: string;
  State: string;
  Phone: string;
  Email: string;
  Password: string;
}

export interface ProfileFieldValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

function testId(field: string): string {
  const id = FIELD_TEST_IDS[field];
  if (!id) throw new Error(`Unknown field label "${field}" — add it to FIELD_TEST_IDS`);
  return id;
}

export class ToolshopUi {
  constructor(public readonly page: Page) {}

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${BASE_URL}${path}`);
  }

  /** Fills whichever keys are present in `fields` on the registration form. Leaving a
   * key out (rather than passing an empty string) is how "leave the field empty"
   * scenarios are expressed — do not fill it at all. Country is a <select>, handled
   * via selectOption; every other field (including Street/City/State) is a plain
   * text input filled directly.
   *
   * Street/City/State are filled explicitly rather than relying on the site's
   * postcode-lookup autofill — confirmed live 2026-08-12 that the autofill's
   * trigger (a blur/change interaction between House number and Country) is
   * timing-fragile under Playwright's .fill()/.selectOption() (which don't
   * dispatch the same native focus-shift events a real user's tab/click
   * would) and unreliably left street/city/state blank, which then fails
   * client-side validation with no visible error and no POST request at all
   * — the most misleading possible failure mode. Do not remove Street/City/
   * State from RegisterFormFields to "rely on autofill instead" without
   * re-verifying that trigger live first. */
  async fillRegistrationForm(fields: Partial<Record<keyof RegisterFormFields, string>>): Promise<void> {
    const { Country, ...rest } = fields;
    for (const [label, value] of Object.entries(rest)) {
      await this.page.locator(`[data-test="${testId(label)}"]`).fill(value);
    }
    if (Country !== undefined) {
      // Match by visible label, not value — the <option> value is an ISO
      // code (e.g. "US"), not the display text "United States of America
      // (the)". selectOption(value) alone silently matches nothing.
      await this.page.locator('[data-test="country"]').selectOption({ label: Country });
    }
  }

  async fillLoginForm(fields: { Email?: string; Password?: string }): Promise<void> {
    if (fields.Email !== undefined) {
      await this.page.locator('[data-test="email"]').fill(fields.Email);
    }
    if (fields.Password !== undefined) {
      await this.page.locator('[data-test="password"]').fill(fields.Password);
    }
  }

  /** Convenience composite: fills + submits the login form in one call, for Gherkin
   * steps that describe login as a single action (e.g. "logs in with the registered
   * email and password"). Steps that separate "enters credentials" from "clicks
   * Login" as distinct Gherkin steps should call fillLoginForm + clickButton instead.
   *
   * Waits for the resulting redirect to /account before returning — confirmed
   * live 2026-08-12 that this redirect is asynchronous (~1-2s after the
   * click, same async-navigation pattern as the logout-guard redirect in
   * architecture_AA-1.md §5/test_cases_AA-1.md Drift #4). Without this wait,
   * any caller that immediately navigates elsewhere after login() races the
   * in-flight redirect and can end up back on /auth/login. Only use this for
   * KNOWN-successful logins — negative/failed-login scenarios must use
   * fillLoginForm + clickButton directly instead, since there's no /account
   * redirect to wait for. */
  async login(email: string, password: string): Promise<void> {
    await this.fillLoginForm({ Email: email, Password: password });
    await this.clickButton('Login');
    await this.page.waitForURL(/\/account$/, { timeout: 10000 });
  }

  async clickButton(label: string): Promise<void> {
    const testIdByLabel: Record<string, string> = {
      Register: 'register-submit',
      Login: 'login-submit',
      'Update Profile': 'update-profile-submit',
    };
    const id = testIdByLabel[label];
    if (!id) throw new Error(`Unknown button label "${label}" — add it to clickButton's map`);
    await this.page.locator(`[data-test="${id}"]`).click();
  }

  /** Field-level validation error. Confirmed live: every field's error container has
   * data-test="{field-id}-error" (e.g. "first-name-error", "email-error") — a
   * reliable pattern, not a guess (see docs/epics/architecture_AA-1.md §8). */
  async getFieldError(field: string): Promise<string> {
    const id = testId(field);
    return (await this.page.locator(`[data-test="${id}-error"]`).textContent())?.trim() ?? '';
  }

  /** Top-of-form banner on /auth/register or /auth/login (duplicate email, breach
   * password, invalid credentials). Confirmed live: data-test="register-error" /
   * data-test="login-error" respectively — NOT role=alert on these two pages. */
  async getBannerMessage(page: 'register' | 'login'): Promise<string> {
    return (await this.page.locator(`[data-test="${page}-error"]`).textContent())?.trim() ?? '';
  }

  /** /account/profile's banners (success + validation) are NOT identified by
   * data-test — confirmed live they are simply the page's sole role="alert"
   * element at any given time. Use getByRole here rather than the {page}-error
   * pattern used elsewhere. */
  async getProfileBannerMessage(): Promise<string> {
    return (await this.page.getByRole('alert').textContent())?.trim() ?? '';
  }

  async isPasswordRuleMet(rule: string): Promise<boolean> {
    const item = this.page.locator('li', { hasText: rule });
    const className = await item.getAttribute('class');
    // Exact "met" class name unconfirmed at Stage 6/7 time — fall back to a
    // conservative check (element gets SOME class change when met) and flag for
    // Stage 9 healing if this proves too weak in practice.
    return /met|valid|success|checked/i.test(className ?? '');
  }

  async getAccountMenuLabel(): Promise<string | null> {
    const menu = this.page.locator('[data-test="nav-menu"]');
    if (!(await menu.isVisible())) return null;
    return (await menu.textContent())?.trim() ?? null;
  }

  async openAccountMenu(): Promise<void> {
    await this.page.locator('[data-test="nav-menu"]').click();
  }

  /** Confirmed live 2026-08-12: every dropdown item has a reliable
   * data-test="nav-{label}" (Sign out) or "nav-my-{label}" (the rest) —
   * matched by those instead of getByRole/getByText, since e.g. "My account"
   * appears a SECOND time on the page as the /account page's own <h1>
   * heading once you're there, which getByText/getByRole would ambiguously
   * match against (Playwright strict-mode violation, confirmed live). */
  async clickNavItem(label: string): Promise<void> {
    const dataTestByLabel: Record<string, string> = {
      'My account': 'nav-my-account',
      'My favorites': 'nav-my-favorites',
      'My profile': 'nav-my-profile',
      'My invoices': 'nav-my-invoices',
      'My messages': 'nav-my-messages',
      'Sign out': 'nav-sign-out',
    };
    const id = dataTestByLabel[label];
    if (!id) throw new Error(`Unknown dropdown item label "${label}" — add it to dataTestByLabel`);
    await this.page.locator(`[data-test="${id}"]`).click();
  }

  async logout(): Promise<void> {
    await this.openAccountMenu();
    await this.clickNavItem('Sign out');
  }

  async getProfileFieldValues(): Promise<ProfileFieldValues> {
    const value = (id: string) => this.page.locator(`[data-test="${id}"]`).inputValue();
    return {
      firstName: await value('first-name'),
      lastName: await value('last-name'),
      email: await value('email'),
      phone: await value('phone'),
      street: await value('street'),
      postalCode: await value('postal_code'),
      city: await value('city'),
      state: await value('state'),
      country: await value('country'),
    };
  }

  /** Fills whichever profile fields are present. The email field is confirmed
   * read-only live (AA-1-TC-05-03 is BLOCKED) — do not attempt to fill "Email"
   * here, Playwright's .fill() hangs against a readOnly input. */
  async fillProfileForm(fields: Partial<Record<'First name' | 'Last name' | 'Phone' | 'Street' | 'Postal code' | 'City' | 'State' | 'Country', string>>): Promise<void> {
    for (const [label, value] of Object.entries(fields)) {
      const id = testId(label);
      await this.page.locator(`[data-test="${id}"]`).fill(value);
    }
  }

  async clearProfileField(field: string): Promise<void> {
    const id = testId(field);
    await this.page.locator(`[data-test="${id}"]`).fill('');
  }
}
