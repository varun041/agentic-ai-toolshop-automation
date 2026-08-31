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

**Follow-up (same day):** the self-hosted runner (Windows, `ICEN667`) needed two further environment
fixes before it could execute jobs at all — `shell: bash` forced on every step failed with
`bash: command not found` (the runner's service process doesn't inherit the interactive user's PATH,
where Git Bash lives) and, once removed, the default Windows PowerShell fell back to
`"running scripts is disabled on this system"` (execution policy `Undefined` at both `LocalMachine` and
`CurrentUser` scope defaults to `Restricted` on client Windows). Fixed by dropping the `shell:` override
entirely (none of these commands need bash-specific syntax) and running
`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once on the runner machine. Neither
was a code or app issue — both were one-time machine setup gaps.

## Existing Drift #8 pattern recurring on self-hosted infra (2026-08-13)

Once the runner was actually online and executing, `@smoke` passed cleanly on the first two runs, but
`@regression` (33 scenarios, ~3-6 min) hit the exact pattern `test_cases_AA-1.md` Drift #8 already
documents — a different scenario failing each run, always a `page.goto(..., {waitUntil:'load'})` timing
out at 30000ms with **zero response** (confirmed via each failing trace's `trace.trace` action log), never
a logic/assertion failure. Two consecutive runs: 3/33 then 1/33 failures, different TC IDs each time
(`AA-1-TC-01-04`, `AA-1-TC-04-03`, `AA-1-TC-05-04` → then just `AA-1-TC-01-07`) — 97% on the second run
already clears the ≥95% regression exit criterion on its own. This is the same known
Cloudflare/shared-demo-store instability under sustained automation already tracked in
`test_plan_AA-1.md`'s risk register, now visible on a new execution venue — not a new defect, and not
related to the Cloudflare-interstitial/runner-IP issue above (that showed a fully-rendered challenge page;
this shows no response at all, a plain network stall).

**Fix applied:** added `--retry 1` to `test:smoke`/`test:regression`/`test:api` in `package.json` so a
transient failure retries automatically within the same CI run instead of failing the whole job and
requiring a manual re-run. Does not mask genuine logic/assertion failures — those fail identically on
retry and still surface.
