import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter, Status } from '@cucumber/cucumber';
import { chromium, Browser, Response } from '@playwright/test';
import { epic, story, severity, description, attachment } from 'allure-js-commons';
import * as fs from 'fs';
import * as path from 'path';
import { ToolshopWorld } from './world';
import { ToolshopUi } from './ToolshopUi';
import { ToolshopApi } from './ToolshopApi';

// Stage 8 (AgenticPrompts.md) specifies trace-on-failure and screenshot-on-
// failure via playwright.config.ts settings ("trace: on-first-retry",
// "screenshot: only-on-failure") — that config only applies to Playwright's
// OWN test runner, which this project doesn't use (Cucumber is the runner —
// see docs/epics/architecture_AA-1.md's as-built notes). Reproducing the
// same capability here manually so Stage 9's Test Healer has what it needs:
// every scenario's context always traces (cheap while running), but the
// trace/screenshot files are only SAVED to disk (and attached to the Allure
// report) when the scenario actually fails.
const TRACE_DIR = path.join('test-results', 'traces');
const SCREENSHOT_DIR = path.join('test-results', 'screenshots');

setDefaultTimeout(30 * 1000);

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch();
});

AfterAll(async function () {
  await browser.close();
});

// Fresh context + page per scenario — this is what keeps AA-1-TC-* scenarios
// isolated from each other and avoids the 300s token-expiry risk documented
// in docs/epics/architecture_AA-1.md §5 (each scenario registers + logs in
// its own persona via ToolshopUi.login(), rather than sharing a session).
Before(async function (this: ToolshopWorld, { pickle }: ITestCaseHookParameter) {
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.toolshopUi = new ToolshopUi(this.page);
  this.toolshopApi = new ToolshopApi();
  this.testData = { networkLog: [] as Response[] };
  // Every UI-layer cross-layer assertion (both explicitly-triggered calls like
  // POST /users/register and calls the app fires on its own, like the
  // automatic GET /users/me session check or the post-logout GET
  // /users/refresh) reads from this log via waitForLoggedResponseStatus() in
  // support/stepHelpers.ts, rather than each step wiring its own
  // page.waitForResponse() — one mechanism for both cases.
  this.page.on('response', (response) => {
    (this.testData.networkLog as Response[]).push(response);
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  // Allure annotations (Rule 9, AgenticPrompts.md Stage 7) — derived from the
  // scenario's own tags rather than hardcoded per step-def file, so this one
  // hook covers every AA-1 scenario without per-story duplication. Confirmed
  // live 2026-08-12 (inspecting allure-results/*.json directly) that epic,
  // story, and severity all populate correctly. Also confirmed this
  // requires 'allure-cucumberjs' in cucumber.js's requireModule (not
  // require, and not just the /reporter format entry) — see the comment
  // there. description() below is called but the resulting result.json
  // shows the Gherkin Feature block's own description text instead of
  // pickle.name — a minor, not-fully-understood allure-cucumberjs quirk
  // (something later overwrites it), not investigated further since epic/
  // story/severity — the fields Rule 9 actually gates on — all work.
  const tags = pickle.tags.map((t) => t.name);
  const storyTag = tags.find((t) => /^@aa-1\d$/.test(t));
  await epic('AA-1');
  if (storyTag) await story(storyTag.slice(1).toUpperCase());
  await severity(tags.includes('@smoke') ? 'critical' : 'normal');
  await description(pickle.name);
});

After(async function (this: ToolshopWorld, { pickle, result }: ITestCaseHookParameter) {
  const failed = result?.status === Status.FAILED;
  if (failed) {
    const safeName = pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 80);
    const stamp = Date.now();
    fs.mkdirSync(TRACE_DIR, { recursive: true });
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    const tracePath = path.join(TRACE_DIR, `${safeName}-${stamp}.zip`);
    const screenshotPath = path.join(SCREENSHOT_DIR, `${safeName}-${stamp}.png`);

    await this.context.tracing.stop({ path: tracePath });
    // Best-effort — the page itself may already be closed/unreachable
    // depending on what failed; a missing screenshot shouldn't mask the
    // real failure or crash the hook.
    try {
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
    } catch {
      // no-op — trace is still saved and is the primary diagnostic artifact
    }

    this.testData.tracePath = tracePath;
    this.testData.screenshotPath = fs.existsSync(screenshotPath) ? screenshotPath : undefined;

    await attachment('trace', fs.readFileSync(tracePath), 'application/zip');
    if (fs.existsSync(screenshotPath)) {
      await attachment('screenshot', fs.readFileSync(screenshotPath), 'image/png');
    }
  } else {
    await this.context.tracing.stop();
  }

  await this.toolshopApi.dispose();
  await this.context.close();
});
