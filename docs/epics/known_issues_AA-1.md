# Known Issues — AA-1

Issues observed during Stage 8/9 execution that were not fixed via test code changes — either because
they're environmental (Category D) or application defects tracked separately (Category C). For live-app
behavior drift caught during earlier pipeline stages, see `docs/epics/test_cases_AA-1.md`'s own Drift
log; this file is specifically for Stage 9 (Execute/Heal) findings.

| TC ID | Category | Description | First seen | Recurrence | Action |
|---|---|---|---|---|---|
| AA-1-TC-04-05 | D — Environment | `page.goto` failed with `net::ERR_NETWORK_CHANGED` during login | 2026-08-12 | 0 (re-ran clean 2x after) | None — see `docs/epics/heal_reports/heal_AA-1-TC-04-05_20260812.md`. Not tagged `@flaky` (single occurrence, distinct root cause from the Cloudflare/demo-store load pattern already tracked as Drift #8) |

**Established environmental flake pattern (for reference, not new):** `test_cases_AA-1.md` Drift #8
already documents Cloudflare/shared-demo-store load slowness under 4-6 minutes of sustained automation.
`AA-1-TC-04-01` and `AA-1-TC-05-02` initially looked like instances of this same pattern (see their heal
reports) but were diagnosed as genuine Category A test-code races/inconsistencies and fixed, not just
timeout-bumped or @flaky-tagged — see `docs/epics/heal_reports/heal_AA-1-TC-04-01_20260812.md` and
`heal_AA-1-TC-05-02_20260812.md`.

## CI infrastructure — GitHub-hosted runners blocked by Cloudflare (2026-08-13)

**Not a test-code or app defect.** The first CI run on `varun_08_06_26`
([run 31699256448](https://github.com/varun041/agentic-ai-toolshop-automation/actions/runs/31699256448))
failed all 7 `@smoke` scenarios with `Process completed with exit code 1` and effectively no log output
(Cucumber's summary goes to `summary.txt`, not stdout — see the reporter config note in `cucumber.js`).
Downloading the run's `failure-diagnostics` artifact and inspecting the per-scenario screenshots showed
every single scenario stuck on `practicesoftwaretesting.com`'s Cloudflare "Performing security
verification" interstitial (Turnstile challenge, distinct Ray ID per request) instead of reaching real
app content — each scenario ran until Cucumber's 30s step timeout, ~30s apart, matching the interstitial
hang exactly.

**Root cause:** Cloudflare's bot-protection heuristics challenge GitHub Actions' shared `ubuntu-latest`
runners (well-known datacenter IP ranges) far more aggressively than normal residential/corporate IPs.
Every local run this entire framework has ever produced — dozens of full smoke/regression/API cycles
across Stages 7 through 11 — passed cleanly against the same live site from a normal developer machine
with zero Cloudflare interstitials. Confirmed by inspecting two independent scenarios' screenshots from
the run (different Ray IDs, same interstitial), and by the ~30s-apart timestamp pattern across all 7
failures.

**Fix applied:** `.github/workflows/playwright.yml` changed from `runs-on: ubuntu-latest` to
`runs-on: self-hosted` — a self-hosted runner uses a normal (non-datacenter) IP, matching every local run
that has ever passed. **Requires a self-hosted runner to be registered under this repo/org
(Settings → Actions → Runners → New self-hosted runner) before the workflow can succeed** — the workflow
change alone does not fix anything until a runner is online.

**Action:** No test code change. No Jira bug (not an app defect — Cloudflare protecting the demo site is
expected/legitimate behavior, just incompatible with GitHub-hosted runner IPs specifically).
