# Toolshop Agentic AI Automation — Master Prompt Playbook
# Version: 3.0 — 10 Specialised Agents | Gherkin Feature Files | Hybrid Docs
# Source: README.md — Toolshop Agentic Test Automation Framework
# UI: https://practicesoftwaretesting.com/ | API (Swagger docs): https://api.practicesoftwaretesting.com/api/documentation
# Jira Project: AA (Agentic_AI) | Epics: AA-1 to AA-9 | Starting epic: AA-1

---
## HOW TO USE THIS FILE

- Feed each STAGE prompt to Claude one at a time
- Every stage produces named OUTPUT ARTIFACTS — save them before moving to the next stage
- Stages 1–7b are documentation/design + code generation artifacts
- Stages 8–13 are execution artifacts (run, heal, report, CI, PR)
- Human approval gates are marked 🔴 HUMAN GATE — pause and wait for approval
- Variables in {curly braces} must be substituted before sending

## STAGE FLOW OVERVIEW

  Stage 0    — Master file initialisation (run ONCE before AA-1)
  Stage 1    — Requirements Capture Agent     → requirements_{EPIC_KEY}.md
  Stage 2 🔴 — Test Plan Agent               → test_plan_{EPIC_KEY}.md (human gate)
  Stage 3    — Test Scenario Agent            → test_scenarios_{EPIC_KEY}.md
  Stage 4 🔴 — Test Case Agent               → test_cases_{EPIC_KEY}.md (human gate)
  Stage 5    — Automation Test Plan Agent     → automation_plan_{EPIC_KEY}.md
                                                features/{epic-folder}/*.feature
                                                10 Agent roster assignments
  Stage 6    — Architecture Design Agent      → architecture_{EPIC_KEY}.md
                                                Step definition mapping
                                                Selector registry
  Stage 7    — Test Generator Agent          → *.steps.ts + ToolshopUi/ToolshopApi diffs
               (repeat per Jira Story)
  Stage 7b   — Code Reviewer Agent           → code_review_{EPIC_KEY}.md
               (runs after all Stage 7 stories)   APPROVED or CHANGES REQUESTED
  Stage 8    — Execution Agent               → execution_result_{EPIC_KEY}.json
  Stage 9    — Test Healer Agent             → heal_report_{TC_ID}.md (if failures)
  Stage 10   — Report Analyzer Agent         → execution_report_{EPIC_KEY}.md
  Stage 11   — Commit & Push Agent           → pushed branch
  Stage 12   — CI Trigger Agent              → ci_result_{EPIC_KEY}.json
  Stage 13 🔴 — Pull Request Agent           → PR (human gate for merge)
  Supp.      — Release Readiness Agent       → GO/NO-GO PR comment (8 gates)

## THE 10 SPECIALISED AGENTS

  1.  Test Generator Agent       Writes step definitions from .feature files
  2.  Code Reviewer Agent        Reviews generated code before execution
  3.  Test Healer Agent          Diagnoses and patches failing tests
  4.  Framework Health Checker   Weekly framework audit (deps, flaky trends)
  5.  Report Analyzer Agent      Parses Allure results, produces Stage 10 report
  6.  Accessibility Reviewer     axe-core WCAG 2.1 AA checks on UI pages
  7.  Performance Reviewer       Page-load + API timing vs baseline
  8.  Documentation Generator    Keeps README + master files in sync post-merge
  9.  Test Impact Analyzer       Minimal re-run set from code diff
  10. Release Readiness Agent    8-gate GO/NO-GO before PR merge

## DOCUMENT STRATEGY (applies to ALL stages)

Every stage produces TWO types of output files — always, without exception:

  TYPE 1 — EPIC FILE (new file per epic, full detail)
  Location: docs/epics/{artifact_name}_{EPIC_KEY}.md
  Rule: Create fresh for each epic. Never modify another epic's file.
  Purpose: Agent context for downstream stages. Focused, small, safe to pass as input.

  TYPE 2 — MASTER FILE (one file for the whole project, dashboard only)
  Location: docs/master/{artifact_name}_MASTER.md
  Rule: UPDATE only the row/section for the current epic. Never touch other epics' rows.
  Purpose: Human dashboard. Single-page view of all 9 epics' status at a glance.

  MASTER FILE UPDATE RULE:
  When updating the master file, the agent must:
  a) Read the existing master file first
  b) Locate ONLY the row/section for {EPIC_KEY}
  c) Update that row/section only
  d) Leave all other epics' rows exactly as they are
  e) Write the full file back (not append — full overwrite with targeted change)

## EPIC EXECUTION ORDER (one at a time, in this sequence)

  Corrected 2026-08-06 to match the actual Jira epics under project AA (Agentic_AI),
  read live via the Jira MCP. This table replaces the earlier nopCommerce/NOP-E0x
  scaffold — Jira is the source of truth and now matches it exactly. Pipeline
  execution BEGINS with AA-1 (Auth); the remaining epics follow in this dependency
  order once AA-1's 13-stage pipeline is merged.

  1st AA-1 — User Authentication & Account Management      (no dependencies; storageState generated here, reused by all) ◀ START HERE
  2nd AA-2 — Product Catalog Browsing & Search              (needs auth)
  3rd AA-3 — Shopping Cart Management                       (needs catalog)
  4th AA-4 — Checkout & Order Placement                     (needs cart)
  5th AA-5 — Order History & Invoices                       (needs checkout)
  6th AA-6 — Favorites / Wishlist                           (needs catalog)
  7th AA-7 — Contact & Customer Support                     (no functional dependency — can run any time after AA-1)
  8th AA-8 — Admin — Product & Catalog Management           (needs auth; separate admin session)
  9th AA-9 — Admin — Order & User Management                (needs AA-8 + AA-4/AA-5 data to manage)

---

================================================================================
STAGE 1 — REQUIREMENTS CAPTURE AGENT
================================================================================

PROMPT:
-------
You are the Requirements Capture Agent for the Toolshop Agentic Test Automation
Framework. Your job is to read the Jira Epic and its child Stories from the AA
project and produce a structured requirements document that every downstream agent
will use as its single source of truth.

CONTEXT:
- Application under test (UI): https://practicesoftwaretesting.com/ (Toolshop)
- Application under test (API): https://api.practicesoftwaretesting.com
  (Swagger / OpenAPI docs: https://api.practicesoftwaretesting.com/api/documentation —
  confirm exact auth endpoint, e.g. POST /users/login, against the live docs in this stage)
- Jira project key: AA (Agentic_AI)
- Epic to process: AA-1
- Epic title: User Authentication & Account Management
- Stories under this epic:
    AA-10 — Register a new customer account
    AA-11 — Login with valid credentials
    AA-12 — Login fails with invalid credentials
    AA-13 — Logout
    AA-14 — Update profile information
- Epic sequence position: 1st of 9 — no dependencies (AA-1 is the starting epic)

TASK:
1. For each Jira Story under the epic, extract and structure:
   a. Story ID and title
   b. User story statement (As a / I want / So that)
   c. All acceptance criteria (numbered list, exact text from Jira)
   d. Any linked requirements, constraints, or dependencies on other epics
   e. Priority (Critical / High / Medium / Low)
   f. Definition of Done from Jira

2. List all real pages and URLs on practicesoftwaretesting.com in scope
   (e.g. /auth/login, /auth/register, /account — confirm exact routes by
   navigating the live site; do not assume nopCommerce-style paths)

3. List all API endpoints in scope (controller + HTTP method + path)

4. Identify edge cases mentioned explicitly or implicitly in the acceptance criteria

5. Flag any ambiguities or missing acceptance criteria that need clarification
   before test design begins

6. List any dependencies on previously completed epics
   (e.g. "Requires storageState from AA-1")

OUTPUT FORMAT — Produce a markdown document with these exact sections:
  ## Epic Summary
  ## Stories (one sub-section per story with all 6 fields)
  ## Pages & URLs In Scope
  ## API Endpoints In Scope
  ## Dependencies On Other Epics
  ## Edge Cases Identified
  ## Ambiguities & Clarification Needed

OUTPUT ARTIFACTS:
  EPIC FILE  → docs/epics/requirements_{EPIC_KEY}.md        (create new)
  MASTER FILE → docs/master/requirements_MASTER.md          (update {EPIC_KEY} row only)

  Master file row to update (under ## Requirements Status table):
  | {EPIC_KEY} | {EPIC_TITLE} | ✅ Complete | {story count} stories | {timestamp} |

NEXT STAGE: Feed docs/epics/requirements_{EPIC_KEY}.md as context to Stage 2.

================================================================================
STAGE 2 — TEST PLAN AGENT
================================================================================

PROMPT:
-------
You are the Test Plan Agent for the Toolshop Agentic Test Automation Framework.
Using the requirements document produced in Stage 1, create a formal test plan
for epic {EPIC_KEY} — {EPIC_TITLE}.

CONTEXT (attach docs/epics/requirements_{EPIC_KEY}.md):
- Application UI: https://practicesoftwaretesting.com
- Application API: https://api.practicesoftwaretesting.com/api/documentation
- Automation stack: Playwright + TypeScript, Allure reporting, GitHub Actions CI
- Test layers: UI (browser), API (APIRequestContext), Cross-layer (API setup + UI assert)
- Environments: Demo store only (shared, no data reset between runs)
- Browser targets: Chromium (primary), Firefox, WebKit
- Epic sequence position: 1st of 9 (fill in accordingly for later epics, e.g. "3rd of 9")
- storageState dependency: No — this IS AA-1 (later epics: Yes — from AA-1)

IMPORTANT — DO NOT duplicate project-wide content:
The following items are already written in docs/master/test_plan_MASTER.md and must
NOT be repeated in the epic file. Reference the master file instead:
  - Overall auth strategy (storageState reuse)
  - Overall data strategy (faker timestamps, API seeding)
  - CI pipeline configuration (GitHub Actions setup)
  - Project-wide risk register items (shared demo store, network flakiness)
  - Overall tagging strategy (@smoke, @regression, @critical-path)
  Write ONLY what is specific to this epic.

TASK — Produce the epic test plan with ALL of these sections:

1. SCOPE
   - Features included (from requirements doc, specific to this epic)
   - Features explicitly out of scope and why
   - Reference to master test plan: "See docs/master/test_plan_MASTER.md §Project Strategy"

2. TEST OBJECTIVES
   - What this epic's tests aim to validate
   - Quality risks specific to this epic being mitigated

3. TEST STRATEGY (epic-specific decisions only)
   - Layer decision per story: UI / API / Cross-layer — with justification
   - Why cross-layer tests are used for stories spanning both surfaces
   - Any epic-specific data setup approach

4. TEST ENVIRONMENTS
   - Specific URLs and pages for this epic
   - Any epic-specific credentials or tokens needed
   - Dependencies on other epics' test data

5. ENTRY CRITERIA (specific to this epic)
   - Previous epic in sequence must be merged: {PREVIOUS_EPIC_KEY}
   - storageState file available from AA-1 (if applicable)
   - Specific pre-conditions for this epic's features

6. EXIT CRITERIA
   - @smoke pass rate: 100%
   - @regression pass rate: ≥ 95%
   - Story coverage: 100% of this epic's stories have ≥ 1 automated test
   - Allure report generated
   - Zero P1/P2 open defects linked to this epic

7. RISK REGISTER (epic-specific risks only)
   - Risk | Likelihood | Impact | Mitigation
   - Example for Cart epic: "Shared cart state between parallel tests | High | High | workers:2"

8. TEST TYPES IN SCOPE
   - Which of these apply: Functional | Negative | Boundary | Cross-layer |
     Accessibility | Visual regression

9. DEFECT MANAGEMENT
   - How failures in THIS epic map back to Jira stories
   - Severity classification for this epic's failures

10. SCHEDULE
    - @smoke target: < {N} min (pro-rate based on story count)
    - @regression target: < {N} min
    - When in the nightly pipeline: position {N} of 9

11. STORIES COVERED
    - Table: Story ID | Title | Priority | Layer | Smoke? | Regression?

OUTPUT FORMAT: Formal markdown document

OUTPUT ARTIFACTS:
  EPIC FILE   → docs/epics/test_plan_{EPIC_KEY}.md           (create new)
  MASTER FILE → docs/master/test_plan_MASTER.md              (update {EPIC_KEY} row only)

  Master file row to update (under ## Test Plan Status table):
  | {EPIC_KEY} | {EPIC_TITLE} | ⏳ Pending Human Approval | {story count} | {timestamp} |

  After human approval, agent updates master row to:
  | {EPIC_KEY} | {EPIC_TITLE} | ✅ Approved | {story count} | {approved timestamp} |

  The master file also contains (written ONCE for AA-1, never changed again):
  ## Project-wide Test Strategy
  ## Project-wide Risk Register
  ## Overall CI Pipeline
  These sections must NOT be touched by any subsequent epic's Stage 2 run.

🔴 HUMAN GATE:
Present docs/epics/test_plan_{EPIC_KEY}.md for QA Lead review and approval.
DO NOT proceed to Stage 3 until approved.
On approval: update master file row status to ✅ Approved.

NEXT STAGE: Feed docs/epics/test_plan_{EPIC_KEY}.md as context to Stage 3.

================================================================================
STAGE 3 — TEST SCENARIO AGENT
================================================================================

PROMPT:
-------
You are the Test Scenario Agent for the Toolshop Agentic Test Automation Framework.
Using the requirements document (Stage 1) and approved test plan (Stage 2), generate
comprehensive test scenarios for epic {EPIC_KEY} — {EPIC_TITLE}.

CONTEXT (attach the following):
- docs/epics/requirements_{EPIC_KEY}.md  (Stage 1 output)
- docs/epics/test_plan_{EPIC_KEY}.md     (Stage 2 output — approved)
- UI: https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com/api/documentation

TASK:
For every Jira Story in the epic, produce test scenarios following these rules:

SCENARIO ID FORMAT:
  {EPIC_KEY}-SC-{Story number}-{Scenario number}
  Example: AA-3-SC-01-03 (Epic E04, Story 01, Scenario 03)

EACH SCENARIO MUST HAVE:
  ID | Story ID | Title | Type | Priority | Layer | Preconditions | Description |
  Expected Result | Test Data Notes | Traceability (AC number)

TYPES: Positive | Negative | Boundary | Edge | Cross-layer | Visual | Accessibility
LAYER: UI | API | Cross-layer
PRIORITY: P1 (Critical) | P2 (High) | P3 (Medium) | P4 (Low)

MANDATORY COVERAGE PER STORY:
1. Happy path — at least 1 positive scenario
2. Required field validation — at least 1 negative scenario
3. Invalid/malformed input — at least 1 negative scenario
4. Boundary values where applicable (max qty, min price, max chars, etc.)
5. Edge cases identified in Stage 1 requirements doc
6. Cross-layer scenario if the story spans UI + API surfaces
7. Authenticated vs unauthenticated access where relevant

EPIC-SPECIFIC SCENARIO GUIDANCE:
{Paste story-specific scenario notes here before sending. Example for the
starting epic, AA-1 — User Authentication & Account Management:}
  AA-10 Register: duplicate email is rejected (negative) | required-field
    validation per field (negative) | successful registration redirects to
    login or auto-logs in (positive)
  AA-11 Login (valid): session persists across navigation (positive) |
    logged-in state reflected in header/nav (positive)
  AA-12 Login (invalid): wrong password vs non-existent email both show the
    SAME generic error — no user enumeration (negative, security-relevant) |
    no session/token created on failed login (negative, cross-layer)
  AA-13 Logout: protected pages redirect to login after logout (negative) |
    header reverts to logged-out state (positive)
  AA-14 Update profile: pre-filled form (positive) | malformed email rejected
    with field-level error (negative)
  Cross-cutting: unauthenticated access to protected pages (account, cart
    checkout) redirects to login (cross-layer, applies to every story here)

OUTPUT FORMAT:
Grouped markdown table per Story ID.

SUMMARY SECTION at end of epic file:
  Total scenarios: N
  By type:     Positive: N | Negative: N | Boundary: N | Edge: N | Cross-layer: N
  By layer:    UI: N | API: N | Cross-layer: N
  By priority: P1: N | P2: N | P3: N | P4: N

OUTPUT ARTIFACTS:
  EPIC FILE   → docs/epics/test_scenarios_{EPIC_KEY}.md      (create new)
  MASTER FILE → docs/master/test_scenarios_MASTER.md         (update {EPIC_KEY} row only)

  Master file row to update (under ## Scenario Coverage table):
  | {EPIC_KEY} | {EPIC_TITLE} | ✅ Complete | {total} | P1:{n} P2:{n} P3:{n} | {timestamp} |

NEXT STAGE: Feed docs/epics/test_scenarios_{EPIC_KEY}.md as context to Stage 4.

================================================================================
STAGE 4 — TEST CASE AGENT
================================================================================

PROMPT:
-------
You are the Test Case Agent for the Toolshop Agentic Test Automation Framework.
Using the test scenarios from Stage 3, write detailed Gherkin (Given/When/Then)
test cases for epic {EPIC_KEY} — {EPIC_TITLE}.

CONTEXT (attach the following):
- docs/epics/test_scenarios_{EPIC_KEY}.md   (Stage 3 output)
- docs/epics/requirements_{EPIC_KEY}.md     (Stage 1 output — for AC traceability)
- UI base URL: https://practicesoftwaretesting.com/
- API base URL: https://api.practicesoftwaretesting.com (Swagger docs: https://api.practicesoftwaretesting.com/api/documentation)
- Test user: Email: {TEST_EMAIL} | Password: {TEST_PASSWORD}
- Admin user: Email: {ADMIN_EMAIL} | Password: {ADMIN_PASSWORD}
- Selectors: Toolshop is instrumented with `data-test` attributes throughout
  (e.g. `[data-test="login-submit"]`) — prefer `page.getByTestId()` /
  `[data-test="..."]` first, then role > label > placeholder > text. This is
  the opposite convention from the old nopCommerce guidance (no data-testid) —
  do not fall back to that assumption.
- Real product/category names to reference: pull live from the catalog —
  known categories (from Jira AA-2/AA-15): "Hand Tools", "Power Tools",
  "Other", "Special Tools", "Rentals"
- Real URLs to reference (confirm exact paths during Stage 1 discovery —
  do not assume nopCommerce-style paths like /customer/orders):
  /auth/login, /auth/register, /account, /cart, /checkout, /account/favorites

TEST CASE ID FORMAT:
  {EPIC_KEY}-TC-{Story number}-{Scenario number}
  Example: AA-3-TC-01-03

EACH TEST CASE MUST USE THIS EXACT STRUCTURE:
---
### {TEST_CASE_ID} — {TITLE}

**Scenario ID:** {SCENARIO_ID}
**Story:** {STORY_ID}
**Type:** {TYPE}
**Layer:** {LAYER}
**Priority:** {PRIORITY}

**Preconditions:**
- (bullet list — be specific, e.g. "User is logged in as {TEST_EMAIL}")
- (e.g. "Product 'Combination Pliers' has stock > 0" — verify real product/stock via the live catalog)

**Test Data:**
- (specific values — email, product, coupon, qty, address fields)
- Dynamic fields: email = `test_{timestamp}@qa.io`

**Steps (Gherkin):**
```gherkin
Given {specific initial state on practicesoftwaretesting.com}
  And {additional precondition}
When {specific user action with exact UI element name}
  And {next action}
Then {observable expected result — exact text or URL}
  And {second assertion}
  And {API state assertion for cross-layer tests}
```

**API Contract** (for API and Cross-layer tests only):
- Endpoint: {HTTP METHOD} {full path}
- Request body: {JSON}
- Expected status: {N}
- Expected response fields: {list}

**Negative Validation** (for negative tests only):
- Invalid input: {exact value}
- Expected error message: {exact text from practicesoftwaretesting.com}
- Where displayed: {field-level inline / top banner / toast}

**Traceability:** {STORY_ID} → AC#{N} — "{exact AC text}"
---

GHERKIN WRITING RULES — MUST FOLLOW:
1. Steps must be specific — no vague language like "the page works correctly"
2. Use EXACT button/label/error text from practicesoftwaretesting.com
3. Every Then step must assert something observable (text, URL, element, API status)
4. Cross-layer Then steps must include BOTH a UI assertion AND an API assertion
5. Negative tests must reference the exact error message shown on the live site
6. Reference real product names and real URLs from the live demo store
7. Dynamic test data must use timestamp pattern to avoid collisions

MASTER FILE UPDATE RULE:
After generating all test cases, update the master summary table only.
Do not copy test case content into the master file — it is reference-linked only.

OUTPUT ARTIFACTS:
  EPIC FILE   → docs/epics/test_cases_{EPIC_KEY}.md          (create new)
  MASTER FILE → docs/master/test_cases_MASTER.md             (update {EPIC_KEY} row only)

  Master file row to update (under ## Test Case Coverage table):
  | {EPIC_KEY} | {EPIC_TITLE} | ✅ Complete | {total TCs} | UI:{n} API:{n} XL:{n} | {timestamp} |

🔴 HUMAN GATE:
Present docs/epics/test_cases_{EPIC_KEY}.md for QA Lead review.
DO NOT proceed to Stage 5 until approved.
On approval: update master row status to ✅ Approved.

NEXT STAGE: Feed docs/epics/test_cases_{EPIC_KEY}.md as context to Stage 5.

================================================================================
STAGE 5 — AUTOMATION TEST PLAN AGENT
================================================================================

PROMPT:
-------
You are the Automation Test Plan Agent for the Toolshop Agentic Test Automation
Framework. Given the approved test case document from Stage 4, produce the complete
automation test plan for epic {EPIC_KEY} — {EPIC_TITLE}.

This plan must cover three things:
  A. WHAT to automate (decision table, tagging, prioritisation)
  B. HOW to structure it (Gherkin feature files + Playwright spec mapping)
  C. WHICH agent owns EACH test case at every stage of its lifecycle

CONTEXT (attach ALL of the following):
- docs/epics/test_cases_{EPIC_KEY}.md       (Stage 4 output — approved Gherkin test cases)
- docs/epics/test_plan_{EPIC_KEY}.md        (Stage 2 output — schedule targets, exit criteria)
- docs/epics/requirements_{EPIC_KEY}.md     (Stage 1 output — for story traceability)
- CI runtime budget: @smoke ≤ 5 min per epic | @regression ≤ 30 min per epic
- Automation stack: Playwright + TypeScript + Cucumber/Gherkin + Allure
- Team capacity: {N} engineers | {N} story points per sprint for automation

================================================================================
SECTION A — AUTOMATION DECISION TABLE
================================================================================

For EVERY test case ID in docs/epics/test_cases_{EPIC_KEY}.md, assign one decision:

  AUTOMATE NOW
  Criteria: stable UI/API, repeatable, no CAPTCHA, no real email delivery needed,
  no manual judgment required, can be expressed in Gherkin unambiguously.

  AUTOMATE LATER
  Criteria: needs test environment improvement, complex multi-system setup,
  browser-specific edge, or dependency on a not-yet-automated epic.

  MANUAL ONLY
  Criteria: exploratory testing, CAPTCHA, email link verification, pure UX/visual
  judgment, or one-time data migration validation.

TABLE FORMAT — produce this exact table:
| TC ID | Title | Layer | Priority | Decision | Agent Owner | Justification |
|---|---|---|---|---|---|---|
| {ID} | {title} | UI/API/XL | P1-P4 | AUTOMATE NOW | {agent name} | {one sentence} |

AGENT OWNER — assign the primary responsible agent from the roster below:
(Full roster defined in Section C)
  - Test Generator Agent      (writes the feature file + spec)
  - Code Reviewer Agent       (reviews before merge)
  - Test Healer Agent         (fixes on failure)
  - Accessibility Reviewer    (owns @accessibility tagged cases)
  - Performance Reviewer      (owns @performance tagged cases)
  - Report Analyzer Agent     (consumes all results)
  - Release Readiness Agent   (gates the PR)
  - Test Impact Analyzer      (decides minimal re-run set)
  - Framework Health Checker  (owns framework-level health checks — not tied to a Jira epic)
  - Documentation Generator   (keeps feature files and docs in sync)

================================================================================
SECTION B — GHERKIN FEATURE FILE STRUCTURE
================================================================================

All "AUTOMATE NOW" test cases must be written as Gherkin scenarios in ONE .feature file
per epic — NOT one per Jira Story. All of the epic's stories share a single `Feature:`
block, sectioned by story with comment dividers, distinguished by tags. The Playwright
spec file implements the step definitions. This is the MANDATORY file structure for
this epic:

FOLDER LAYOUT:
  features/
    {epic-folder}/                        ← one folder per epic
      {epic-key-lower}.feature           ← ONE .feature file for the WHOLE epic —
                                            every story's scenarios live here, grouped
                                            into comment-delimited sections, each
                                            scenario tagged @{story-id-lower}
  tests/
    step-definitions/
      {epic-folder}/
        {story-id}.steps.ts              ← Playwright step implementations — still
                                            split per story for file-size sanity, even
                                            though the source .feature is epic-scoped
    ui/{epic-folder}/                    ← UI-layer spec files (if not using cucumber runner)
    api/{epic-folder}/                   ← API spec files
    cross-layer/                         ← cross-layer specs

FEATURE FILE RULES — MANDATORY:
1. ONE Feature: block per epic file. Feature-level tag: @{EPIC_KEY_LOWER} only —
   Gherkin permits exactly one Feature: per file, so per-story tags move to the
   scenario tag line instead (see rule 2).
2. Scenario tag line:   @{story-id-lower} @{tag1} @{tag2} (story tag + tagging map below)
3. Scenario ID in title: include TC ID in the scenario name
4. ONLY ONE Background: block is allowed (it applies to every scenario in the file,
   across all stories) — keep it to what's universally true for the whole epic (e.g.
   base URL). Story-specific preconditions (e.g. "user is logged in", "a registered
   account exists") do NOT belong in Background — inline them as Given steps in each
   scenario instead, since a story-scoped Background would silently leak into every
   other story's scenarios too.
5. One Scenario or Scenario Outline per test case — NEVER combine two test cases
6. Scenario Outline + Examples table for data-driven cases (negative/boundary)
7. Use EXACT text from practicesoftwaretesting.com in Then steps
8. Cross-layer scenarios must have both a UI Then step AND an API Then step
9. Literal values used here (Examples table rows, error strings, persona fields)
   are the source of truth Stage 6 externalizes into test-data/{page}.yaml — do
   not invent throwaway values; every literal should be one you'd be comfortable
   seeing reused as a named YAML entry
10. Mark each story's section with a comment divider
    (`# ==== {STORY_ID} — {STORY_TITLE} ==== `) so a human scanning the file can
    still navigate it story-by-story despite the single-file structure

FEATURE FILE TEMPLATE (one Feature: block for the whole epic — repeat the
story-section pattern below once per Jira Story in the same file):
```gherkin
@{EPIC_KEY_LOWER}
Feature: {EPIC_KEY} — {EPIC_TITLE}
  As a {epic-level persona}
  I want {epic-level goal}
  So that {epic-level benefit}

  Background:
    Given the base URL is "https://practicesoftwaretesting.com"

  # ============================================================
  # {STORY_ID} — {STORY_TITLE}
  # ============================================================

  @{story-id-lower} @smoke @critical-path @{TC_ID_LOWER}
  Scenario: {TC_ID} — {TEST_CASE_TITLE}
    Given {precondition from test case — inline, do not rely on Background for
      anything story-specific}
    When {action from test case}
    And {next action}
    Then {expected result — exact text from live site}
    And {second assertion}

  @{story-id-lower} @regression @negative @{TC_ID_LOWER}
  Scenario Outline: {TC_ID} — {NEGATIVE_TITLE} with invalid <field>
    Given {precondition}
    When the user enters "<value>" in the {field} field
    And submits the form
    Then the error message "<error>" is displayed inline

    Examples:
      | field    | value         | error                          |
      | email    | notanemail    | Please enter a valid email     |
      | quantity | 0             | Quantity must be at least 1    |
      | coupon   | BADCODE       | Discount coupon cannot be applied |

  @{story-id-lower} @regression @cross-layer @{TC_ID_LOWER}
  Scenario: {TC_ID} — {CROSS_LAYER_TITLE}
    Given an order is placed via the API with product "{PRODUCT_NAME}"
    When the user navigates to "/account" and opens order history
    Then the order appears in the orders list with status "Processing"
    And the API response for GET "/orders/{id}" returns status 200
    And the response body contains "status": "Processing"

  # ============================================================
  # {NEXT_STORY_ID} — {NEXT_STORY_TITLE}
  # ============================================================
  # ... repeat the same pattern for every remaining story in this epic ...
```

STEP DEFINITION MAPPING:
Step definitions stay organized per story (tests/step-definitions/{epic-folder}/{story-id}.steps.ts)
even though the source .feature file is epic-scoped — list, per story, the step
definition methods the Test Generator Agent must implement in that story's .steps.ts file:

| Gherkin Step | Step Definition Method | ToolshopUi/ToolshopApi Method Called |
|---|---|---|
| Given the user is logged in | givenUserIsLoggedIn() | uses storageState fixture |
| When the user adds "{product}" to cart | whenAddsToCart(product) | toolshopUi.addToCart(product) |
| Then the cart badge shows "{count}" | thenCartBadgeShows(count) | toolshopUi.getCartCount() |

PRODUCE THE ACTUAL FEATURE FILE:
Write ONE complete .feature file content for the whole epic — every Jira Story's
AUTOMATE NOW test cases as sections within the single Feature: block (not just the
template — write the actual Gherkin for every AUTOMATE NOW test case, in every story).
Save to: features/{epic-folder}/{epic-key-lower}.feature

================================================================================
SECTION C — AGENT ROSTER & RESPONSIBILITIES
================================================================================

The framework uses 10 specialised agents. For this epic, define which test cases
and pipeline stages each agent owns. This section is the single source of truth
for agent responsibilities.

---
AGENT 1 — TEST GENERATOR AGENT
Role: Converts approved Gherkin scenarios from .feature files into Playwright
      TypeScript step definitions and spec files.
Inputs:  features/{epic-folder}/*.feature (Stage 5 output)
         docs/epics/architecture_{EPIC_KEY}.md (Stage 6 output)
Outputs: tests/step-definitions/{epic-folder}/*.steps.ts
         tests/ui/{epic-folder}/*.spec.ts
         tests/api/{epic-folder}/*.spec.ts
         tests/cross-layer/*.spec.ts
Owns:    ALL "AUTOMATE NOW" test cases that are UI, API, or cross-layer
Rules:
  - One .steps.ts file per .feature file (matching story ID)
  - Step definitions must call ToolshopUi/ToolshopApi methods only — no raw Playwright in steps
  - Must implement every Gherkin step in the .feature file — zero unimplemented steps
  - Generate AAA comments inside each step method body
  - Must attach Allure annotations in the Before hook of each scenario
Trigger: Stage 7 of the pipeline

---
AGENT 2 — CODE REVIEWER AGENT
Role: Reviews ALL code generated by the Test Generator Agent before it is
      committed. Checks for correctness, flaky patterns, and design convention
      adherence. Posts review as a PR comment.
Inputs:  All files generated in Stage 7
         docs/epics/architecture_{EPIC_KEY}.md (design conventions)
Outputs: Code review report — docs/epics/code_review_{EPIC_KEY}.md
         PR review comment (via GitHub MCP) with APPROVED / CHANGES REQUESTED
Owns:    Quality gate between Stage 7 (generation) and Stage 8 (execution)
Rules:
  - FAIL (request changes) if: any waitForTimeout() found | XPath used |
    hardcoded credentials | raw fetch() in spec | missing Allure annotation |
    unimplemented Gherkin step | step def calls Playwright directly (not via ToolshopUi)
  - PASS (approve): all rules clean
  - Maximum review turnaround: before Stage 8 begins
Review checklist:
  [ ] Zero waitForTimeout() calls
  [ ] Zero XPath selectors
  [ ] All steps call ToolshopUi or ToolshopApi — never raw page.* in step defs
  [ ] All Gherkin steps have implementations (no "pending" steps)
  [ ] Allure annotations present in Before hook
  [ ] Feature file tags match tagging map in Section A
  [ ] Scenario Outlines used for all data-driven cases
  [ ] No hardcoded test data — TestDataFactory used, backed by test-data/{page}.yaml (not static literals in TestDataFactory.ts itself)
  [ ] Cross-layer scenarios assert both UI and API state
  [ ] storageState fixture used — no login steps in spec body
Trigger: After Stage 7, before Stage 8

---
AGENT 3 — TEST HEALER AGENT
Role: When a test fails in Stage 8, inspects the Playwright trace and DOM diff,
      diagnoses root cause (selector change / app change / app bug / env issue),
      and proposes + verifies a fix. Updates the .feature file AND .steps.ts
      if the fix changes a step.
Inputs:  Failed test trace file (.zip)
         Failed test screenshot (.png)
         Gherkin .feature file for the failing scenario
         Playwright .steps.ts file for the failing step
Outputs: Patched .feature file (if Gherkin step text changed)
         Patched .steps.ts file (if step implementation changed)
         Patched ToolshopUi.ts (if selector changed)
         docs/epics/heal_reports/heal_{TC_ID}_{timestamp}.md
Owns:    Stage 9 entirely
Failure categories:
  A — Test code defect (wrong selector, wrong step implementation)
  B — Application change (AUT text/URL/structure changed)
  C — Application bug (feature broken — DO NOT fix test, file Jira bug)
  D — Environment flakiness (network / demo store instability)
Rules:
  - Only fix categories A and B
  - For category C: file Jira bug, add @known-bug tag to scenario, skip in CI
  - For category D: add @flaky tag, increase retry, document in known_issues file
  - After patching: re-run ONLY the failed scenario to confirm fix
  - Annotate healed scenario with tag @healed-{YYYYMMDD}
Trigger: Stage 9 — triggered by any failure in Stage 8

---
AGENT 4 — FRAMEWORK HEALTH CHECKER
Role: Periodically audits the test framework itself — not individual tests.
      Runs independently of the epic pipeline on a weekly schedule.
Inputs:  package.json (dependency versions)
         playwright.config.ts (config drift check)
         All fixture files (broken fixture detection)
         Execution history (flaky-test trend analysis)
Outputs: docs/master/framework_health_{YYYYMMDD}.md
Owns:    Framework-level automation health (no dedicated Jira epic — cross-cutting) + weekly audit
Checks:
  - Stale npm dependencies (compare to latest on npmjs.com)
  - Playwright version vs latest released
  - Broken fixtures (import errors, missing storageState files)
  - Flaky test trend: tests with >2 failures in last 10 runs → flag for quarantine
  - Config drift: playwright.config.ts deviates from baseline
  - Dead step definitions: steps in .steps.ts not referenced in any .feature file
  - Orphaned feature files: .feature files with no corresponding .steps.ts
Schedule: Weekly (GitHub Actions cron: 0 9 * * 1)
Trigger: Weekly cron + manually before any major Playwright version upgrade

---
AGENT 5 — REPORT ANALYZER AGENT
Role: Parses the Allure result set after every Stage 8 run. Produces the
      execution report (Stage 10). Flags regressions vs previous run.
      Provides input to the Release Readiness Agent.
Inputs:  ./allure-results/ (raw Allure JSON output)
         docs/epics/execution_result_{EPIC_KEY}_{prev_timestamp}.json (previous run)
         docs/epics/automation_plan_{EPIC_KEY}.md (coverage baseline)
Outputs: docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md (Stage 10 artifact)
         docs/master/execution_MASTER.md (row update)
Owns:    Stage 10 entirely
Report sections:
  - Executive summary (5 bullets — stakeholder readable)
  - Detailed results table (TC ID | status | duration | healed | story)
  - Failure analysis (category | bug | release risk)
  - Coverage analysis (stories covered | scenarios automated | gaps)
  - Trend comparison (pass rate delta | new failures | resolved)
  - Performance metrics (smoke duration | regression duration | slowest 5)
  - Recommendations (quarantine list | gaps | framework improvements)
Trigger: After Stage 8 completes (pass or fail, always runs)

---
AGENT 6 — ACCESSIBILITY REVIEWER
Role: Runs axe-core accessibility checks via Playwright on every key UI page
      in this epic. Reports violations against WCAG 2.1 AA standard.
      All @accessibility tagged scenarios are owned by this agent.
Inputs:  List of pages/URLs in scope from docs/epics/requirements_{EPIC_KEY}.md
         @accessibility tagged scenarios from the feature files
Outputs: docs/epics/accessibility_report_{EPIC_KEY}.md
         Allure attachment: axe-core violation JSON per page
Owns:    All @accessibility tagged test cases in this epic
Axe-core integration:
```typescript
import AxeBuilder from '@axe-core/playwright';
// In step definition for accessibility scenarios:
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze();
expect(results.violations).toEqual([]);
```
Pages to check for THIS epic: {list from requirements_{EPIC_KEY}.md}
WCAG rules enforced: wcag2a | wcag2aa | best-practice
Severity levels: critical | serious | moderate | minor
Report format: violation count by severity | specific rule IDs | affected elements
Trigger: Runs in the Release workflow only (not PR or nightly — too slow)

---
AGENT 7 — PERFORMANCE REVIEWER
Role: Captures page-load timings and API response times during test runs.
      Compares against a stored baseline. Flags regressions > 20% slower.
Inputs:  Playwright performance timing API (page.metrics())
         Network response timings from page.on('response')
         docs/master/performance_baseline_MASTER.json (baseline file)
Outputs: docs/epics/performance_report_{EPIC_KEY}.md
         Updated baseline if this is the first run for the epic
Owns:    All @performance tagged test cases in this epic
Metrics collected per page:
  - DOMContentLoaded (ms)
  - Load event (ms)
  - Largest Contentful Paint (ms)
  - API response time for each endpoint called during the test
Thresholds (flag if exceeded):
  - Page load > 3000ms
  - API response > 500ms
  - LCP > 2500ms
  - Any regression > 20% slower than baseline
Trigger: Runs in nightly and release workflows — not PR workflow

---
AGENT 8 — DOCUMENTATION GENERATOR
Role: Keeps the README, architecture diagrams, and per-epic docs in sync as
      the suite evolves. Runs after every merged PR to update affected docs.
Inputs:  Merged PR diff (via GitHub MCP)
         All docs/epics/*.md files for the merged epic
         docs/master/*.md files
         Current README.md
Outputs: Updated README.md (if framework-level change)
         Updated docs/master/*.md (if summary tables changed)
         Architecture diagram updates (Mermaid in docs/architecture.md)
Owns:    docs/master/ integrity across all 9 epics
         README.md accuracy
         docs/architecture.md (overall framework diagram)
Trigger: After every PR merge to main (GitHub Actions on: push to main)
Rules:
  - Never modify docs/epics/ files (those are owned by the epic pipeline)
  - Only update master files and README
  - Mermaid diagram must reflect current folder structure and agent flow

---
AGENT 9 — TEST IMPACT ANALYZER
Role: Given a code diff or a requirement change, determines the MINIMAL set of
      feature file scenarios that need to re-run. Prevents full regression on
      every small change.
Inputs:  Git diff of changed files (via GitHub MCP)
         Feature file → step definition → ToolshopUi/ToolshopApi dependency map
         docs/epics/architecture_{EPIC_KEY}.md (method-to-test mapping)
Outputs: Filtered test run command with --grep pattern
         docs/epics/impact_analysis_{timestamp}.md
Owns:    PR workflow optimisation — replaces "run everything" with targeted runs
Analysis rules:
  - ToolshopUi method changed → find all scenarios using that method → run those only
  - .feature file changed → run only scenarios in that file
  - ToolshopApi method changed → run all @api and @cross-layer scenarios for that endpoint
  - playwright.config.ts changed → run full @smoke suite
  - fixture changed → run all tests using that fixture
Output format:
  Impacted scenarios: N
  Run command: npx playwright test --grep "{generated grep pattern}"
  Estimated duration: {N} min
  Skipped: {N} scenarios (unchanged)
Trigger: On every PR — runs BEFORE the test execution to generate the grep filter

---
AGENT 10 — RELEASE READINESS AGENT
Role: Final gate before PR merge. Evaluates all pipeline artifacts against
      8 quality gates. Posts GO / NO-GO decision as a PR comment.
      Approves or blocks the PR via GitHub MCP.
Inputs:  All pipeline artifacts from Stages 1–12
         docs/master/*.md (cross-epic trend data)
         Jira MCP (open bug count for this epic)
Outputs: PR comment with 8-gate assessment table
         PR approval (GO) or change request (NO-GO) via GitHub MCP
         docs/master/pr_MASTER.md row update
Owns:    Stage 13 supplementary prompt — full details in that section
Gates evaluated:
  Gate 1: Story Coverage — every story has ≥ 1 automated scenario in a .feature file
  Gate 2: Smoke Pass Rate — 100% of @smoke scenarios passed
  Gate 3: Regression Pass Rate — ≥ 95% of @regression scenarios passed
  Gate 4: Open P1/P2 Defects — zero open via Jira MCP query
  Gate 5: Code Quality — Code Reviewer Agent approved (no CHANGES REQUESTED open)
  Gate 6: CI Pipeline — GitHub Actions concluded = success
  Gate 7: Master File Integrity — only {EPIC_KEY} rows changed in docs/master/
  Gate 8: Accessibility — zero critical/serious WCAG violations (release workflow only)
Trigger: Stage 13 — after CI passes (Stage 12)

================================================================================
SECTION D — TAGGING MAP
================================================================================

Assign ALL applicable tags to each "AUTOMATE NOW" test case.
Tags appear in BOTH the .feature file scenario line AND the Playwright test title.

@smoke         — must-pass 100% on every PR | P1 happy path only | target: ≤5 min total
@regression    — full suite | runs nightly | target: ≤30 min total
@critical-path — multi-page end-to-end flow (add→cart→checkout→order)
@api           — pure API test | no browser launched | uses APIRequestContext only
@cross-layer   — uses both APIRequestContext AND page in same scenario
@negative      — validation | error state | invalid input | boundary failure
@visual        — toHaveScreenshot() pixel comparison
@accessibility — axe-core WCAG 2.1 AA check | owned by Accessibility Reviewer Agent
@performance   — page timing + API response time capture | owned by Performance Reviewer
@healed-{date} — added by Test Healer Agent after a fix (format: @healed-20260801)
@known-bug     — scenario skipped due to confirmed app bug | Jira link in comment
@flaky         — quarantined | excluded from PR and nightly | under investigation

TAGGING MAP TABLE — produce for every "AUTOMATE NOW" test case:
| TC ID | @smoke | @regression | @critical-path | @api | @cross-layer | @negative | @visual | @accessibility | @performance |
|---|---|---|---|---|---|---|---|---|---|
| {ID} | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

================================================================================
SECTION E — CI PIPELINE ALLOCATION
================================================================================

Three GitHub Actions workflows consume these tests. Define which scenarios run where:

PR WORKFLOW (triggers on: pull_request)
  Purpose: Fast feedback — must complete in < 10 min total
  Runs:    @smoke tagged scenarios only
  Agent:   Test Impact Analyzer trims to impacted @smoke scenarios only
  Command: npx playwright test --grep "@smoke" --workers=2

NIGHTLY WORKFLOW (triggers on: schedule: 0 2 * * *)
  Purpose: Full regression coverage
  Runs:    @regression + @api + @cross-layer + @negative + @performance
  Agent:   All agents run (execution, accessibility excluded — too slow)
  Command: npx playwright test --grep "@regression|@api|@cross-layer|@negative"

RELEASE WORKFLOW (triggers on: manual dispatch before release)
  Purpose: Complete quality gate including non-functional checks
  Runs:    @critical-path + @accessibility + @performance + @visual
  Agent:   Accessibility Reviewer + Performance Reviewer + Report Analyzer + Release Readiness
  Command: npx playwright test --grep "@critical-path|@accessibility|@performance|@visual"

CI ALLOCATION TABLE — produce for every "AUTOMATE NOW" test case:
| TC ID | Title | PR Workflow | Nightly Workflow | Release Workflow | Agent Owner |
|---|---|---|---|---|---|
| {ID} | {title} | ✅/❌ | ✅/❌ | ✅/❌ | {agent name} |

================================================================================
SECTION F — EXECUTION ORDER & DEPENDENCIES
================================================================================

List all "AUTOMATE NOW" test cases in the order they must run within this epic.
Flag dependencies with → arrows.

Rules:
- Auth-dependent tests must come after the storageState fixture is available
- Cart tests must come after at least one product-add scenario
- Checkout tests must come after cart is populated
- Cross-layer tests that read API state must run AFTER the UI action that creates it
- Negative/boundary tests have no order dependency — can run in parallel

FORMAT:
  1. {TC_ID} — {TITLE} [no dependency]
  2. {TC_ID} — {TITLE} → depends on: TC_ID_1 (cart must have item)
  3. {TC_ID} — {TITLE} [parallel — no dependency]

================================================================================
SECTION G — EFFORT ESTIMATE
================================================================================

Per test case:
  S  = < 1 hour   (simple happy path, one page, few assertions)
  M  = 1–3 hours  (multi-step, attribute selection, cross-layer)
  L  = 3–8 hours  (complex data setup, multiple fixtures, visual baseline)
  XL = > 8 hours  (new ToolshopUi/ToolshopApi methods needed + feature file + steps)

| TC ID | Title | Effort | New ToolshopUi methods | New ToolshopApi methods | New Fixtures |
|---|---|---|---|---|---|
| {ID} | {title} | S/M/L/XL | {n} | {n} | {n} |

Summary row:
  Total effort: {N}h | Stories: {N} | Test cases: {N} | Feature files: {N}

================================================================================
SECTION H — DEFERRED & MANUAL BACKLOG
================================================================================

LIST every test case marked AUTOMATE LATER or MANUAL ONLY with:
| TC ID | Title | Decision | Reason | Suggested Sprint | Prerequisite |
|---|---|---|---|---|---|
| {ID} | {title} | LATER/MANUAL | {reason} | Sprint {N} | {what's needed} |

================================================================================
OUTPUT ARTIFACTS
================================================================================

EPIC FILES (create new — one per epic):
  docs/epics/automation_plan_{EPIC_KEY}.md          ← this full document
  features/{epic-folder}/{epic-key-lower}.feature    ← ONE .feature file for the
                                                       whole epic, all stories
                                                       (actual Gherkin, not template)

MASTER FILE (update {EPIC_KEY} row ONLY):
  docs/master/automation_plan_MASTER.md

  Row to update (under ## Automation Coverage table):
  | {EPIC_KEY} | {EPIC_TITLE} | NOW:{n} | LATER:{n} | MANUAL:{n} | Features:{n} | Effort:{n}h | {timestamp} |

MASTER FILE (update {EPIC_KEY} row ONLY):
  docs/master/agent_roster_MASTER.md

  Row to update (under ## Agent Assignment by Epic table):
  | {EPIC_KEY} | Generator | Reviewer | Healer | A11y | Perf | Report | RR | Impact | {timestamp} |

NEXT STAGE: Feed the following to Stage 6:
  - docs/epics/automation_plan_{EPIC_KEY}.md
  - features/{epic-folder}/{epic-key-lower}.feature (the epic's single feature file from Section B)

================================================================================
STAGE 6 — AUTOMATION DESIGN ARCHITECTURE AGENT
================================================================================

PROMPT:
-------
You are the Automation Design Architecture Agent for the Toolshop Agentic Test
Automation Framework. Design the complete code architecture for the Playwright
TypeScript test suite covering epic {EPIC_KEY} — {EPIC_TITLE}.

This stage designs the implementation blueprint that the Test Generator Agent
(Stage 7) will use to write every step definition and spec file. Every design
decision must be concrete — no placeholders, no "TBD".

CONTEXT (attach ALL of the following):
- docs/epics/automation_plan_{EPIC_KEY}.md         (Stage 5 — agent assignments, tagging)
- features/{epic-folder}/*.feature                 (Stage 5 — actual Gherkin scenarios)
- docs/epics/requirements_{EPIC_KEY}.md            (Stage 1 — selector context, URLs)
- Current full content of support/ToolshopUi.ts         (existing methods — do not duplicate)
- Current full content of support/ToolshopApi.ts        (existing methods — do not duplicate)
- Current full content of fixtures/toolshop.fixtures.ts (existing fixtures — do not duplicate)
- Current full content of support/factories/TestDataFactory.ts
- Current full content of test-data/*.yaml (existing per-page data files — do not duplicate keys)
- Framework: Playwright + TypeScript + Cucumber/Gherkin + Allure
- AUT UI: https://practicesoftwaretesting.com
- AUT API: https://api.practicesoftwaretesting.com/api/documentation

PRODUCE ALL OF THE FOLLOWING DESIGN ARTIFACTS:

────────────────────────────────────────────────────────────────────────────────
1. COMPLETE FOLDER STRUCTURE
────────────────────────────────────────────────────────────────────────────────
Show the exact directory tree for ALL files to be created for this epic.
Mark each file: [NEW] | [MODIFIED — additions only] | [REUSED — no change]

  features/
    {epic-folder}/                              [NEW folder]
      {epic-key-lower}.feature                 [NEW or MODIFIED — one file for the
                                                 whole epic, all stories, from Stage 5]

  tests/
    step-definitions/
      {epic-folder}/                            [NEW folder]
        {story-id}.steps.ts                    [NEW — one per .feature file]
    ui/
      {epic-folder}/                            [NEW folder]
        {optional-spec-files}.spec.ts          [NEW — for scenarios not using cucumber runner]
    api/
      {epic-folder}/                            [NEW folder]
        {api-spec-files}.spec.ts               [NEW]
    cross-layer/
      {epic-cross-layer-specs}.spec.ts         [NEW]

  support/
    ToolshopUi.ts                                   [MODIFIED — additions only]
    ToolshopApi.ts                                  [MODIFIED — additions only]
    factories/
      TestDataFactory.ts                       [MODIFIED — additions only]

  test-data/
    {page}.yaml                                [NEW or MODIFIED — one file per page]

  fixtures/
    toolshop.fixtures.ts                            [MODIFIED — additions only]

  docs/epics/
    architecture_{EPIC_KEY}.md                 [NEW — this document]

────────────────────────────────────────────────────────────────────────────────
2. STEP DEFINITION ARCHITECTURE
────────────────────────────────────────────────────────────────────────────────
For EVERY .feature file generated in Stage 5, design the matching .steps.ts file.

Per .steps.ts file, list every step that needs implementing:

FILE: tests/step-definitions/{epic-folder}/{story-id}.steps.ts

| Gherkin Step Text (exact) | Step Type | Method Name | ToolshopUi/ToolshopApi Call | Parameters |
|---|---|---|---|---|
| "the user is logged in as a registered customer" | Given | givenUserIsLoggedIn | storageState fixture | none |
| "the user adds {string} to the cart" | When | whenUserAddsToCart | toolshopUi.addToCart(product) | product: string |
| "the cart badge shows {int}" | Then | thenCartBadgeShows | toolshopUi.getCartCount() | count: number |
| "the error message {string} is displayed" | Then | thenErrorDisplayed | toolshopUi.getErrorMessage() | message: string |

STEP DEFINITION CODING RULES:
- Import: import { Given, When, Then, Before, After } from '@cucumber/cucumber'
- Import: import { expect } from '@playwright/test'
- Import: import { ToolshopUi } from '../../support/ToolshopUi'
- Import: import { ToolshopApi } from '../../support/ToolshopApi'
- Before hook: set up Allure annotations (epic, story, severity)
- Step defs MUST call ToolshopUi/ToolshopApi methods — NEVER call page.* directly
- Cross-layer steps: call ToolshopApi for API assertion AND ToolshopUi for UI assertion
- Regex parameters: use {string} for quoted strings, {int} for numbers
- World context: use a typed World interface to share page/context across steps

WORLD INTERFACE DESIGN (typed shared context across steps):
```typescript
export interface ToolshopWorld {
  page: Page;
  toolshopUi: ToolshopUi;
  toolshopApi: ToolshopApi;
  testData: Record<string, unknown>;  // runtime data shared between steps
}
```

────────────────────────────────────────────────────────────────────────────────
3. ToolshopUi CLASS ADDITIONS
────────────────────────────────────────────────────────────────────────────────
List ONLY NEW methods to add for this epic. Do not re-list any existing methods.
If an existing method is sufficient, reference it by name.

For each new method:

METHOD: {methodName}
  Signature:      async {methodName}({params}): Promise<{returnType}>
  Used by steps:  {list of Gherkin step texts that call this}
  Used by TC IDs: {list of test case IDs}
  Locator type:   getByRole / getByLabel / getByText / getByPlaceholder / CSS
  Locator value:  exact string as it appears on practicesoftwaretesting.com
  Page/URL:       {e.g. /cart}
  Description:    {1-2 sentences}
  Fragile risk:   LOW / MEDIUM / HIGH — {reason if medium/high}

EXAMPLE:
  METHOD: addToCartFromListingPage
  Signature:      async addToCartFromListingPage(productName: string): Promise<void>
  Used by steps:  "the user adds {string} to the cart from the listing page"
  Used by TC IDs: AA-4-TC-01-01, AA-4-TC-01-02
  Locator type:   data-test attribute (Toolshop convention — see Selector Registry rules)
  Locator value:  page.locator('[data-test="product-name"]', { hasText: productName })
                  .locator('..').getByTestId('add-to-cart')
  Page/URL:       category listing pages under /category/{category-slug} (confirm exact slugs, e.g. hand-tools)
  Description:    Finds a product card by name and clicks its Add to cart button.
                  Waits for the success toast/notification to confirm the add.
  Fragile risk:   LOW — data-test attributes are the intended automation hook on Toolshop

────────────────────────────────────────────────────────────────────────────────
4. ToolshopApi CLASS ADDITIONS
────────────────────────────────────────────────────────────────────────────────
List ONLY NEW methods to add for this epic. Do not re-list existing methods.

For each new method:

METHOD: {methodName}
  Signature:       async {methodName}({params}): Promise<{ResponseInterface}>
  HTTP method:     {GET | POST | PUT | PATCH | DELETE}
  Endpoint:        {full path e.g. /api-frontend/ShoppingCart/AddProductToCart}
  Request body:    {TypeScript interface name} — show interface definition
  Response body:   {TypeScript interface name} — show interface definition
  Used by steps:   {list of Gherkin step texts that call this}
  Used by TC IDs:  {list of test case IDs}
  Auth required:   YES — Bearer token from this.token
  Error handling:  {expected error status and code}

TYPESCRIPT INTERFACES TO DEFINE:
Show the complete TypeScript interface for every new request and response body.
These go into support/types/{EPIC_KEY}.types.ts (new file per epic).

────────────────────────────────────────────────────────────────────────────────
5. FIXTURE ADDITIONS
────────────────────────────────────────────────────────────────────────────────
List ONLY NEW fixtures needed for this epic. Do not re-list existing fixtures.

For each new fixture:

FIXTURE: {fixtureName}
  TypeScript type:     {interface or type}
  Scope:               test | worker
  Depends on:          {other fixtures this one uses}
  Setup:               {step-by-step setup — include code}
  Teardown:            {cleanup steps — include code}
  Used by TC IDs:      {list}
  Reason it's needed:  {why an existing fixture is not sufficient}

EXAMPLE:
  FIXTURE: cartWithOneItem
  TypeScript type:    { cartItemId: string; productName: string; unitPrice: number }
  Scope:              test (fresh item per test)
  Depends on:         authenticatedPage fixture
  Setup:
    const res = await toolshopApi.addToCart(productId, 1);
    return { cartItemId: res.cart_items[0].id,
             productName: 'Combination Pliers', unitPrice: res.cart_items[0].unit_price };
  Teardown:
    await toolshopApi.clearCart(); // confirm exact endpoint via Swagger, e.g. DELETE /cart
  Used by TC IDs:     AA-4-TC-03-01, AA-4-TC-03-02
  Reason:             Cart must be pre-populated via API (not UI) for speed

────────────────────────────────────────────────────────────────────────────────
6. TEST DATA STRATEGY — YAML FILES + TestDataFactory
────────────────────────────────────────────────────────────────────────────────
Static, boundary, and expected-error test data lives in ONE YAML file per page
(matching the ToolshopUi page-object grouping), NOT inline in TestDataFactory.ts.
TestDataFactory.ts is a thin loader — it reads the relevant test-data/{page}.yaml
entry and layers only genuinely dynamic values (timestamps, run-unique suffixes)
on top at runtime. It must NEVER contain a static literal itself.

The YAML values for this epic must mirror what was already approved in Stage 5's
.feature files exactly — this stage does not invent new test data, it externalizes
the literals the human already reviewed in the Gherkin into a reusable, editable
source file.

6a. TEST DATA YAML FILE(S) FOR THIS EPIC
List ONLY NEW or MODIFIED yaml files for this epic. Do not re-list unrelated pages.

FILE: test-data/{page}.yaml   (one file per page — e.g. test-data/register.yaml,
                                test-data/login.yaml, test-data/profile.yaml)
  Schema:
    personas:
      {personaName}:
        {field}: {static value, or a "{{dynamic:*}}" placeholder — e.g. "{{dynamic:email}}"}
    boundary:
      {caseName}:
        {field}: {value}
    negative:
      {caseName}:
        {field}: {value}
        expectedError: "{exact text from practicesoftwaretesting.com}"

  EXAMPLE — test-data/register.yaml:
  ```yaml
  personas:
    validCustomer:
      firstName: QA
      lastName: Tester
      dob: "1990-01-01"
      country: United States of America (the)
      postalCode: "10001"
      houseNumber: "42"
      phone: "5551234567"
      email: "{{dynamic:email}}"     # TestDataFactory injects test_{timestamp}@qa.io
      password: "Str0ng!Pass9"
  negative:
    malformedEmail:
      email: notanemail
      expectedError: "Email format is invalid"
    breachedPassword:
      password: "Password123!"
      expectedError: "The given password has appeared in a data leak. Please choose a different password."
    duplicateEmail:
      expectedError: "A customer with this email address already exists."
  ```

  Used by TC IDs:  {list}
  Used by:         TestDataFactory.{functionName}()

6b. TEST DATA FACTORY ADDITIONS (loader/generator only — no static literals)
List ONLY NEW factory functions for this epic. Do not re-list existing ones.
A factory function's job is: load the named entry from test-data/{page}.yaml,
substitute any "{{dynamic:*}}" placeholder with a generated value, and return
the typed object. It must never hold a static literal itself — if you find
yourself typing a literal string/number into TestDataFactory.ts, it belongs in
the YAML file instead.

For each new function:

FUNCTION: {functionName}
  Signature:      {functionName}(entry?: string): {ReturnInterface}
  Source YAML:    test-data/{page}.yaml → {personas|boundary|negative}.{entryName}
  Dynamic fields: {field}: "{{dynamic:email}}" → `test_${Date.now()}@qa.io` (or similar)
  Created via:    API (preferred) | UI navigation | static (no creation needed)
  Used by:        {list of step definitions or fixtures}

────────────────────────────────────────────────────────────────────────────────
7. CROSS-LAYER PATTERN FOR THIS EPIC
────────────────────────────────────────────────────────────────────────────────
Show the EXACT implementation pattern for cross-layer scenarios in this epic.
This is the template the Test Generator Agent will follow.

Show THREE things:
  a. The Gherkin scenario (from the .feature file)
  b. The step definition implementation
  c. The ToolshopUi + ToolshopApi methods called

```gherkin
# From features/{epic-folder}/{story-id}.feature
@cross-layer @regression
Scenario: {TC_ID} — {CROSS_LAYER_TITLE}
  Given an order is placed via the API with product "Combination Pliers"
  When the user navigates to "/account" order history
  Then the order appears in the list with status "Processing"
  And the API GET "/orders/{id}" returns status 200
  And the response contains "status": "Processing"
```

```typescript
// tests/step-definitions/{epic-folder}/{story-id}.steps.ts
Given('an order is placed via the API with product {string}',
  async function(this: ToolshopWorld, productName: string) {
    // ARRANGE via API — fast, no UI
    const product = PRODUCTS.find(p => p.name === productName);
    const result = await this.toolshopApi.addToCart(product.id, 1);
    const order  = await this.toolshopApi.placeOrder(DEFAULT_ADDRESS, COD_PAYMENT);
    this.testData.orderId = order.body.order_id;
  }
);

When('the user navigates to {string}',
  async function(this: ToolshopWorld, path: string) {
    await this.toolshopUi.navigateTo(path);
  }
);

Then('the order appears in the list with status {string}',
  async function(this: ToolshopWorld, status: string) {
    // ASSERT in UI
    await expect(
      this.toolshopUi.page.getByText(this.testData.orderId as string)
    ).toBeVisible();
  }
);

Then('the API GET {string} returns status {int}',
  async function(this: ToolshopWorld, endpoint: string, expectedStatus: number) {
    // ASSERT via API
    const orderId = this.testData.orderId as string;
    const { status } = await this.toolshopApi.getOrderDetails(orderId);
    expect(status).toBe(expectedStatus);
  }
);
```

────────────────────────────────────────────────────────────────────────────────
8. SELECTOR REGISTRY FOR THIS EPIC
────────────────────────────────────────────────────────────────────────────────
Complete table of every locator needed for this epic's UI steps.

| Element | Page / URL | Locator Type | Locator Value | Fragile Risk | Used By |
|---|---|---|---|---|---|
| Email input (login) | /auth/login | data-test | `[data-test="email"]` | LOW | ToolshopUi.login |
| Password input (login) | /auth/login | data-test | `[data-test="password"]` | LOW | ToolshopUi.login |
| Login submit button | /auth/login | data-test | `[data-test="login-submit"]` | LOW | ToolshopUi.login |
| Login error banner | /auth/login | data-test | `[data-test="login-error"]` | LOW | ToolshopUi.getLoginError |
| Registration form fields | /auth/register | data-test | `[data-test="first-name"]` etc. | LOW | ToolshopUi.register |
| Logout control | header (all authenticated pages) | data-test | `[data-test="nav-menu"] [data-test="logout-link"]` | MEDIUM — nested in a menu, verify open state | ToolshopUi.logout |
| Profile form fields | /account | data-test | `[data-test="first-name"]` etc. | MEDIUM — same attributes as registration, scope by page | ToolshopUi.updateProfile |

(Exact attribute values above are illustrative — confirm every `data-test` value
against the live DOM before committing to ToolshopUi; do not assume.)

Rules:
- Use ONLY selectors verified to exist on https://practicesoftwaretesting.com/
- Flag MEDIUM/HIGH risk selectors — Test Healer Agent monitors these first on failure
- Prefer `[data-test="..."]` / `getByTestId()` first (Toolshop's intended hook),
  then getByRole > getByLabel > getByText > locator(CSS) — in that order
- NEVER include XPath in this registry

────────────────────────────────────────────────────────────────────────────────
9. AGENT HANDOFF MAP FOR THIS EPIC
────────────────────────────────────────────────────────────────────────────────
Show which agent receives what artifact from this stage:

| Artifact Produced | Consumed By | In Stage |
|---|---|---|
| architecture_{EPIC_KEY}.md | Test Generator Agent | Stage 7 |
| ToolshopUi.ts method list | Test Generator Agent | Stage 7 |
| ToolshopApi.ts method list | Test Generator Agent | Stage 7 |
| Fixture design | Test Generator Agent | Stage 7 |
| test-data/{page}.yaml | Test Generator Agent (via TestDataFactory) | Stage 7 |
| Selector Registry | Test Healer Agent | Stage 9 (on failure) |
| Selector Registry | Code Reviewer Agent | After Stage 7 |
| TypeScript interfaces | Test Generator Agent | Stage 7 |
| Step definition table | Test Generator Agent | Stage 7 |
| Cross-layer pattern | Test Generator Agent | Stage 7 |

OUTPUT ARTIFACTS:
  EPIC FILES (create new):
    docs/epics/architecture_{EPIC_KEY}.md         ← this full document
    support/types/{EPIC_KEY}.types.ts             ← TypeScript interfaces
    test-data/{page}.yaml                         ← one file per page touched this epic (new or modified)

  MASTER FILE (update {EPIC_KEY} row ONLY):
    docs/master/architecture_MASTER.md

  Master row to update (under ## Architecture Status table):
  | {EPIC_KEY} | {EPIC_TITLE} | ✅ Designed | ToolshopUi+{n} | ToolshopApi+{n} | Fixtures+{n} | TestData+{n} | Steps:{n} | {timestamp} |

NEXT STAGE: Feed the following to Stage 7 (Test Generator Agent):
  - docs/epics/architecture_{EPIC_KEY}.md
  - features/{epic-folder}/{epic-key-lower}.feature (the epic's single feature file from Stage 5)
  - Current ToolshopUi.ts, ToolshopApi.ts, fixtures/toolshop.fixtures.ts, test-data/*.yaml

================================================================================
STAGE 7 — TEST GENERATOR AGENT
================================================================================

PROMPT:
-------
You are the Test Generator Agent for the Toolshop Agentic Test Automation Framework.
Your job is to implement ONE Jira Story's test automation at a time — taking the
@{story-id}-tagged scenarios from the epic's shared Gherkin .feature file (Stage 5)
and the architecture design from Stage 6, and producing the complete Playwright
TypeScript step definitions and spec files for just that story.

You generate code. The Code Reviewer Agent (Stage 7 post-step) reviews it.
Do not merge or commit — that is Stage 11.

CONTEXT (attach ALL of the following — do not proceed if any is missing):
- features/{epic-folder}/{epic-key-lower}.feature          (Stage 5 — source of truth;
  the WHOLE epic's file — filter to the @{story-id-lower}-tagged section for this run)
- docs/epics/architecture_{EPIC_KEY}.md                    (Stage 6 — methods + selectors)
- docs/epics/automation_plan_{EPIC_KEY}.md                 (Stage 5 — tagging map)
- Current full content of support/ToolshopUi.ts
- Current full content of support/ToolshopApi.ts
- Current full content of fixtures/toolshop.fixtures.ts
- Current full content of support/factories/TestDataFactory.ts
- Current full content of test-data/*.yaml (data files designed in Stage 6)
- Current full content of support/types/{EPIC_KEY}.types.ts (from Stage 6)

STORY TO IMPLEMENT NOW:
  Story ID:    {STORY_ID}
  Story title: {STORY_TITLE}
  Feature file: features/{epic-folder}/{epic-key-lower}.feature — implement ONLY the
                scenarios tagged @{story-id-lower} in this run; leave every other
                story's section untouched
  Step def file to create: tests/step-definitions/{epic-folder}/{STORY_ID}.steps.ts

(Paste just the @{story-id-lower}-tagged section of the .feature file here before
sending this prompt — not the whole epic file)

════════════════════════════════════════════════════════════════════════════════
CODING RULES — ZERO EXCEPTIONS — Code Reviewer Agent will fail the review if any
rule is violated
════════════════════════════════════════════════════════════════════════════════

RULE 1 — FILE NAMING
  Step definitions: tests/step-definitions/{epic-folder}/{STORY_ID}.steps.ts
  Spec files (non-cucumber): tests/{layer}/{epic-folder}/{TC_ID_LOWER}.spec.ts
  One .steps.ts file per .feature file — matching story ID exactly.

RULE 2 — IMPORTS (step definition files)
  import { Given, When, Then, Before, AfterAll } from '@cucumber/cucumber';
  import { expect } from '@playwright/test';
  import { ToolshopUi } from '../../../support/ToolshopUi';
  import { ToolshopApi } from '../../../support/ToolshopApi';
  import { TestDataFactory } from '../../../support/factories/TestDataFactory';
  NEVER import directly from @playwright/test Page or Browser in step defs —
  access via the World interface only.

RULE 3 — WORLD INTERFACE (typed shared context)
  Every step def file must use the typed ToolshopWorld interface from Stage 6.
  ```typescript
  import { ToolshopWorld } from '../../../support/world';
  // All step functions: async function(this: ToolshopWorld, ...)
  ```

RULE 4 — STEP DEFINITIONS CALL ToolshopUi/ToolshopApi ONLY
  Step defs MUST NOT call page.* directly.
  CORRECT:   await this.toolshopUi.login(email, password);
  INCORRECT: await this.page.locator('[data-test="login-submit"]').click();
  Every page interaction goes through ToolshopUi. Every API call goes through ToolshopApi.

RULE 5 — AUTH (storageState — never login in steps)
  The Before hook loads storageState. Steps never call a login method.
  ```typescript
  Before(async function(this: ToolshopWorld) {
    await this.page.context().addCookies(/* from storageState */);
  });
  ```

RULE 6 — ZERO waitForTimeout()
  NEVER use page.waitForTimeout() or any sleep/delay.
  Replace with: waitForURL | waitForResponse | waitForLoadState |
                expect(locator).toBeVisible() | expect(locator).toHaveText()

RULE 7 — TEST DATA (TestDataFactory, backed by test-data/{page}.yaml — only)
  NEVER hardcode: email addresses | names | addresses | phone numbers | passwords |
                  expected error strings | boundary values
  ALWAYS use: TestDataFactory.user() | TestDataFactory.address() etc. — these load
              their values from test-data/{page}.yaml, never from an inline literal
              in TestDataFactory.ts or the step definition itself.
  If the value you need isn't in test-data/{page}.yaml yet, add it there first
  (as a diff, see FILE 4b below), then reference it — do not inline it as a stopgap.
  Store runtime-generated data in: this.testData.{key}

RULE 8 — API CALLS (ToolshopApi only)
  NEVER use fetch() or axios in step definition files.
  ALWAYS use this.toolshopApi.{methodName}() for every HTTP call.

RULE 9 — ALLURE ANNOTATIONS (in Before hook per scenario)
  ```typescript
  Before({ tags: '@{TC_ID_LOWER}' }, async function(this: ToolshopWorld) {
    await allure.epic('{EPIC_KEY}');
    await allure.story('{STORY_ID}');
    await allure.severity('{critical|normal|minor}');
    await allure.description('{one sentence}');
  });
  ```

RULE 10 — ASSERTIONS (web-first, exact text)
  UI assertions: expect(locator).toBeVisible() | toHaveText() | toContainText()
  API assertions: expect(response.status).toBe(N) | expect(body).toMatchObject({})
  Error text: assert EXACT string from practicesoftwaretesting.com — no paraphrasing
  Cross-layer Then steps: MUST have both a UI assertion AND an API assertion.

RULE 11 — AAA COMMENTS
  Every step method body must have exactly three sections:
  // ARRANGE — set up data / preconditions
  // ACT     — perform the action
  // ASSERT  — verify the outcome (in Then steps only)

RULE 12 — SCENARIO OUTLINE STEP DEFS
  For Scenario Outline steps, use typed parameters matching the Examples table.
  ```typescript
  Then('the error {string} is displayed', async function(this: ToolshopWorld, error: string) {
    // ASSERT
    await expect(this.toolshopUi.page.locator('.message-failure')).toHaveText(error);
  });
  ```

════════════════════════════════════════════════════════════════════════════════
GENERATE THESE FILES (in this order):
════════════════════════════════════════════════════════════════════════════════

FILE 1 — STEP DEFINITIONS (primary output)
  Path: tests/step-definitions/{epic-folder}/{STORY_ID}.steps.ts
  Contains: Given/When/Then implementations for EVERY step in the .feature file.
  Zero unimplemented steps — every Gherkin step must have a step definition.

FILE 2 — ToolshopUi ADDITIONS (diff only — show additions, not full file)
  Path: support/ToolshopUi.ts
  Show: only the new methods designed in Stage 6 for this story.
  Format:
    // === NEW METHODS FOR {STORY_ID} — added by Test Generator Agent ===
    async {methodName}({params}): Promise<{type}> {
      // ARRANGE
      // ACT
      // ASSERT (if assertion method)
    }

FILE 3 — ToolshopApi ADDITIONS (diff only)
  Path: support/ToolshopApi.ts
  Show: only the new methods designed in Stage 6 for this story.
  Format same as FILE 2.

FILE 4 — TestDataFactory ADDITIONS (diff only)
  Path: support/factories/TestDataFactory.ts
  Show: only new factory functions for this story. Loader/generator code only —
  zero static literals (see Rule 7).

FILE 4b — test-data/{page}.yaml ADDITIONS (diff only — only if new entries needed
           beyond what Stage 6 already designed)
  Path: test-data/{page}.yaml
  Show: only new persona/boundary/negative entries this story's step defs require.
  These values must match what's already approved in the .feature file — do not
  invent new literals here that weren't in the reviewed Gherkin.

FILE 5 — TypeScript Type ADDITIONS (diff only)
  Path: support/types/{EPIC_KEY}.types.ts
  Show: only new interfaces for this story's request/response bodies.

FILE 6 — FIXTURE ADDITIONS (diff only — only if new fixture needed for this story)
  Path: fixtures/toolshop.fixtures.ts
  Show: only the new fixture definitions from Stage 6 for this story.

════════════════════════════════════════════════════════════════════════════════
SELF-REVIEW CHECKLIST — Run BEFORE delivering. Fix any ❌ before output.
════════════════════════════════════════════════════════════════════════════════

Show this checklist with ✅ or ❌ for each item:

[ ] Every Gherkin step in the .feature file has a matching step definition — zero pending
[ ] Zero waitForTimeout() in any generated file
[ ] All step defs call ToolshopUi/ToolshopApi — zero raw page.* calls
[ ] World interface (ToolshopWorld) used in every step function signature
[ ] Allure Before hook present with epic/story/severity/description for each TC tag
[ ] TestDataFactory used — zero hardcoded emails/names/addresses, TestDataFactory
    itself holds zero static literals (all sourced from test-data/{page}.yaml)
[ ] Exact error message text from practicesoftwaretesting.com in all Then assertions
[ ] AAA comments present in every step method body
[ ] Tags in .feature file scenarios match the Stage 5 tagging map exactly
[ ] ToolshopApi used for all API calls — zero fetch() or axios calls
[ ] storageState loaded in Before — no login steps in scenario body
[ ] Cross-layer Then steps assert BOTH UI state AND API state
[ ] Scenario Outline parameters are typed correctly
[ ] Code Reviewer Agent checklist pre-validated (all 12 rules above)

If any item is ❌: fix it, then re-run the checklist before delivering.

════════════════════════════════════════════════════════════════════════════════
HANDOFF TO CODE REVIEWER AGENT
════════════════════════════════════════════════════════════════════════════════
After generating all files, create this handoff message for the Code Reviewer Agent:

```
CODE REVIEW REQUEST
Epic: {EPIC_KEY} | Story: {STORY_ID}
Files to review:
  - tests/step-definitions/{epic-folder}/{STORY_ID}.steps.ts  [NEW]
  - support/ToolshopUi.ts                                          [MODIFIED]
  - support/ToolshopApi.ts                                         [MODIFIED]
  - support/factories/TestDataFactory.ts                      [MODIFIED]
  - support/types/{EPIC_KEY}.types.ts                         [MODIFIED]
  - fixtures/toolshop.fixtures.ts                                  [MODIFIED if applicable]
Self-review checklist: ALL ✅
Feature file: features/{epic-folder}/{STORY_ID}-{short-name}.feature
Architecture doc: docs/epics/architecture_{EPIC_KEY}.md
```

OUTPUT ARTIFACTS:
  NEW FILES:
    tests/step-definitions/{epic-folder}/{STORY_ID}.steps.ts
  MODIFIED (diff):
    support/ToolshopUi.ts
    support/ToolshopApi.ts
    support/factories/TestDataFactory.ts
    test-data/{page}.yaml  (if applicable)
    support/types/{EPIC_KEY}.types.ts
    fixtures/toolshop.fixtures.ts  (if applicable)
  MASTER UPDATE:
    docs/master/test_generator_MASTER.md
    Row: | {EPIC_KEY} | {STORY_ID} | {TC count} | ✅ Generated | Pending Review | {timestamp} |

REPEAT THIS STAGE: Once per Jira Story (one .feature file at a time).
When ALL stories in the epic are generated AND Code Reviewer has approved all:
  → Proceed to Stage 8 (Execution Agent)

================================================================================
STAGE 7b — CODE REVIEWER AGENT
(Runs after EVERY Stage 7 story batch — before Stage 8 begins)
================================================================================

PROMPT:
-------
You are the Code Reviewer Agent for the Toolshop Agentic Test Automation Framework.
Review ALL code generated by the Test Generator Agent for epic {EPIC_KEY} before
any test execution begins. Your review is the quality gate between generation and
execution — Stage 8 does NOT start until you post APPROVED.

CONTEXT (attach ALL of the following):
- All newly generated step definition files: tests/step-definitions/{epic-folder}/*.steps.ts
- All modified support files: ToolshopUi.ts | ToolshopApi.ts | TestDataFactory.ts | *.types.ts
- All modified test-data files: test-data/*.yaml
- All modified fixture files: fixtures/toolshop.fixtures.ts
- docs/epics/architecture_{EPIC_KEY}.md       (Stage 6 — design conventions)
- docs/epics/automation_plan_{EPIC_KEY}.md    (Stage 5 — tagging map, agent assignments)
- features/{epic-folder}/*.feature            (Stage 5 — Gherkin source of truth)
- The 12 coding rules from Stage 7

YOUR REVIEW PROCESS — check every file against every rule:

RULE CHECK 1 — ZERO waitForTimeout()
  grep -r "waitForTimeout" tests/step-definitions/{epic-folder}/
  grep -r "waitForTimeout" support/
  FAIL if: any match found

RULE CHECK 2 — ZERO raw page.* calls in step definitions
  Step def files must call ToolshopUi/ToolshopApi only.
  Look for: page.click | page.fill | page.locator | page.goto | page.getBy*
  in tests/step-definitions/ — these are violations.
  FAIL if: any raw page.* call found in step def files

RULE CHECK 3 — ZERO XPath selectors
  grep -r "xpath" support/ToolshopUi.ts (case-insensitive)
  grep -r '"//' support/ToolshopUi.ts
  FAIL if: any XPath found

RULE CHECK 4 — ZERO unimplemented steps
  Every step in every .feature file must have an implementation.
  Cross-check: list all steps from *.feature → confirm each exists in .steps.ts
  FAIL if: any Gherkin step has no matching step definition

RULE CHECK 5 — ALLURE ANNOTATIONS COMPLETE
  Every test case tag (@{TC_ID_LOWER}) must have a Before hook with:
  allure.epic | allure.story | allure.severity | allure.description
  FAIL if: any TC tag missing a Before hook or missing any of the 4 annotations

RULE CHECK 6 — TAGS MATCH AUTOMATION PLAN
  Each Scenario tag line in .feature files must match the tagging map from
  docs/epics/automation_plan_{EPIC_KEY}.md Section D exactly.
  FAIL if: any scenario has tags not in the approved tagging map

RULE CHECK 7 — ZERO HARDCODED TEST DATA (TestDataFactory + YAML only)
  grep -r "@qa.io\|@test.com\|password123\|Test@1234\|123 Main St"
  in step definition and spec files
  FAIL if: any hardcoded email/name/address/phone found (TestDataFactory must be used)
  ALSO check support/factories/TestDataFactory.ts itself for static string/number
  literals that should instead be entries in test-data/{page}.yaml
  FAIL if: TestDataFactory.ts contains a static literal instead of a YAML lookup

RULE CHECK 8 — CROSS-LAYER STEPS ASSERT BOTH SURFACES
  Every @cross-layer scenario's Then steps must include:
  - At least one UI assertion (expect(locator)...)
  - At least one API assertion (expect(response.status)...)
  FAIL if: any cross-layer scenario has only UI or only API assertions

RULE CHECK 9 — ToolshopApi FOR ALL API CALLS
  grep -r "fetch(\|axios\." tests/step-definitions/
  FAIL if: any raw fetch() or axios call found in step def files

RULE CHECK 10 — WORLD INTERFACE USED
  Every step function must have this.toolshopUi or this.toolshopApi — typed via ToolshopWorld.
  FAIL if: any step function lacks the ToolshopWorld type annotation

RULE CHECK 11 — AAA COMMENTS PRESENT
  Every step method body must contain // ARRANGE, // ACT, // ASSERT
  (// ASSERT only in Then steps — Given and When steps need // ARRANGE and // ACT)
  FAIL if: any step body missing the required comments

RULE CHECK 12 — SCENARIO OUTLINE PARAMETERS TYPED
  Scenario Outline step defs must use typed string/int/float parameters.
  FAIL if: any Outline parameter captured as untyped or as 'any'

PRODUCE THIS REVIEW REPORT:

```markdown
## Code Review Report — {EPIC_KEY} — {STORY_ID_LIST}
**Reviewer:** Code Reviewer Agent
**Reviewed at:** {TIMESTAMP}
**Files reviewed:** {N}

### Rule Check Results
| Rule | Status | Finding |
|---|---|---|
| 1. Zero waitForTimeout | ✅/❌ | {clean / file:line} |
| 2. No raw page.* in steps | ✅/❌ | {clean / violation detail} |
| 3. No XPath | ✅/❌ | {clean / found in ToolshopUi.ts:N} |
| 4. All Gherkin steps implemented | ✅/❌ | {N} pending steps found |
| 5. Allure annotations complete | ✅/❌ | {clean / missing on TC IDs} |
| 6. Tags match automation plan | ✅/❌ | {clean / mismatch on scenario} |
| 7. No hardcoded test data | ✅/❌ | {clean / found in file:line} |
| 8. Cross-layer asserts both surfaces | ✅/❌ | {clean / TC ID missing API assert} |
| 9. ToolshopApi for API calls | ✅/❌ | {clean / fetch() found in file:line} |
| 10. World interface typed | ✅/❌ | {clean / untyped in file:line} |
| 11. AAA comments | ✅/❌ | {clean / missing in method} |
| 12. Outline params typed | ✅/❌ | {clean / 'any' found in file:line} |

### Decision: ✅ APPROVED / ❌ CHANGES REQUESTED

**Blocking issues (if CHANGES REQUESTED):**
- Rule {N}: {specific file, line, and fix required}

**Non-blocking observations:**
- {style suggestion or future improvement — does not block merge}
```

ROUTING:
  APPROVED        → Post review to code_review_{EPIC_KEY}.md, notify Test Generator
                    Agent, proceed to Stage 8 (Execution)
  CHANGES REQUESTED → Return ALL failing files to Test Generator Agent with exact
                    line-by-line fixes required. Re-review after fix. Do not proceed
                    to Stage 8 until ALL rules pass.

OUTPUT ARTIFACTS:
  EPIC FILE   → docs/epics/code_review_{EPIC_KEY}.md         (create/append per story)
  MASTER FILE → docs/master/code_review_MASTER.md            (update {EPIC_KEY} row)

  Master row: | {EPIC_KEY} | {STORY_ID_LIST} | ✅ Approved / ❌ Blocked | {issues} | {timestamp} |

================================================================================
STAGE 8 — EXECUTION AGENT
================================================================================

PROMPT:
-------
You are the Execution Agent for the Toolshop Agentic Test Automation Framework.
Using the Playwright MCP, execute the generated test suite for epic {EPIC_KEY}
and capture the full execution result set.

CONTEXT:
- All spec files for this epic: tests/ui/{epic-folder}/ | tests/api/{epic-folder}/ |
  tests/cross-layer/ (as generated in Stage 7)
- playwright.config.ts settings:
    baseURL: https://practicesoftwaretesting.com
    retries: 2 (CI) | 0 (local)
    workers: 2  (shared demo store — prevents data collisions)
    trace: on-first-retry
    screenshot: only-on-failure
    reporter: allure-playwright
- storageState: .auth/user.json (from AA-1 Stage 7)

EXECUTION SEQUENCE — RUN IN THIS ORDER:

STEP 1 — Pre-flight check
  npx playwright test --list --grep "@{EPIC_KEY_LOWERCASE}"
  Confirm all expected spec files are discovered.
  If count is 0 or incorrect: STOP and report which files are missing. Do not proceed.

STEP 2 — Smoke run
  npx playwright test --grep "@smoke" --reporter=list
  Capture: pass count | fail count | duration
  If ANY smoke test fails: go to Stage 9 (Heal) immediately.
  Do NOT proceed to regression while smoke is failing.

STEP 3 — Full regression (only if Step 2 passed 100%)
  npx playwright test tests/ui/{epic-folder} tests/api/{epic-folder} tests/cross-layer \
    --grep "@regression" --workers=2 --reporter=allure-playwright
  Capture: full result set

STEP 4 — API-only run
  npx playwright test tests/api/{epic-folder} --reporter=list
  Capture API results separately for the report.

STEP 5 — Generate Allure report
  npx allure generate ./allure-results --clean -o ./allure-report
  Verify report was generated at ./allure-report/index.html

PRODUCE THIS EXECUTION SUMMARY (save as JSON):
```json
{
  "epic": "{EPIC_KEY}",
  "epic_title": "{EPIC_TITLE}",
  "run_timestamp": "{ISO timestamp}",
  "smoke":      { "total": 0, "passed": 0, "failed": 0, "duration_ms": 0 },
  "regression": { "total": 0, "passed": 0, "failed": 0, "skipped": 0, "duration_ms": 0 },
  "api":        { "total": 0, "passed": 0, "failed": 0 },
  "pass_rate_percent": 0,
  "failed_tests": [
    {
      "test_case_id": "{TC_ID}",
      "spec_file": "tests/path/to/spec.ts",
      "test_title": "full test title string",
      "error_message": "exact error from Playwright",
      "allure_step_failed": "step name",
      "trace_file": ".playwright/traces/trace.zip",
      "screenshot": ".playwright/screenshots/screen.png",
      "retry_count": 0
    }
  ],
  "allure_report_path": "./allure-report",
  "smoke_passed": true
}
```

OUTPUT ARTIFACTS:
  RESULT FILE → docs/epics/execution_result_{EPIC_KEY}_{timestamp}.json   (create new)
  MASTER FILE → docs/master/execution_MASTER.md                           (update {EPIC_KEY} row only)

  Master row to update (under ## Execution Status table):
  | {EPIC_KEY} | {EPIC_TITLE} | {pass_rate}% | {smoke_status} | {timestamp} | {allure_link} |

ROUTING:
  failed_tests is empty   → proceed to Stage 10 (Report)
  failed_tests not empty  → proceed to Stage 9 (Heal) for EACH failure, then re-run Stage 8

================================================================================
STAGE 9 — SELF-HEAL AGENT
================================================================================

PROMPT:
-------
You are the Test Healer Agent for the Toolshop Agentic Test Automation Framework.
A test has failed after {retry_count} Playwright retries. Diagnose the root cause
and apply the correct fix.

FAILURE INPUT (paste from Stage 8 execution_result JSON):
  Test Case ID:     {TEST_CASE_ID}
  Spec file:        {SPEC_FILE_PATH}
  Test title:       {FULL_TEST_TITLE}
  Error message:    {EXACT_ERROR_MESSAGE}
  Stack trace:      {STACK_TRACE}
  Allure step:      {STEP_NAME_WHERE_FAILED}
  Trace file:       {TRACE_ZIP_PATH}
  Screenshot:       {SCREENSHOT_PNG_PATH}
  Retry count:      {N}

DIAGNOSIS — FOLLOW THESE STEPS IN ORDER. DO NOT SKIP ANY.

STEP 1 — Classify the failure into one category:
  A — Test code defect     (wrong selector, wrong assertion, wrong wait strategy)
  B — Application change   (AUT changed UI text, URL, or API response shape)
  C — Application bug      (the feature is genuinely broken — test is correct)
  D — Environment issue    (network timeout, demo store instability, 5xx error)

  Classification guide:
  - TimeoutError waiting for locator → A or B (selector/text changed)
  - AssertionError: expected X received Y → B or C (app changed or broken)
  - net::ERR_* or 5xx error → D (environment)
  - TypeError or compilation error → A (code defect)

STEP 2 — Inspect the Playwright trace
  Open {TRACE_ZIP_PATH} using the Playwright MCP.
  Examine: DOM snapshot at failure point | network requests | before/after element state
  Note: does the element exist? Has its text or role changed?

STEP 3 — Verify on the live site
  Using Playwright MCP, navigate to: {FAILING_PAGE_URL}
  Take a fresh screenshot and compare with {SCREENSHOT_PNG_PATH}.
  Answer: Is the expected element present? Has the text changed? Has the URL changed?

STEP 4 — Determine fix:
  A — Update selector/locator in ToolshopUi.ts or spec file
  B — Update assertion text or URL pattern in spec file
  C — DO NOT fix the test. File a Jira bug instead.
      Bug title: "[{EPIC_KEY}] {SHORT_DESCRIPTION} — found by Test Healer Agent"
      Include: steps to reproduce from Gherkin, expected vs actual, screenshot
  D — Add @flaky tag, document in docs/epics/known_issues_{EPIC_KEY}.md,
      increase retry annotation for this specific test.

STEP 5 — Apply the fix (ONLY for A and B)
  Show a clean BEFORE / AFTER diff for every changed line.
  Change MINIMUM lines necessary. Do not refactor surrounding code.
  Do not change test logic — only fix the selector, text, or URL.

STEP 6 — Verify the fix
  Re-run ONLY the failing spec:
  npx playwright test {SPEC_FILE} --retries=0 --reporter=list
  If PASSED → proceed to Step 7
  If STILL FAILING → repeat from Step 1 with new information

STEP 7 — Produce Heal Report

```markdown
## Heal Report — {TEST_CASE_ID}
**Spec file:** {SPEC_FILE_PATH}
**Run timestamp:** {ISO TIMESTAMP}
**Failure category:** {A / B / C / D}
**Root cause:** {one sentence}
**Fix applied:** {description}

**Files changed:**
- {file path 1}
- {file path 2}

**Diff:**
BEFORE:
  {old code lines}
AFTER:
  {new code lines}

**Verification:** Re-run result — ✅ PASSED / ❌ STILL FAILING
**Jira action:** {Bug filed: NOP-XXXX — {URL} | No action needed}
**Test annotation added:** @healed-{YYYYMMDD}
```

OUTPUT ARTIFACTS:
  HEAL REPORT → docs/epics/heal_reports/heal_{TEST_CASE_ID}_{timestamp}.md  (create new)
  PATCHED SPEC → {SPEC_FILE_PATH}                                            (overwrite)
  ToolshopUi DIFF   → support/ToolshopUi.ts if selector changed                       (overwrite)
  MASTER FILE  → docs/master/heal_MASTER.md                                 (update {EPIC_KEY} row)

  Master row to update (under ## Heal Summary table):
  | {EPIC_KEY} | {TEST_CASE_ID} | {A/B/C/D} | ✅ Healed / 🐛 Bug Filed | {timestamp} |

ROUTING AFTER HEAL:
  All failures healed (C failures excluded as Jira bugs) → Stage 8 (re-run execution)
  Re-run passes → Stage 10 (Report)
  Re-run still fails → repeat Stage 9 with new trace

================================================================================
STAGE 10 — REPORT ANALYZER AGENT
================================================================================

PROMPT:
-------
You are the Report Analyzer Agent for the Toolshop Agentic Test Automation
Framework. Analyze all execution results and heal reports, then produce the
test execution report for epic {EPIC_KEY}.

INPUTS (attach ALL of the following):
- docs/epics/execution_result_{EPIC_KEY}_{timestamp}.json   (Stage 8 — final run)
- docs/epics/heal_reports/heal_*.md                         (Stage 9 — all heals)
- docs/epics/test_plan_{EPIC_KEY}.md                        (Stage 2 — exit criteria)
- docs/epics/automation_plan_{EPIC_KEY}.md                  (Stage 5 — coverage baseline)
- Previous run result if available: docs/epics/execution_result_{EPIC_KEY}_*.json

STEP 0 — VERIFY/GENERATE THE ALLURE REPORT (do this BEFORE writing anything below)
  Most test plans' exit criteria (Stage 2 §6) include "Allure report generated
  and published for the run." Stage 8 Step 5 is supposed to produce it, but a
  long iterative Stage 9 healing cycle can burn through the raw results
  (`allure-results/`) across many re-runs without ever regenerating the HTML
  report — do not assume it exists just because Stage 8/9 ran.
  1. Check whether `./allure-report/index.html` (or an equivalent published
     artifact) already exists and corresponds to the final healed run.
  2. If it does not: run the final regression suite ONE more time (clean
     `allure-results/` first if it contains stale data from earlier healing
     rounds — mixing runs in one report misrepresents both), then
     `npx allure generate ./allure-results --clean -o ./allure-report`.
  3. Use the generated report's own per-scenario timing data for Section 6
     below (Performance Metrics) instead of estimating or omitting it.
  4. Record the report's location (and whether it was already present or
     freshly generated this stage) as its own line in the Executive Summary —
     this is a real exit-criteria item, not an optional nicety, and silently
     shipping a report that doesn't mention it is exactly the gap that
     motivated this step.

TASK — Produce report with ALL these sections:

1. EXECUTIVE SUMMARY (6 bullets — stakeholder-readable, no technical jargon)
   - Overall pass rate vs exit criteria threshold (≥ 95%)
   - Totals: total / passed / failed / healed / skipped
   - Critical path status: ✅ PASSED / ❌ FAILED
   - Open P1/P2 defects: N
   - Allure report: ✅ published at {path} / ❌ not published — reason (see Step 0)
   - Recommendation: ✅ GO FOR RELEASE / ❌ HOLD — reason (an unpublished Allure
     report is itself grounds for HOLD if Stage 2's exit criteria require it —
     don't let strong pass-rate numbers paper over an unmet criterion)

2. DETAILED RESULTS TABLE
   | TC ID | Title | Layer | Tags | Status | Duration | Healed? | Jira Story |

3. FAILURE ANALYSIS
   For each failure:
   - TC ID | Healed? | Category (A/B/C/D) | Jira Bug | Risk to Release

4. COVERAGE ANALYSIS
   - Stories covered: N of N in this epic
   - Scenarios automated: N of N total scenarios (from Stage 3)
   - Deferred scenarios: N (list IDs)
   - Manual only: N (list IDs)

5. TREND COMPARISON (if previous run exists)
   - Pass rate: current vs previous (delta)
   - New failures since last run: N
   - Resolved since last run: N
   - Flaky test trend: improving ↑ / worsening ↓ / stable →

6. PERFORMANCE METRICS (pull per-scenario timing from the Allure report
   generated/verified in Step 0 — do not estimate or omit this section for
   lack of data; that lack of data is exactly what Step 0 exists to prevent)
   - Smoke suite: actual duration vs target (< {N} min)
   - Regression suite: actual duration vs target (< {N} min)
   - 5 slowest tests: TC ID | duration | optimization suggestion

7. RECOMMENDATIONS FOR NEXT SPRINT
   - Tests to add (gaps in coverage)
   - Tests to quarantine (@flaky)
   - Framework improvements identified

OUTPUT ARTIFACTS:
  EPIC FILE     → docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md  (create new)
  ALLURE REPORT → ./allure-report/  (from Step 0 — generated fresh or confirmed
                  already current; note in the epic file whether it was newly
                  generated this stage)
  MASTER FILE   → docs/master/execution_MASTER.md                        (update {EPIC_KEY} row)

  Master row to update (under ## Execution Report table):
  | {EPIC_KEY} | {EPIC_TITLE} | {pass_rate}% | {GO/HOLD} | {healed_count} | {report_link} | {allure_status} | {timestamp} |

NEXT STAGE: Stage 11 — Commit & Push

================================================================================
STAGE 11 — COMMIT & PUSH AGENT
================================================================================

PROMPT:
-------
You are the Commit & Push Agent for the Toolshop Agentic Test Automation Framework.
Using the GitHub MCP, create a feature branch, commit all generated and healed files,
and push to the remote repository.

CONTEXT:
- Repository: https://github.com/varun041/agentic-ai-toolshop-automation.git
- Base branch: main
- Branch naming: varun_08_01_26
 

COMMIT MESSAGE FORMAT:
  Subject line (72 chars max):
    feat(tests): [{EPIC_KEY}] {EPIC_TITLE} — {N} specs, {pass_rate}% pass

  Body:
    UI tests:          +{n} spec files
    API tests:         +{n} spec files
    Cross-layer tests: +{n} spec files
    ToolshopUi methods:     +{n} new
    ToolshopApi methods:    +{n} new
    Healed tests:      {n} (see docs/epics/heal_reports/)

    Jira stories: {STORY_IDS comma separated}
    Allure report: {ALLURE_REPORT_LINK}
    Pass rate: {PASS_RATE}% ({passed}/{total})

FILES TO COMMIT — IN THIS EXACT ORDER:
  1.  tests/ui/{epic-folder}/*.spec.ts
  2.  tests/api/{epic-folder}/*.spec.ts
  3.  tests/cross-layer/{epic-related}*.spec.ts
  4.  support/ToolshopUi.ts
  5.  support/ToolshopApi.ts
  6.  support/factories/TestDataFactory.ts
  7.  fixtures/toolshop.fixtures.ts
  8.  docs/epics/requirements_{EPIC_KEY}.md
  9.  docs/epics/test_plan_{EPIC_KEY}.md
  10. docs/epics/test_scenarios_{EPIC_KEY}.md
  11. docs/epics/test_cases_{EPIC_KEY}.md
  12. docs/epics/automation_plan_{EPIC_KEY}.md
  13. docs/epics/architecture_{EPIC_KEY}.md
  14. docs/epics/execution_result_{EPIC_KEY}_{timestamp}.json
  15. docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md
  16. docs/epics/heal_reports/heal_*.md  (all heal reports for this epic)
  17. docs/epics/known_issues_{EPIC_KEY}.md  (if created in Stage 9)
  18. docs/master/*.md  (all master files updated during this epic's run)

STEPS:
  STEP 1: git checkout -b {branch-name}
  STEP 2: Verify each file path exists before staging. Report missing files.
          Stop if any spec file is missing.
  STEP 3: git add {all files above}
  STEP 4: git commit -m "{commit message}"
  STEP 5: git push origin {branch-name}
  STEP 6: Confirm remote branch exists and commit SHA matches local

OUTPUT ARTIFACTS:
  PUSH SUMMARY → docs/epics/push_summary_{EPIC_KEY}.md  (create new)
  MASTER FILE  → docs/master/commit_MASTER.md           (update {EPIC_KEY} row)

  Push summary content:
    Branch: {branch-name}
    Commit SHA: {SHA}
    Files committed: {N}
    Remote URL: {GITHUB_REPO_URL}/tree/{branch-name}

  Master row: | {EPIC_KEY} | {branch-name} | {SHA} | {N files} | {timestamp} |

NEXT STAGE: Stage 12 — Trigger CI

================================================================================
STAGE 12 — CI TRIGGER AGENT
================================================================================

PROMPT:
-------
You are the CI Trigger Agent for the Toolshop Agentic Test Automation Framework.
Using the GitHub MCP, trigger the GitHub Actions workflow on the pushed branch
and monitor the run until it completes or times out.

CONTEXT:
- Repository: (https://github.com/varun041/agentic-ai-toolshop-automation.git)
- Branch: {varun_08_01_26} (from Stage 11 push summary)
- Workflow file: .github/workflows/playwright.yml
- Maximum wait: 45 minutes
- Poll interval: 30 seconds

EXPECTED WORKFLOW STEPS (in order):
  1. checkout
  2. setup-node (Node 20)
  3. npm ci
  4. cache-restore (~/.cache/ms-playwright)
  5. playwright-install (--with-deps)
  6. smoke-run (npx playwright test --grep "@smoke")
  7. regression-run (npx playwright test --grep "@regression") — only if smoke passed
  8. allure-generate
  9. upload-allure-artifact
  10. upload-trace-artifact (on failure only)

STEPS:
  STEP 1: Trigger workflow
    POST /repos/{owner}/{repo}/actions/workflows/playwright.yml/dispatches
    Body: { "ref": "{BRANCH_NAME}" }
    (If auto-triggered by push, skip this step and find the run by branch name)

  STEP 2: Find the workflow run ID
    GET /repos/{owner}/{repo}/actions/runs?branch={BRANCH_NAME}&event=push
    Extract: run_id, html_url, status

  STEP 3: Poll for completion
    Every 30 seconds: GET /repos/{owner}/{repo}/actions/runs/{run_id}
    Show live status updates: queued → in_progress → completed
    Stop polling at: conclusion = success | failure | cancelled | timed_out
    If 45 min elapsed with no conclusion: report timeout, stop

  STEP 4: Collect results
    GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs
    Extract each job: name | conclusion | duration_seconds

  STEP 5: Get artifact URLs
    GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts
    Extract: allure_report download URL | trace_files download URL

CI RESULT JSON:
```json
{
  "epic": "{EPIC_KEY}",
  "branch": "{BRANCH_NAME}",
  "workflow_run_id": 0,
  "workflow_run_url": "{URL}",
  "conclusion": "success|failure|timed_out",
  "duration_seconds": 0,
  "jobs": {
    "smoke": "success|failure|skipped",
    "regression": "success|failure|skipped",
    "allure": "success|failure"
  },
  "artifacts": {
    "allure_report_url": "{URL}",
    "trace_files_url": "{URL}"
  }
}
```

OUTPUT ARTIFACTS:
  CI RESULT   → docs/epics/ci_result_{EPIC_KEY}_{timestamp}.json  (create new)
  MASTER FILE → docs/master/ci_MASTER.md                          (update {EPIC_KEY} row)

  Master row: | {EPIC_KEY} | {branch} | {conclusion} | {duration}s | {allure_url} | {timestamp} |

ROUTING:
  conclusion = success → Stage 13 (Open PR)
  conclusion = failure → Stage 9 (Heal with CI failure details) then re-trigger Stage 12
  conclusion = timed_out → report to human, investigate workflow config

================================================================================
STAGE 13 — PULL REQUEST AGENT
================================================================================

PROMPT:
-------
You are the Pull Request Agent for the Toolshop Agentic Test Automation Framework.
Using the GitHub MCP, create a comprehensive pull request for the test branch
and post the Release Readiness Assessment as a PR comment.

CONTEXT (attach the following):
- docs/epics/push_summary_{EPIC_KEY}.md          (Stage 11)
- docs/epics/ci_result_{EPIC_KEY}_{timestamp}.json (Stage 12)
- docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md (Stage 10)
- All docs/epics/heal_reports/heal_*.md files

PR TITLE:
  [{EPIC_KEY}] {EPIC_TITLE} — {N} Playwright specs | {PASS_RATE}% pass | {GO/HOLD}

PR BODY (use this exact template):

```markdown
## 📋 Summary
Automated test suite for **{EPIC_KEY} — {EPIC_TITLE}** generated and validated
by the Toolshop Agentic AI Pipeline (13-stage, human-gated).

**Pipeline position:** {N}th of 9 epics in sequence

## 🎯 Jira Stories Covered
| Story ID | Title | Automated | Layer |
|---|---|---|---|
{one row per story}

## 📊 Test Execution Results
| Layer       | Total | Passed | Failed | Healed | Skipped |
|---|---|---|---|---|---|
| UI          | N     | N      | N      | N      | N       |
| API         | N     | N      | N      | N      | N       |
| Cross-layer | N     | N      | N      | N      | N       |
| **Total**   | **N** | **N**  | **N**  | **N**  | **N**   |

**Pass rate:** {N}% (target ≥ 95%)
**Smoke suite:** ✅ {N}/{N} in {N}s (target < 5 min)
**Regression suite:** {N}/{N} in {N}m (target < 30 min)

## 📁 Files Changed
- `tests/ui/{epic-folder}/` — {N} spec files
- `tests/api/{epic-folder}/` — {N} spec files
- `tests/cross-layer/` — {N} spec files
- `support/ToolshopUi.ts` — {N} methods added
- `support/ToolshopApi.ts` — {N} methods added
- `docs/epics/` — {N} documentation files
- `docs/master/` — {N} master files updated (rows for {EPIC_KEY} only)

## 🔗 Reports & Artifacts
- 📈 [Allure Report]({ALLURE_REPORT_URL})
- 🔍 [GitHub Actions Run]({WORKFLOW_RUN_URL})
- 📄 [Execution Report](docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md)
- 📋 [Test Cases](docs/epics/test_cases_{EPIC_KEY}.md)

## 🩹 Self-Healed Tests ({N} total)
{If any: | TC ID | Root Cause | Category | Fix Applied |}
{If none: "No tests required healing in this run. ✅"}

## ⚠️ Known Issues (Category C — App Bugs)
{If any: | Jira Bug | TC ID | Description |}
{If none: "No application bugs discovered in this run. ✅"}

## ✅ Pre-Merge Checklist
- [ ] All {N} Jira stories in this epic have ≥ 1 automated test
- [ ] Smoke suite: 100% pass rate
- [ ] Regression suite: ≥ 95% pass rate
- [ ] Zero P1/P2 open defects linked to this epic
- [ ] Allure report accessible at link above
- [ ] Zero waitForTimeout() calls in any committed spec file
- [ ] All healed tests annotated @healed-{date}
- [ ] All known bugs tagged @known-bug with Jira link
- [ ] docs/master/ rows updated for {EPIC_KEY} only (no other epics touched)
- [ ] QA Lead has approved via 🔴 HUMAN GATE

## 🤖 Generated by
Toolshop Agentic AI Pipeline
Epic: {EPIC_KEY} ({N}th of 9) | Run: {TIMESTAMP}
Stage flow: Requirements → Test Plan → Scenarios → Cases →
            Automation Plan → Architecture → Generator →
            Executor → Healer → Reporter → Committer → CI → PR
```

POST-CREATION STEPS:
  1. Add labels: automation | playwright | {epic-key-lowercase} | needs-review
  2. Assign QA Lead as reviewer
  3. Post Release Readiness Assessment as first PR comment (see Supplementary prompt)
  4. Link PR to each Jira story via Jira MCP:
     Comment on each story: "Automated in PR #{N}: {PR_URL} | Pass rate: {PASS_RATE}%"
  5. Update Jira story status to "In Review" via Jira MCP

OUTPUT ARTIFACTS:
  PR URL      → {GITHUB_REPO_URL}/pull/{PR_NUMBER}
  MASTER FILE → docs/master/pr_MASTER.md  (update {EPIC_KEY} row)

  Master row: | {EPIC_KEY} | PR #{N} | {pass_rate}% | {GO/HOLD} | Pending Review | {timestamp} |

🔴 HUMAN GATE:
QA Lead must review and approve this PR before merge.
The Release Readiness Agent assessment (below) is advisory.
DO NOT auto-merge under any circumstances.

On merge: update master row status to ✅ Merged | {merged_timestamp}
PIPELINE COMPLETE FOR {EPIC_KEY} ✅
NEXT: Begin pipeline for next epic in sequence: {NEXT_EPIC_KEY} — {NEXT_EPIC_TITLE}

================================================================================
SUPPLEMENTARY — RELEASE READINESS AGENT
================================================================================

PROMPT:
-------
You are the Release Readiness Agent for the Toolshop Agentic Test Automation
Framework. Review all pipeline artifacts and produce a GO / NO-GO decision.
Post this as the FIRST comment on the PR created in Stage 13.

INPUTS (attach ALL of the following):
- docs/epics/execution_report_{EPIC_KEY}_{timestamp}.md   (Stage 10)
- docs/epics/ci_result_{EPIC_KEY}_{timestamp}.json        (Stage 12)
- docs/epics/heal_reports/heal_*.md                       (Stage 9 — all heals)
- docs/epics/automation_plan_{EPIC_KEY}.md                (Stage 5 — for coverage)
- docs/epics/requirements_{EPIC_KEY}.md                   (Stage 1 — for story count)
- docs/master/execution_MASTER.md                         (for cross-epic pass rate trend)

EVALUATE GATES IN ORDER. First FAIL = NO-GO immediately. Do not skip to next gate.

GATE 1 — Story Coverage
  Rule: Every story in this epic must have ≥ 1 automated test case
  Check: Count stories in requirements_{EPIC_KEY}.md vs automation_plan coverage table
  PASS: all stories covered | FAIL: any story has zero tests

GATE 2 — Smoke Pass Rate
  Rule: 100% of @smoke tests must pass
  Check: execution_result.smoke.failed === 0
  PASS: 0 failures | FAIL: any failure (healed tests must re-pass — healing does not exempt)

GATE 3 — Regression Pass Rate
  Rule: ≥ 95% of @regression tests must pass
  Check: (regression.passed / regression.total) >= 0.95
  PASS: ≥ 95% | FAIL: < 95% after healing

GATE 4 — Open P1/P2 Defects
  Rule: Zero P1 or P2 open Jira bugs linked to this epic
  Check: Jira MCP query — open bugs, priority P1/P2, epic = {EPIC_KEY}
  PASS: 0 open | FAIL: any P1/P2 open

GATE 5 — Code Quality
  Rule: No waitForTimeout() | all cross-layer tests have UI+API assertions |
        no hardcoded credentials in spec files
  Check: grep -r "waitForTimeout" tests/{epic-folder}/
  PASS: clean | FAIL: any violation

GATE 6 — CI Pipeline
  Rule: GitHub Actions run concluded = success, all jobs passed
  Check: ci_result.conclusion === "success" AND all job conclusions === "success"
  PASS: all green | FAIL: any job failed

GATE 7 — Master File Integrity
  Rule: docs/master/ files have ONLY the {EPIC_KEY} row updated.
        No other epic's rows were modified in this PR.
  Check: git diff main...{BRANCH_NAME} -- docs/master/ | verify only {EPIC_KEY} rows changed
  PASS: only {EPIC_KEY} rows changed | FAIL: any other epic's row modified

GATE 8 — Allure Report
  Rule: Report generated and accessible
  PASS: report accessible | WARN (not fail): first run, no trend data yet

POST AS PR COMMENT:
```markdown
## 🚦 Release Readiness Assessment — {EPIC_KEY} — {EPIC_TITLE}
**Agent:** Release Readiness Agent | **Assessed:** {TIMESTAMP}
**Epic sequence:** {N} of 9

| # | Gate | Status | Detail |
|---|---|---|---|
| 1 | Story Coverage      | ✅/❌ | {N}/{N} stories covered |
| 2 | Smoke Pass Rate     | ✅/❌ | {N}/{N} passed (100% required) |
| 3 | Regression Pass Rate| ✅/❌ | {N}% (≥95% required) |
| 4 | Open P1/P2 Defects  | ✅/❌ | {N} open |
| 5 | Code Quality        | ✅/❌ | {clean / violation detail} |
| 6 | CI Pipeline         | ✅/❌ | {success/failure} |
| 7 | Master File Integrity| ✅/❌ | {clean / diff issue} |
| 8 | Allure Report       | ✅/⚠️ | {accessible / first run} |

---
## Decision: ✅ GO / ❌ NO-GO

**Reason:** {one sentence}

**Blocking issues (NO-GO only):**
- {issue 1 with gate number}
- {issue 2 with gate number}

**Actions required before re-assessment:**
- {action 1}
- {action 2}

**Next epic in sequence:** {NEXT_EPIC_KEY} — {NEXT_EPIC_TITLE}
(Begin only after this PR is merged and approved)
```

If GO:   Approve the PR via GitHub MCP. Update master PR row to "✅ RR Approved".
If NO-GO: Request changes on PR via GitHub MCP. Tag QA Lead. Update master row to "❌ Blocked".

================================================================================
SUPPLEMENTARY — FULL PIPELINE INVOCATION PROMPT
================================================================================

PROMPT (send this to run all 13 stages for one epic in sequence):
-------
You are orchestrating the Toolshop Agentic AI Test Automation Pipeline.
Execute ALL 13 stages in sequence for one epic. One epic at a time.

FILL IN THESE VARIABLES BEFORE SENDING (pre-filled below for the starting epic, AA-1):
  EPIC_KEY:           AA-1
  EPIC_TITLE:         User Authentication & Account Management
  EPIC_SEQUENCE:      1st of 9
  PREVIOUS_EPIC_KEY:  None — AA-1 is the first epic in sequence
  NEXT_EPIC_KEY:      AA-2 — Product Catalog Browsing & Search
  STORY_LIST:
    AA-10 — Register a new customer account
    AA-11 — Login with valid credentials
    AA-12 — Login fails with invalid credentials
    AA-13 — Logout
    AA-14 — Update profile information
  TEST_EMAIL:         {test user email on practicesoftwaretesting.com}
  TEST_PASSWORD:      {test user password}
  GITHUB_REPO_URL:    https://github.com/varun041/agentic-ai-toolshop-automation.git
  BRANCH_NAME:        test/aa-1-{YYYYMMDD}

  For any subsequent epic, replace the block above with that epic's own
  EPIC_KEY / EPIC_TITLE / STORY_LIST pulled live from the Jira MCP (project AA).

DOCUMENT STRATEGY REMINDER (applies to every stage):
  EPIC FILES  → docs/epics/{artifact}_{EPIC_KEY}.md   CREATE NEW per epic
  MASTER FILES → docs/master/{artifact}_MASTER.md     UPDATE {EPIC_KEY} ROW ONLY
  Never modify another epic's row in any master file.
  Never copy full test case content into master files — summary rows only.

PIPELINE RULES:
  1. Do not skip any stage — all 13 are mandatory
  2. Each stage's EPIC FILE output is the next stage's primary input
  3. Stop and ask the human if any stage produces an unresolvable ambiguity
  4. At 🔴 HUMAN GATE stages (2, 4, 13): PAUSE, present artifact, wait for explicit approval
  5. If Stage 9 (Heal) is triggered: complete ALL healing before re-running Stage 8
  6. Log every stage completion:
     "✅ Stage {N} — {STAGE_NAME} complete | Epic file: {filename} | Master updated: ✅"
  7. If Stage 12 CI fails: go back to Stage 9, then re-run Stage 8, then re-trigger Stage 12
  8. Do not open the PR (Stage 13) until CI is green (Stage 12 conclusion = success)

BEGIN NOW:
Start with Stage 1 — Requirements Capture for {EPIC_KEY}.
Use the Jira MCP to read epic {EPIC_KEY} and its child stories from the AA project.
First output: docs/epics/requirements_{EPIC_KEY}.md + update docs/master/requirements_MASTER.md

================================================================================
MASTER FILE INITIALISATION PROMPT
(Run ONCE before starting AA-1 — creates all empty master files)
================================================================================

PROMPT:
-------
You are the Documentation Generator Agent for the Toolshop Agentic Test Automation
Framework. Before the pipeline begins for the first epic (AA-1), create all
master file skeletons in docs/master/. These files will be updated row by row
as each epic completes its pipeline stages.

Create ALL of the following files with their empty table structures:

FILE 1: docs/master/requirements_MASTER.md
  ## Toolshop — Requirements Status
  | Epic | Title | Status | Stories | Last Updated |
  |---|---|---|---|---|
  | AA-1 | User Authentication & Account Management | ⏳ Pending | — | — |
  | AA-2 | Product Catalog Browsing & Search | ⏳ Pending | — | — |
  | AA-3 | Shopping Cart Management | ⏳ Pending | — | — |
  | AA-4 | Checkout & Order Placement | ⏳ Pending | — | — |
  | AA-5 | Order History & Invoices | ⏳ Pending | — | — |
  | AA-6 | Favorites / Wishlist | ⏳ Pending | — | — |
  | AA-7 | Contact & Customer Support | ⏳ Pending | — | — |
  | AA-8 | Admin — Product & Catalog Management | ⏳ Pending | — | — |
  | AA-9 | Admin — Order & User Management | ⏳ Pending | — | — |

FILE 2: docs/master/test_plan_MASTER.md
  ## Project-wide Test Strategy
  (Written by AA-1 Stage 2 — never modified again)
  - Auth: storageState reused from AA-1 across all epics
  - Data: faker timestamps, API seeding, unique per test
  - CI: smoke on every PR, regression nightly, critical-path pre-release
  - Workers: 2 (shared demo store)

  ## Project-wide Risk Register
  (Written by AA-1 Stage 2 — never modified again)
  | Risk | Likelihood | Impact | Mitigation |
  | Shared demo store — no data reset | High | High | Unique data per test |
  | API plugin not on public demo | Medium | High | UI tests only where API unavailable |
  | Network flakiness on demo store | Medium | Medium | retries: 2 in CI |
  | Test data collision across epics | Low | High | worker namespacing |

  ## Test Plan Status by Epic
  | Epic | Title | Status | Stories | Approved By | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 3: docs/master/test_cases_MASTER.md
  ## Test Case Coverage by Epic
  | Epic | Title | Status | Total TCs | UI | API | Cross-layer | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 4: docs/master/automation_plan_MASTER.md
  ## Automation Coverage by Epic
  | Epic | Title | Now | Later | Manual | Total Effort | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 5: docs/master/architecture_MASTER.md
  ## Architecture Status by Epic
  | Epic | Title | Status | ToolshopUi+ | ToolshopApi+ | Fixtures | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 6: docs/master/execution_MASTER.md
  ## Execution Status by Epic
  | Epic | Title | Pass Rate | Smoke | Regression | Allure | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 7: docs/master/heal_MASTER.md
  ## Heal Summary by Epic
  | Epic | TC ID | Category | Outcome | Jira Bug | Timestamp |
  (empty — rows added as heals occur)

FILE 8: docs/master/pr_MASTER.md
  ## Pull Request Status by Epic
  | Epic | PR # | Pass Rate | RR Decision | Merge Status | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 9: docs/master/ci_MASTER.md
  ## CI Pipeline Status by Epic
  | Epic | Branch | Conclusion | Duration | Allure URL | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 10: docs/master/commit_MASTER.md
  ## Commit & Push Status by Epic
  | Epic | Branch | Commit SHA | Files | Timestamp |
  (9 rows, all ⏳ Pending)

FILE 11: docs/master/agent_roster_MASTER.md
  ## Agent Assignment by Epic
  | Epic | Generator | Reviewer | Healer | A11y | Perf | Report | RR | Impact | Health | DocGen | Timestamp |
  (9 rows, all ⏳ Pending)
  Note: This file is updated in Stage 5 for each epic.

FILE 12: docs/master/code_review_MASTER.md
  ## Code Review Status by Epic
  | Epic | Stories Reviewed | Status | Issues Found | Resolved | Timestamp |
  (9 rows, all ⏳ Pending)
  Note: Updated by Code Reviewer Agent (Stage 7b) for each epic.

FILE 13: docs/master/feature_files_MASTER.md
  ## Gherkin Feature File Status by Epic
  | Epic | Title | Feature Files | Scenarios | Smoke | Regression | Cross-layer | Timestamp |
  (9 rows, all ⏳ Pending)
  Note: Updated by Test Generator Agent (Stage 5) for each epic.

FILE 14: docs/master/performance_baseline_MASTER.json
  {
    "baseline_created": null,
    "epics": {
      "AA-1": { "status": "pending", "pages": {} },
      "AA-2": { "status": "pending", "pages": {} },
      "AA-3": { "status": "pending", "pages": {} },
      "AA-4": { "status": "pending", "pages": {} },
      "AA-5": { "status": "pending", "pages": {} },
      "AA-6": { "status": "pending", "pages": {} },
      "AA-7": { "status": "pending", "pages": {} },
      "AA-8": { "status": "pending", "pages": {} },
      "AA-9": { "status": "pending", "pages": {} }
    }
  }
  Note: Performance Reviewer Agent populates this on first run per epic.

After creating all 14 files, output:
  "✅ All 14 master file skeletons created in docs/master/ — ready to begin AA-1 pipeline"
  "✅ features/ directory structure ready"
  "✅ tests/step-definitions/ directory structure ready"

================================================================================
END OF PROMPT PLAYBOOK
Version: 3.0
Changes from v2.0:
  - Stage 5 fully rewritten: 10 agent roster + Gherkin feature file structure
    + tagging map + CI allocation + effort + deferred backlog (8 sections)
  - Stage 6 rewritten: step definition architecture + ToolshopWorld interface design
    + agent handoff map + selector registry with fragile risk rating
  - Stage 7 rewritten: Gherkin-driven step definition generation + 12 coding rules
    + self-review checklist + Code Reviewer Agent handoff message
  - Stage 7b ADDED: Code Reviewer Agent — 12 rule checks, APPROVED/CHANGES REQUESTED
  - Master init: 14 master files (was 10) — added agent_roster, code_review,
    feature_files, performance_baseline masters
  - Footer and HOW TO USE updated with stage flow overview and agent roster

Framework: Toolshop Agentic Test Automation
Source: README.md (Toolshop Agentic Test Automation Framework)
Total stages: 14 (Stage 0 init + Stages 1–13 + Stage 7b) + 2 supplementary
Human gates: Stage 2 (Test Plan) | Stage 4 (Test Cases) | Stage 13 (PR merge)
Document strategy: docs/epics/{artifact}_{EPIC_KEY}.md + docs/master/{artifact}_MASTER.md
Feature files: features/{epic-folder}/{story-id}-{name}.feature (one per Jira Story)
Step defs: tests/step-definitions/{epic-folder}/{story-id}.steps.ts
Agents: 10 specialised — Generator | Reviewer | Healer | HealthCheck | Report |
        A11y | Performance | DocGen | ImpactAnalyzer | ReleaseReadiness
Epic sequence: AA-1 → AA-2 → AA-3 → AA-4 → AA-5 → AA-6 → AA-7 → AA-8 → AA-9 (starting epic: AA-1)
================================================================================
