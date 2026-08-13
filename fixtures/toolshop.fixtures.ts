import { Page, Response } from '@playwright/test';

/**
 * NOTE on naming: docs/epics/architecture_AA-1.md §5 designed an
 * "authenticatedPage fixture" using Playwright Test's `test.extend()` fixture
 * API. This project uses Cucumber as the runner (not `@playwright/test`'s own
 * runner), so that API isn't available — `test.extend()` only exists inside
 * Playwright's own test runner. The equivalent logic lives as
 * `ToolshopWorld.loginAsFreshPersona()` in support/world.ts instead, since
 * Cucumber's World is the natural per-scenario state container. This file
 * holds framework-level helpers that don't belong on the World or on either
 * POM class — currently just the bounded network-wait helper below.
 */

/**
 * Waits up to `timeoutMs` for a response matching `urlIncludes`, without using
 * page.waitForTimeout (forbidden by Rule 6 — see AgenticPrompts.md Stage 7).
 * Used by AA-1-TC-04-05's "observes network traffic for ~5 seconds" step,
 * which needs to wait for the app's own automatic post-logout call rather
 * than trigger one itself.
 */
export async function waitForNetworkResponse(
  page: Page,
  urlIncludes: string,
  timeoutMs = 5000
): Promise<Response> {
  return page.waitForResponse((r) => r.url().includes(urlIncludes), { timeout: timeoutMs });
}
