# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-06-11

### Added

- **Singleton.** The constructor now returns a single shared instance, so every
  `new ARIAManager(...)` call site resolves to the same manager — one set of
  event bindings, one `global-markupchange` listener, and one consistent view of
  every control on the page. No call-site changes required.
- **Opt-in `data-ariamanager-hide`.** A target with `data-ariamanager-hide="inert"`
  (or `"hidden"`) has that attribute toggled alongside `aria-hidden`, so hidden
  content also leaves the tab order. Default (no attribute) keeps the original
  aria-only behaviour.
- **SSR safety.** Construction is a no-op when there is no DOM (`typeof document
  === "undefined"`), so the module is safe to import in server-rendered builds.

### Changed

- Controller lookup (`GetARIAControllerFromTarget`) now queries the DOM live
  instead of maintaining a cached array — no stale detached nodes leaking, and
  every control targeting an id is found regardless of when it was added.
- `adjustTargetStates` computes the next visible state once before mutating, so
  the `aria-hidden` and `aria-expanded` writes can no longer disagree.

### Internal

- Added `publint` + `@arethetypeswrong/cli` checks (`npm run check:exports`,
  enforced on publish via `prepublishOnly`), `sideEffects: false`, and an
  `engines.node` field.
- Added vitest + jsdom tests covering the singleton, toggle output, the
  `inert` opt-in, and `data-ariamanager-ignore`.

## [1.0.11] - 2026-06-11

### Fixed

- `aria-pressed` / `aria-expanded` could be written as `"falsefalse"` when the
  package was bundled by Vite 8 / rolldown, which miscompiles
  `(x === "false") + ""` into `x + "false"`. The state writes now use a ternary
  (`x === "false" ? "true" : "false"`), which compiles correctly everywhere.

[Unreleased]: https://github.com/wezz/ARIAManager/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/wezz/ARIAManager/releases/tag/v1.1.0
[1.0.11]: https://github.com/wezz/ARIAManager/releases/tag/v1.0.11
