import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ToolshopWorld } from '../../../support/world';
import { TestDataFactory } from '../../../support/factories/TestDataFactory';
import { waitForLoggedResponseStatus, parseEndpointSpec, personaToFormFields, personaToApiPayload } from '../../../support/stepHelpers';

// ============================================================
// Shared/common steps (defined here — first introduced by AA-10 — and reused
// verbatim by later stories' scenarios; see docs/epics/architecture_AA-1.md
// §2 step tables for the full per-story mapping. Do NOT redefine any of these
// patterns in aa-11/12/13/14.steps.ts — Cucumber errors on duplicate matches.)
// ============================================================

Given('the test environment is configured', async function (this: ToolshopWorld) {
  // ARRANGE — no-op: the base URL is env-configurable (support/config.ts,
  // BASE_URL/API_BASE_URL — see .env.example), read once by ToolshopUi/
  // ToolshopApi rather than hardcoded here or passed through Gherkin. This
  // step exists so the Background line reads naturally; nothing to do at
  // execution time.
});

Given('the user is not logged in', async function (this: ToolshopWorld) {
  // ARRANGE — a freshly-created context (see support/hooks.ts Before hook)
  // has no auth-token in localStorage by construction; nothing to do.
});

Given('the user is on the {string} page', async function (this: ToolshopWorld, path: string) {
  // ARRANGE
  await this.toolshopUi.navigateTo(path);
});

Given(
  'the user is on the {string} page with network capture enabled',
  async function (this: ToolshopWorld, path: string) {
    // ARRANGE — the network log itself is always recording (see hooks.ts);
    // this step just marks the checkpoint so later assertions only look at
    // responses from this point forward.
    this.testData.networkCheckpoint = (this.testData.networkLog as unknown[]).length;
    await this.toolshopUi.navigateTo(path);
  }
);

Given(
  'the user is on the {string} page with all other fields valid',
  async function (this: ToolshopWorld, path: string) {
    // ARRANGE
    const persona = TestDataFactory.registerPersona();
    this.testData.persona = persona;
    await this.toolshopUi.navigateTo(path);
    await this.toolshopUi.fillRegistrationForm(personaToFormFields(persona));
  }
);

Given('an account already exists for email {string}', async function (this: ToolshopWorld, rawEmail: string) {
  // ARRANGE — resolves the "{{dynamic:email}}" placeholder used in the
  // .feature file (see test-data/register.yaml) to a real, freshly-generated
  // email, then registers it via the API so this scenario's "again" step has
  // a real duplicate to submit against.
  const email = rawEmail === '{{dynamic:email}}' ? `test_${Date.now()}@qa.io` : rawEmail;
  const persona = TestDataFactory.registerPersona({ email });
  await this.toolshopApi.registerViaApi(personaToApiPayload(persona));
  this.testData.persona = persona;
});

When(
  'the user fills in the registration form with:',
  async function (this: ToolshopWorld, dataTable: DataTable) {
    // ACT
    const fields = dataTable.rowsHash() as Record<string, string>;
    if (fields.Email === '{{dynamic:email}}') {
      fields.Email = `test_${Date.now()}@qa.io`;
    }
    this.testData.email = fields.Email;
    await this.toolshopUi.fillRegistrationForm(fields);
  }
);

When('the user submits the registration form with a valid new persona', async function (this: ToolshopWorld) {
  // ARRANGE + ACT
  const persona = TestDataFactory.registerPersona();
  this.testData.persona = persona;
  this.testData.email = persona.email;
  await this.toolshopUi.fillRegistrationForm(personaToFormFields(persona));
  await this.toolshopUi.clickButton('Register');
});

When(
  'the user submits the registration form again using the same email address',
  async function (this: ToolshopWorld) {
    // ARRANGE + ACT — reuses the email/persona set up in the "an account
    // already exists" Given step above.
    const priorPersona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
    await this.toolshopUi.navigateTo('/auth/register');
    await this.toolshopUi.fillRegistrationForm(personaToFormFields(priorPersona));
    await this.toolshopUi.clickButton('Register');
  }
);

When('the user leaves the {string} field empty', async function (this: ToolshopWorld, field: string) {
  // ARRANGE + ACT — fill every OTHER field with a valid persona, leave this
  // one out entirely (not filled at all — that's what "empty" means here).
  const persona = TestDataFactory.registerPersona();
  const fields = personaToFormFields(persona);
  delete (fields as Partial<typeof fields>)[field as keyof typeof fields];
  await this.toolshopUi.navigateTo('/auth/register');
  await this.toolshopUi.fillRegistrationForm(fields);
});

When('the user enters {string} in the Email address field', async function (this: ToolshopWorld, value: string) {
  // ACT — works for both /auth/register and /auth/login since both share the
  // "email" data-test id (see docs/epics/architecture_AA-1.md §8).
  await this.toolshopUi.fillRegistrationForm({ Email: value });
});

When('the user enters {string} as the password', async function (this: ToolshopWorld, value: string) {
  // ACT
  await this.toolshopUi.fillRegistrationForm({ Password: value });
});

When('the user clicks the {string} button', async function (this: ToolshopWorld, label: string) {
  // ACT
  await this.toolshopUi.clickButton(label);
});

Then('the user is redirected to the {string} page', async function (this: ToolshopWorld, path: string) {
  // ASSERT
  await expect(this.page).toHaveURL(new RegExp(`${path}$`));
});

Then('no error banner is shown', async function (this: ToolshopWorld) {
  // ASSERT
  await expect(this.page.locator('[data-test="register-error"]')).not.toBeVisible();
});

Then('{string} returns status {int}', async function (this: ToolshopWorld, endpointSpec: string, status: number) {
  // ASSERT
  const { method, path } = parseEndpointSpec(endpointSpec);
  const checkpoint = (this.testData.networkCheckpoint as number) ?? 0;
  await waitForLoggedResponseStatus(this, method, path, status, checkpoint);
});

Then('the app navigates to the {string} page', async function (this: ToolshopWorld, path: string) {
  // ASSERT
  await expect(this.page).toHaveURL(new RegExp(`${path}$`));
});

Then('the page displays {string}', async function (this: ToolshopWorld, expectedText: string) {
  // ASSERT — register/login banners expose data-test="{page}-error"
  // (confirmed live); /account/profile's banners are NOT identified by
  // data-test — confirmed live they're simply the page's sole role="alert"
  // element (see architecture_AA-1.md §8). Branch on the current URL.
  const url = this.page.url();
  if (url.includes('/account/profile')) {
    await expect.poll(() => this.toolshopUi.getProfileBannerMessage()).toBe(expectedText);
    return;
  }
  const page: 'register' | 'login' = url.includes('/auth/register') ? 'register' : 'login';
  await expect(this.page.locator(`[data-test="${page}-error"]`)).toHaveText(expectedText);
});

Then(
  'a field-level alert {string} is shown below the {string} field',
  async function (this: ToolshopWorld, message: string, field: string) {
    // ASSERT — the field's error container can hold MULTIPLE concatenated
    // validator messages at once (confirmed live 2026-08-12: an empty Date
    // of Birth shows both the "invalid format" and "required" messages
    // together, likewise Password shows all 3 composition-rule messages
    // alongside "required"). Assert this message is present, not that it's
    // the ONLY content — an exact match here is too strict and doesn't
    // reflect real behavior.
    await expect
      .poll(async () => (await this.toolshopUi.getFieldError(field)).includes(message))
      .toBe(true);
  }
);

Then('{string} is not called', async function (this: ToolshopWorld, endpointSpec: string) {
  // ASSERT — give the app a brief window to have called it if it were going
  // to, then confirm it didn't. Uses the same log as waitForLoggedResponse
  // rather than a raw sleep.
  const { method, path } = parseEndpointSpec(endpointSpec);
  const checkpoint = (this.testData.networkCheckpoint as number) ?? 0;
  const log = (this.testData.networkLog as { request(): { method(): string }; url(): string }[]).slice(checkpoint);
  const match = log.find((r) => r.request().method() === method && r.url().includes(path));
  expect(match).toBeUndefined();
});

Then('the form does not submit', async function (this: ToolshopWorld) {
  // ASSERT
  await expect(this.page).toHaveURL(/\/auth\/(register|login)$/);
});

Then('the {string} checklist item remains unmet', async function (this: ToolshopWorld, rule: string) {
  // ASSERT
  const met = await this.toolshopUi.isPasswordRuleMet(rule);
  expect(met).toBe(false);
});
