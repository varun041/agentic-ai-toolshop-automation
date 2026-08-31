import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ToolshopWorld } from '../../../support/world';
import { TestDataFactory } from '../../../support/factories/TestDataFactory';
import { waitForNetworkResponse } from '../../../fixtures/toolshop.fixtures';

// ============================================================
// AA-13 — Logout
// "the user is logged out" and "the user navigates directly to {string}" and
// "the user is redirected to {string}" are also reused verbatim by AA-14's
// AA-1-TC-05-05 (aa-14.steps.ts) — defined here since AA-13 introduces them first.
// ============================================================

Given('the user is logged in', async function (this: ToolshopWorld) {
  // ARRANGE — relies on "a registered account exists" (aa-11.steps.ts)
  // having already populated this.testData.persona in this scenario.
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  await this.toolshopUi.navigateTo('/auth/login');
  await this.toolshopUi.login(persona.email, persona.password);
});

When('the user opens the account dropdown', async function (this: ToolshopWorld) {
  // ACT
  await this.toolshopUi.openAccountMenu();
});

When('the user clicks {string}', async function (this: ToolshopWorld, label: string) {
  // ACT
  await this.toolshopUi.clickNavItem(label);
});

Then('the user is navigated to the {string} page', async function (this: ToolshopWorld, path: string) {
  // ASSERT — same async session-check-driven redirect as "the user is
  // redirected to {string}" below; needs the same 15000ms headroom (see that
  // step's comment) rather than the 5000ms default. Healed 2026-08-12 after
  // AA-1-TC-04-01 timed out at 5000ms under load (Stage 9).
  await expect(this.page).toHaveURL(new RegExp(`${path}$`), { timeout: 15000 });
});

Then('the header reverts to showing the {string} link', async function (this: ToolshopWorld, _label: string) {
  // ASSERT
  await expect.poll(() => this.toolshopUi.getAccountMenuLabel()).toBeNull();
});

When('the user logs out', async function (this: ToolshopWorld) {
  // ACT
  await this.toolshopUi.logout();
});

Given('the user is logged out', async function (this: ToolshopWorld) {
  // ARRANGE — a freshly-created context (support/hooks.ts Before hook) has no
  // auth-token in localStorage by construction; nothing to do.
});

When('the user navigates directly to {string}', async function (this: ToolshopWorld, path: string) {
  // ACT
  await this.toolshopUi.navigateTo(path);
});

Then('the user is redirected to {string}', async function (this: ToolshopWorld, path: string) {
  // ASSERT — the redirect is real but asynchronous (~1-2s under light load,
  // confirmed live 2026-08-12 — see docs/epics/test_cases_AA-1.md Drift #4).
  // toHaveURL's built-in auto-retry is exactly what's needed here; do not
  // read this.page.url() synchronously instead, that reproduces the original
  // measurement-artifact bug that led to the wrong "no redirect" conclusion.
  // Timeout extended past the 5000ms default — observed flaking at both
  // 5000ms and 10000ms during separate full 40-scenario runs (heavier
  // load/demo-site slowness), while multiple isolated reruns passed
  // comfortably under 4s each; this is the same Cloudflare/shared-demo-store
  // risk already logged in test_plan_MASTER.md, not a code bug. 15000ms
  // gives real headroom without masking a genuine regression (if this ever
  // times out at 15s, that's worth a fresh look, not another bump). Given
  // it's flaked twice under load already, AA-1-TC-04-03/04-04/05-05 (which
  // share this step) are reasonable @flaky candidates for Stage 9's Test
  // Healer to formally tag if it recurs in CI — see test_cases_AA-1.md.
  await expect(this.page).toHaveURL(new RegExp(`${path}$`), { timeout: 15000 });
});

When(
  'the test observes network traffic for 5 seconds after logout completes',
  async function (this: ToolshopWorld) {
    // ACT — bounded wait for the app's own automatic post-logout call, not a
    // raw sleep (Rule 6). If it doesn't fire in time, the Then step's
    // waitForLoggedResponseStatus will report a clear timeout instead of
    // this silently swallowing the miss.
    try {
      await waitForNetworkResponse(this.page, '/users/refresh', 5000);
    } catch {
      // handled by the Then step's own wait — see aa-10.steps.ts's
      // "{string} returns status {int}"
    }
  }
);
