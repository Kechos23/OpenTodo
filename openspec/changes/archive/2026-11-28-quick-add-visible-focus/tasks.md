## 1. Reproduction and fix

- [x] Reproduce focus behind the sticky header on upstream and cover the two desktop entry points in `addTaskButton.test.tsx`. Reveal the field via the shared focus handler.
- [x] Verify keyboard and sidebar entry in Today, Upcoming and a project List in Chromium. Verify typing and preserved scroll position for a visible field.
- [x] Add a changelog fragment and document the keyboard and sidebar behaviour. Run `make docs docs-check`, strict OpenSpec validation, `make check` and the web build.

## 2. Demo review

- [x] Review the fix in the local demo before opening a pull request.
