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
