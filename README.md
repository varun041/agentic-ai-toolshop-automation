# Toolshop Agentic AI Test Automation Framework

Playwright + TypeScript test automation for **Toolshop**, driven by a 13-stage,
human-gated AI agent pipeline. The full pipeline (every prompt, every stage, every
output artifact) is defined in [`AgenticPrompts.md`](AgenticPrompts.md) — this
README is the high-level orientation; that file is the operational playbook.

## Application Under Test

**Toolshop** — a public practice e-commerce storefront for buying tools online.

| Surface | URL |
|---|---|
| Web UI | https://practicesoftwaretesting.com/ |
| API (Swagger / OpenAPI docs) | https://api.practicesoftwaretesting.com/api/documentation |
| API base | https://api.practicesoftwaretesting.com |

Toolshop's catalog is organized into categories including Hand Tools, Power
Tools, Other, Special Tools, and Rentals. The UI is instrumented with
`data-test` attributes throughout, which the framework treats as the primary
selector strategy (see `AgenticPrompts.md` Stage 4/6 selector rules).

## Requirements Source of Truth: Jira

All requirements are tracked in Jira project **AA (Agentic_AI)** and read live
via the Jira MCP — Jira is authoritative, not this repo.

| Epic | Title |
|---|---|
| **AA-1** ◀ starting epic | User Authentication & Account Management |
| AA-2 | Product Catalog Browsing & Search |
| AA-3 | Shopping Cart Management |
| AA-4 | Checkout & Order Placement |
| AA-5 | Order History & Invoices |
| AA-6 | Favorites / Wishlist |
| AA-7 | Contact & Customer Support |
| AA-8 | Admin — Product & Catalog Management |
| AA-9 | Admin — Order & User Management |

The pipeline runs **one epic at a time**, in this dependency order, starting
with **AA-1**. AA-1's stories:

| Story | Title |
|---|---|
| AA-10 | Register a new customer account |
| AA-11 | Login with valid credentials |
| AA-12 | Login fails with invalid credentials |
| AA-13 | Logout |
| AA-14 | Update profile information |

## Framework

- **Runner:** [Playwright](https://playwright.dev/) + TypeScript (Chromium, Firefox, WebKit)
- **Design pattern:** Page Object Model (POM) — every page's locators and
  interactions live in one class (`ToolshopUi.ts` and friends, one class per
  page/domain area); step definitions and specs never contain raw locators,
  they only call POM methods
- **BDD layer:** Gherkin `.feature` files + Cucumber-style step definitions
  (one `.feature` file per Jira story, one `.steps.ts` per `.feature` file)
- **Reporting:** Allure — step-level execution timeline, screenshots and
  traces attached on failure, epic/story/severity annotations per test, pass-rate
  trend across runs, published as an HTML report (`allure-report/`) after every
  Stage 8 execution
- **Self-healing:** the Test Healer Agent (Stage 9) automatically diagnoses and
  patches failing tests — see [Self-Healing Tests](#self-healing-tests) below
- **CI:** GitHub Actions (`.github/workflows/playwright.yml`) — smoke on every
  PR, full regression nightly, critical-path + accessibility + performance on
  release
- **Support layer (built out epic by epic):**
  - `ToolshopUi.ts` — POM layer: all page interactions (never raw `page.*` in step defs)
  - `ToolshopApi.ts` — all HTTP calls (never raw `fetch`/`axios` in step defs)
  - `TestDataFactory.ts` — all test data (never hardcoded emails/names/addresses)
  - `ToolshopWorld` — typed shared context across Cucumber steps

The repo currently ships as a bare Playwright/TypeScript scaffold
(`playwright.config.ts`, `tests/example.spec.ts`); the structure above is built
up incrementally as each Jira epic runs through the pipeline in
`AgenticPrompts.md`.

### Document strategy

Every pipeline stage writes two kinds of output:

- **Epic file** — `docs/epics/{artifact}_{EPIC_KEY}.md`, created fresh per epic
- **Master file** — `docs/master/{artifact}_MASTER.md`, one row per epic,
  updated in place (never touching another epic's row)

## Test Case Format (Gherkin / Cucumber)

Every automated test case is authored as a Gherkin scenario before any
Playwright code is written (Stage 4 → Stage 5 → Stage 7). One `.feature` file
per Jira story, tagged for CI selection (`@smoke`, `@regression`,
`@cross-layer`, `@negative`, …):

```gherkin
@aa-1 @aa-11
Feature: Login with valid credentials
  As a registered customer
  I want to log in with my valid email/password
  So that I can access my account and shop

  Background:
    Given the base URL is "https://practicesoftwaretesting.com/"

  @smoke @critical-path @aa-1-tc-02-01
  Scenario: AA-1-TC-02-01 — Valid login redirects to the account page
    Given the user is on the "/auth/login" page
    When the user logs in with a registered email and password
    Then the user is redirected to the account page
    And the header shows the logged-in state
```

The matching `tests/step-definitions/{epic-folder}/{story-id}.steps.ts` file
implements each step by calling the POM (`ToolshopUi`) and API client
(`ToolshopApi`) — never raw Playwright calls (see the coding rules in
`AgenticPrompts.md` Stage 7).

## Self-Healing Tests

The **Test Healer Agent** (Stage 9) runs automatically whenever a test fails
in execution (Stage 8). It does not just retry — it diagnoses:

1. **Classify** the failure — test code defect, application change, genuine
   application bug, or environment flakiness
2. **Inspect** the Playwright trace (DOM snapshot, network, before/after
   element state) via the Playwright MCP
3. **Verify live** — navigate the real site via the Playwright MCP and compare
   against the failure screenshot
4. **Fix or escalate:**
   - Selector/assertion drift → patch `ToolshopUi.ts` / the `.steps.ts` file,
     tag the scenario `@healed-{YYYYMMDD}`
   - Genuine app bug → **no test change** — files a Jira bug via the Jira MCP
     and tags the scenario `@known-bug`
   - Environment flakiness → tags `@flaky`, quarantines from PR/nightly runs
5. **Re-verify** by re-running only the fixed scenario before handing back to
   Stage 8

Every heal is recorded in `docs/epics/heal_reports/heal_{TC_ID}_{timestamp}.md`
and rolled up in `docs/master/heal_MASTER.md`.

## AI Agents

The pipeline is orchestrated as **13 stages**, each with its own prompt in
`AgenticPrompts.md`, executed by **10 specialised agents**:

| # | Agent | Role |
|---|---|---|
| 1 | Test Generator Agent | Converts approved `.feature` files into Playwright step definitions |
| 2 | Code Reviewer Agent | Gate between generation and execution — 12 automated rule checks |
| 3 | Test Healer Agent | Diagnoses failing tests from trace/screenshot, applies or escalates a fix |
| 4 | Framework Health Checker | Weekly audit of deps, config drift, flaky tests, dead fixtures |
| 5 | Report Analyzer Agent | Parses Allure results into the stakeholder-readable execution report |
| 6 | Accessibility Reviewer | axe-core WCAG 2.1 AA checks on key pages |
| 7 | Performance Reviewer | Page-load and API timing vs. a stored baseline |
| 8 | Documentation Generator | Keeps README + master docs in sync after merge |
| 9 | Test Impact Analyzer | Computes the minimal re-run set from a code diff |
| 10 | Release Readiness Agent | 8-gate GO/NO-GO decision posted to the PR |

Stage flow: Requirements → Test Plan 🔴 → Scenarios → Test Cases 🔴 →
Automation Plan → Architecture → Test Generator → Code Review → Execute →
Heal (if needed) → Report → Commit → CI → PR 🔴. (🔴 = human approval gate.)
Full prompt text for every stage, plus the Release Readiness supplementary
prompt and the master-file initialisation prompt, is in `AgenticPrompts.md`.

## End-to-End Flow: Jira Story → Pull Request

For one epic, the pipeline runs these 13 stages (+ Stage 0 once, + Stage 7b
after every Stage 7 batch) in order, exactly as prompted in `AgenticPrompts.md`.
Each stage's output file is the next stage's input:

| # | Agent | Reads | Produces | MCP |
|---|---|---|---|---|
| 0 | Documentation Generator | — (run once before AA-1) | 14 empty `docs/master/*.md` skeletons | — |
| 1 | Requirements Capture Agent | Jira epic `{EPIC_KEY}` + child stories | `requirements_{EPIC_KEY}.md` (stories, ACs, pages, endpoints, edge cases) | **Jira** |
| 2 🔴 | Test Plan Agent | Stage 1 output | `test_plan_{EPIC_KEY}.md` (scope, strategy, entry/exit criteria) | — |
| 3 | Test Scenario Agent | Stage 1 + approved Stage 2 | `test_scenarios_{EPIC_KEY}.md` (positive/negative/boundary/cross-layer scenarios per story) | — |
| 4 🔴 | Test Case Agent | Stage 3 output | `test_cases_{EPIC_KEY}.md` — full **Gherkin** Given/When/Then per scenario | — |
| 5 | Automation Test Plan Agent | Approved Stage 4 | `automation_plan_{EPIC_KEY}.md` (automate now/later/manual, tagging, agent owners) + `features/{epic}/*.feature` | — |
| 6 | Automation Design Architecture Agent | Stage 5 output | `architecture_{EPIC_KEY}.md` — **POM** method design, API client design, fixtures, selector registry | — |
| 7 | Test Generator Agent | Stage 6 + one `.feature` file (repeats per Jira story) | `*.steps.ts` + `ToolshopUi`/`ToolshopApi`/`TestDataFactory` diffs | — |
| 7b | Code Reviewer Agent | All Stage 7 output | `code_review_{EPIC_KEY}.md` — **APPROVED** or **CHANGES REQUESTED** (blocks Stage 8 until clean) | — |
| 8 | Execution Agent | All generated specs | Runs smoke → regression → API-only, generates the **Allure** report, `execution_result_{EPIC_KEY}_{ts}.json` | **Playwright** |
| 9 | Test Healer Agent | Any failure from Stage 8 | Diagnoses + patches (or files a Jira bug) — see [Self-Healing Tests](#self-healing-tests); loops back to Stage 8 | **Playwright**, **Jira** |
| 10 | Report Analyzer Agent | Final Stage 8 result + all heal reports | `execution_report_{EPIC_KEY}_{ts}.md` — executive summary, coverage, trend, GO/HOLD recommendation | — |
| 11 | Commit & Push Agent | All epic artifacts for this run | New branch, commit, push to remote | **GitHub** |
| 12 | CI Trigger Agent | Pushed branch | Triggers & polls the `playwright.yml` workflow, `ci_result_{EPIC_KEY}_{ts}.json` | **GitHub** |
| 13 🔴 | Pull Request Agent | Stages 10–12 outputs | Opens the PR, links each Jira story as a comment, sets story status to "In Review" | **GitHub**, **Jira** |
| Supp. | Release Readiness Agent | All pipeline artifacts | Posts an 8-gate **GO/NO-GO** as the first PR comment; approves or requests changes | **GitHub**, **Jira** |

**Loops back, not straight-through:**
- Stage 8 fails → Stage 9 (Heal) → re-run Stage 8 → repeat until clean, then Stage 10
- Stage 12 (CI) fails → Stage 9 (Heal, using the CI failure) → Stage 8 → Stage 12 again
- Stage 13 (PR) only opens once CI (Stage 12) is green

**🔴 Human gates — the pipeline stops and waits for explicit approval:**
Stage 2 (test plan), Stage 4 (Gherkin test cases), Stage 13 (PR merge — the
Release Readiness GO/NO-GO is advisory only; a human always makes the merge call).

## MCP Servers

Configured in [`.mcp.json`](.mcp.json), credentials in `.env` (see
`.env.example`):

| MCP | Package | Used for |
|---|---|---|
| `jira` | `@bodywave/jira-mcp` | Reading epics/stories from project AA, filing bugs found by the Test Healer Agent, posting Release Readiness comments |
| `github` | `@modelcontextprotocol/server-github` | Branch creation, commits, PR creation/review, triggering and polling CI |
| `playwright-mcp` | `@dinesh-nalla-se/playwright-mcp` | Live browser inspection during Stage 9 healing (trace/DOM/screenshot comparison against the live site) |

## Getting Started

```bash
npm install
npx playwright install --with-deps
npx playwright test          # run the current suite
npx playwright show-report   # view the HTML report
```

To run the agent pipeline: open `AgenticPrompts.md`, run the **Master File
Initialisation Prompt** once, then feed **Stage 1** for epic `AA-1` to begin.
