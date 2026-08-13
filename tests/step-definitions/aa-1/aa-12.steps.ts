import { Given, When } from '@cucumber/cucumber';
import { ToolshopWorld } from '../../../support/world';
import { TestDataFactory } from '../../../support/factories/TestDataFactory';
import { personaToApiPayload } from '../../../support/personaAdapters';

// ============================================================
// AA-12 — Login fails with invalid credentials
// ============================================================

Given('an account already exists for a registered email', async function (this: ToolshopWorld) {
  // ARRANGE
  const persona = TestDataFactory.registerPersona();
  await this.toolshopApi.registerViaApi(personaToApiPayload(persona));
  this.testData.persona = persona;
});

When('the user enters the correct email with an incorrect password', async function (this: ToolshopWorld) {
  // ACT
  const persona = this.testData.persona as ReturnType<typeof TestDataFactory.registerPersona>;
  const { password: wrongPassword } = TestDataFactory.loginWrongCredentials();
  await this.toolshopUi.fillLoginForm({ Email: persona.email, Password: wrongPassword });
});

When('the user enters a non-existent email and any password', async function (this: ToolshopWorld) {
  // ACT
  const { password: anyPassword } = TestDataFactory.loginWrongCredentials();
  await this.toolshopUi.fillLoginForm({ Email: `nonexistent_${Date.now()}@qa.io`, Password: anyPassword });
});

Given('a login attempt has just failed with an incorrect password', async function (this: ToolshopWorld) {
  // ARRANGE — deliberately NOT toolshopUi.login(), which waits for a
  // successful redirect to /account that a wrong-password attempt will never
  // produce (it would hang for login()'s full 10s timeout and then throw).
  const persona = TestDataFactory.registerPersona();
  await this.toolshopApi.registerViaApi(personaToApiPayload(persona));
  const { password: wrongPassword } = TestDataFactory.loginWrongCredentials();
  await this.toolshopUi.navigateTo('/auth/login');
  await this.toolshopUi.fillLoginForm({ Email: persona.email, Password: wrongPassword });
  await this.toolshopUi.clickButton('Login');
});

When('the test checks session state via {string}', async function (this: ToolshopWorld, _endpointSpec: string) {
  // ACT — genuine direct API call (Pattern B, see architecture_AA-1.md §7),
  // not a network-log interception, since there's no UI event to observe here.
  this.testData.meResult = await this.toolshopApi.getMe();
});

When('the user leaves the {string} field blank', async function (this: ToolshopWorld, field: 'Email' | 'Password') {
  // ACT — fill both with placeholder-valid values, then blank out only the
  // field under test, so the assertion isolates that field's validation.
  const placeholder = TestDataFactory.loginPlaceholderCredentials();
  await this.toolshopUi.fillLoginForm({ Email: placeholder.email, Password: placeholder.password });
  await this.toolshopUi.fillLoginForm({ [field]: '' });
});
