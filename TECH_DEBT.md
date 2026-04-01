# Nomie 6 Open Source - Technical Debt Analysis

## 1. Code Structure and Size
The `README.md` outlines a coding rule: **"Keep it under 300 lines."** However, a significant portion of the codebase violates this rule.

There are **53 files** across `src/` (`.ts`, `.js`, `.svelte`) that exceed 300 lines of code.

**Top Offenders (Lines > 500):**
- `src/components/emoji-selector/data/emoji-light.ts` (1570 lines)
- `src/utils/search/latinize.ts` (907 lines)
- `src/domains/usage/usage-chart.svelte` (778 lines)
- `src/domains/analytics/Pivot-table/Utilities.js` (769 lines)
- `src/domains/ledger/LedgerStore.ts` (744 lines)
- `src/domains/board/boardActions.ts` (614 lines)
- `src/domains/afternomie/afternomie-view.svelte` (606 lines)
- `src/domains/trackable/trackable-editor/tracker/trackable-editor-tracker.svelte` (595 lines)
- `src/domains/map/map.svelte` (586 lines)
- `src/domains/import/csv/csv-import-view.svelte` (584 lines)
- `src/domains/stats/statsV5.ts` (555 lines)
- `src/domains/stats/stats-processor.class.ts` (551 lines)
- `src/components/input/input.svelte` (550 lines)
- `src/store/interact.ts` (542 lines)
- `src/domains/uom/uom.config.ts` (541 lines)
- `src/domains/import-export/importer.svelte` (527 lines)
- `src/domains/capture-log/capture-log.svelte` (517 lines)
- `src/domains/templates/template-editor.svelte` (501 lines)

These monolithic components and classes will be difficult to test, maintain, and understand, violating the first coding rule ("Keep it flexible - think in components").


## 2. Testing Infrastructure and Health
The project specifies an objective to "Keep cleaning, organizing and testing" and lists `jest`, `vitest` and `cypress` in its dependencies.

**Current State of Testing:**
- The codebase contains approximately **819** files (`.js`, `.ts`, `.svelte`).
- There are only **55** test files (`*.spec.*` or `*.test.*`).
- Test coverage is exceptionally low for a codebase of this size.
- **Broken Infrastructure:** Testing is currently fundamentally broken.
  - Running `npm run test` or `npm run test-coverage` (which invoke Jest) fails immediately with `Module ts-jest in the transform option was not found`.
  - Running `npm run vtest` or `npm run vtest:coverage` (which invoke Vitest) fails with `Can not find dependency '@vitest/coverage-v8'`.
- The testing framework appears fragmented, attempting to use both Jest and Vitest without completing setup for either in the current environment state.


## 3. Type Safety and Linting
A significant source of technical debt lies in the evasion of typing constraints and linter enforcement.

**Typescript Issues:**
- There are **120 instances** of `@ts-ignore` scattered across **20 different files**.
- The codebase consistently suppresses type errors rather than fixing them.
- Example offenders:
  - `src/domains/board/UniboardStore.ts`
  - `src/domains/dashboard2/widget/widget-display.svelte`
  - `src/domains/analytics/Pivot-table/ScatterRenderer.svelte`

**Linting Infrastructure Issues:**
- `eslint` and `eslint-plugin-svelte3` are installed, but the ESLint configuration is broken or incompatible with the current ESLint version (10.0.2).
- Attempting to run `npx eslint src` throws: `ESLint couldn't find an eslint.config.(js|mjs|cjs) file.`
- Attempting to run `npx eslint --config .eslintrc.js src` throws an error about using the `"env"` key, which is unsupported in the current ESLint flat config system.
- Code also frequently suppresses ESLint rules inline:
  - There are over **10** `eslint-disable` or `eslint-disable-next-line` comments, particularly around `no-magic-numbers` in the `Pivot-table` component suite.


## 4. Dependencies, Build, and Code Quality
The build process succeeds, but emits significant warnings and suffers from an unstable initial package setup.

**Dependency Conflicts:**
- `npm install` initially fails with an `ERESOLVE` dependency conflict for `@rgossiaux/svelte-headlessui@1.0.2` and `svelte@4.1.2`, requiring the `--legacy-peer-deps` flag to circumvent peer dependency issues.
- Running `npm ls` reveals a massive list of **UNMET DEPENDENCIES**.
- `npm audit` reports **48 vulnerabilities** (10 low, 16 moderate, 17 high, 5 critical).

**Build Warnings:**
- The Vite plugin for Svelte (`vite-plugin-svelte`) throws a massive number of warnings (over 20 instances) related to:
  - **Unused export properties:** Warning to consider `export const` for unused properties (e.g., `closeEvent` in `Capture_addon_menu_controller`, `date` in `Tiny_trackable`).
  - **A11y Violations:** Serious accessibility issues including:
    - Missing ARIA roles on `div` and `span` tags with click handlers.
    - Missing `keydown`/`keyup`/`keypress` handlers alongside `click` events (making interactions non-accessible).
    - `autocomplete="false"` is not valid on text inputs.
    - Missing `tabindex` on elements acting as buttons.
  - **Unused CSS Selectors:** Dozens of unused CSS blocks inside components (e.g., `#first`, `#second` in `widget-pointer.svelte`).
- The production build size creates an asset file (`index-8860a768.js`) of 6.86 MB (2.06 MB gzipped), triggering Vite's "larger than 500 kBs" chunk warning and blocking it from being precached.


## 5. Pending Tasks (TODOs)
A major indicator of hidden debt is the sheer volume of "TODO" comments embedded in the active codebase.

There are at least **31 "TODO" comments** spread across the application, many of which identify architectural debt or incomplete features:
- **`src/domains/ledger/LedgerStore.ts`**: "Move a lot of this to modules that can be easily tested" and "make this dry enough to put in its own ledgerTools function".
- **`src/components/charts/pie.svelte`**: "Make the pie chart work".
- **`src/modules/export/csv.ts`**: "Make this output notes" and "See why end date is not working in query".
- **`src/routes/track.svelte`**: "look what happens if these do not match up".
- **`src/domains/board/UniboardStore.ts`**: "Handle Sorting".
- **`src/domains/stats2/Stats2Store.ts`**: "Make this less if else and based on the Stats2TimeTypes".
- **`src/domains/dashboard2/widget/widget-class.ts`**: "Make sure this doesn't screw anything up".

These notes signal both incomplete feature implementations and explicit known issues that have not been remediated.
