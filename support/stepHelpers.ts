import { expect, Response } from '@playwright/test';
import { ToolshopWorld } from './world';

export { personaToFormFields, personaToApiPayload } from './personaAdapters';

/** Polls the scenario's network log (populated by support/hooks.ts's Before
 * hook) until the MOST RECENT response matching method + URL substring has
 * the expected status, or times out. Covers both explicitly-triggered calls
 * and ones the app fires on its own (e.g. the automatic GET /users/me
 * session check, or the post-logout GET /users/refresh in AA-1-TC-04-05).
 *
 * Deliberately polls on the STATUS, not just on "a match exists" — confirmed
 * live 2026-08-12 that GET /users/me is called twice in quick succession
 * around a login/reload (an initial 401 from the outgoing page's session
 * check, then a 200 once the new page's own check runs). An earlier version
 * of this helper polled only for presence of any match, which meant
 * expect.poll stopped as soon as it saw the stale 401 and never waited for
 * the 200 that followed — always asserting against the wrong response. Do
 * not "simplify" this back to a presence check. */
export async function waitForLoggedResponseStatus(
  world: ToolshopWorld,
  method: string,
  urlIncludes: string,
  expectedStatus: number,
  sinceIndex = 0,
  timeoutMs = 10000
): Promise<void> {
  await expect
    .poll(
      () => {
        const log = (world.testData.networkLog as Response[]).slice(sinceIndex);
        const match = [...log].reverse().find((r) => r.request().method() === method && r.url().includes(urlIncludes));
        return match?.status();
      },
      { timeout: timeoutMs }
    )
    .toBe(expectedStatus);
}

/** Splits an "{METHOD} {path}" Gherkin string (e.g. "POST /users/register")
 * into its parts for waitForLoggedResponseStatus. */
export function parseEndpointSpec(spec: string): { method: string; path: string } {
  const [method, ...rest] = spec.split(' ');
  return { method, path: rest.join(' ') };
}
