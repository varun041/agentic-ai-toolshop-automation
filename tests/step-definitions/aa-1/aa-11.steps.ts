import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ToolshopWorld } from '../../../support/world';
import { TestDataFactory } from '../../../support/factories/TestDataFactory';
import { waitForLoggedResponseStatus, parseEndpointSpec } from '../../../support/stepHelpers';
import { personaToApiPayload } from '../../../support/personaAdapters';

// ============================================================
// AA-11 — Login with valid credentials
// "a registered account exists" is also reused verbatim by AA-13's scenarios
// (aa-13.steps.ts) — defined here since AA-11 introduces it first.
// ============================================================

Given('a registered account exists', async function (this: ToolshopWorld) {
  // ARRANGE
  const persona = TestDataFactory.registerPersona();
  await this.toolshopApi.registerViaApi(personaToApiPayload(persona));
  this.testData.persona = persona;
});

When('the user logs in with the registered email and password', async function (this: ToolshopWorld) {
  // ACT
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  await this.toolshopUi.login(persona.email, persona.password);
});

When('the user submits valid login credentials', async function (this: ToolshopWorld) {
  // ACT
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  await this.toolshopUi.login(persona.email, persona.password);
});

Given('the user has just logged in successfully', async function (this: ToolshopWorld) {
  // ARRANGE
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  await this.toolshopUi.navigateTo('/auth/login');
  await this.toolshopUi.login(persona.email, persona.password);
});

Given('the user is logged in and on the {string} page', async function (this: ToolshopWorld, path: string) {
  // ARRANGE
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  await this.toolshopUi.navigateTo('/auth/login');
  await this.toolshopUi.login(persona.email, persona.password);
  await expect(this.page).toHaveURL(new RegExp(`${path}$`));
});

When('the user inspects the top navigation', async function (this: ToolshopWorld) {
  // ACT — open the dropdown so its contents (My account, My favorites, etc.)
  // are actually present in the DOM for the Then step to check.
  await this.toolshopUi.openAccountMenu();
});

Then(
  "the \"Sign in\" link is replaced by a dropdown menu showing the account holder's name",
  async function (this: ToolshopWorld) {
    // ASSERT
    const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
    const label = await this.toolshopUi.getAccountMenuLabel();
    expect(label).toContain(`${persona.firstName} ${persona.lastName}`);
  }
);

Then(
  'the dropdown contains {string}, {string}, {string}, {string}, {string}, and {string}',
  async function (
    this: ToolshopWorld,
    item1: string,
    item2: string,
    item3: string,
    item4: string,
    item5: string,
    item6: string
  ) {
    // ASSERT — Cucumber inspects the step function's declared arity against
    // the number of {string} captures before invoking it; a rest parameter
    // (...items) reports a function.length of 0 in JS and gets rejected
    // ("function has 0 arguments, should have 6"), confirmed live 2026-08-12.
    // Named parameters are required here, not a "simplification" back to rest.
    //
    // Matched by data-test, not getByText — confirmed live 2026-08-12 that
    // "My account" (and the pattern generally) appears TWICE on the page
    // once logged in: once as this dropdown item, once as the /account
    // page's own <h1> heading. getByText(..., {exact:true}) hits a Playwright
    // strict-mode violation matching both; nav-my-{label} is unambiguous.
    const dataTestByLabel: Record<string, string> = {
      'My account': 'nav-my-account',
      'My favorites': 'nav-my-favorites',
      'My profile': 'nav-my-profile',
      'My invoices': 'nav-my-invoices',
      'My messages': 'nav-my-messages',
      'Sign out': 'nav-sign-out',
    };
    for (const label of [item1, item2, item3, item4, item5, item6]) {
      const id = dataTestByLabel[label];
      if (!id) throw new Error(`Unknown dropdown item label "${label}" — add it to dataTestByLabel`);
      await expect(this.page.locator(`[data-test="${id}"]`)).toBeVisible();
    }
  }
);

When('the user performs a hard page reload', async function (this: ToolshopWorld) {
  // ACT
  this.testData.reloadCheckpoint = (this.testData.networkLog as unknown[]).length;
  await this.page.reload({ waitUntil: 'load' });
});

Then('the user remains logged in', async function (this: ToolshopWorld) {
  // ASSERT
  await expect.poll(() => this.toolshopUi.getAccountMenuLabel()).not.toBeNull();
});

Then(
  '{string} returns status {int} after the reload',
  async function (this: ToolshopWorld, endpointSpec: string, status: number) {
    // ASSERT
    const { method, path } = parseEndpointSpec(endpointSpec);
    const checkpoint = (this.testData.reloadCheckpoint as number) ?? 0;
    await waitForLoggedResponseStatus(this, method, path, status, checkpoint);
  }
);

Then('the {string} page still renders authenticated content', async function (this: ToolshopWorld, path: string) {
  // ASSERT
  await expect(this.page).toHaveURL(new RegExp(`${path}$`));
  await expect(this.page.getByRole('heading', { name: 'My account' })).toBeVisible();
});

When('the user leaves both Email address and Password blank', async function (this: ToolshopWorld) {
  // ACT — explicit no-op fill to make the intent visible in the trace; a
  // freshly-navigated login page already starts with both fields empty.
  await this.toolshopUi.fillLoginForm({});
});
