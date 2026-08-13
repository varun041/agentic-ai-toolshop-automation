module.exports = {
  default: {
    // 'allure-cucumberjs' (bare import, not just the /reporter subpath) MUST
    // be a requireModule (node module, resolved via require()), NOT a
    // `require` glob entry — confirmed live 2026-08-12 that putting it in
    // `require` silently matched zero files (that array is for glob-matched
    // user files like support/**/*.ts, not npm package specifiers) and its
    // BeforeAll hook (which calls setGlobalTestRuntime()) never ran, so
    // allure-js-commons' epic()/story()/severity()/description() calls (used
    // in support/hooks.ts) silently no-op'ed with "no test runtime is found"
    // on every scenario. Referencing only 'allure-cucumberjs/reporter' in
    // `format` loads the formatter but NOT this registration — the two are
    // separate entry points.
    requireModule: ['ts-node/register', 'allure-cucumberjs'],
    require: ['support/**/*.ts', 'tests/step-definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    // 'summary', not 'progress-bar' — confirmed live 2026-08-12 that
    // progress-bar's \r-overwrite rendering produces no readable output at
    // all when stdout is captured/piped (e.g. CI logs, background task
    // output) rather than an interactive terminal.
    //
    // summary is written to an explicit file, not left to default to
    // stdout — confirmed live 2026-08-12 that combining two formatters
    // which both implicitly target stdout (summary + allure-cucumberjs's
    // reporter) silently drops the summary formatter's output entirely
    // (process still exits correctly, allure-results/ still gets written,
    // but zero readable text appears anywhere). Giving summary its own file
    // resolves this cleanly; use `npx cucumber-js && cat summary.txt` (or
    // just read the file after a background run) to see results.
    format: [
      'summary:summary.txt',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      resultsDir: 'allure-results',
    },
    publishQuiet: true,
  },
};
