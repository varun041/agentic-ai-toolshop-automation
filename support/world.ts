import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { ToolshopUi } from './ToolshopUi';
import { ToolshopApi } from './ToolshopApi';

// NOTE: architecture_AA-1.md §5 originally designed an addInitScript-based
// token-injection helper here (register + login via API, skip the UI login
// entirely). Stage 7's actual step definitions ended up NOT using it — most
// scenarios that need "an authenticated user" as a precondition (AA-13,
// AA-14) still drive a real UI login via ToolshopUi.login(), for consistency
// with AA-11's scenarios, which specifically test the login UI itself and
// can't use a shortcut. Keeping one authentication path (real UI login) used
// everywhere was judged more valuable than the speed a token-injection
// shortcut would add, so that helper was removed rather than left unused —
// see git history if it's ever worth reviving for a future epic that only
// needs "some logged-in user" and doesn't care about the login flow.

export class ToolshopWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  toolshopUi!: ToolshopUi;
  toolshopApi!: ToolshopApi;
  testData: Record<string, unknown> = {};

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(ToolshopWorld);
