# Tasks

## 1. Backspace

- [x] 1.1 `chipAtCaret` (`web/src/lib/nlp/quickadd.ts`) returns no chip for an attribute token or a link the caret touches. Verify: `quickadd.test.ts` "leaves a token the caret still touches to Backspace" and `quickAdd.test.tsx` "Backspace while typing a token" pass, and fail without the change; `quickAddLinks.test.tsx` covers a link being typed and the two presses after a space.
- [x] 1.2 `docs/quick-add.md` and `changelog.d/Fixed/backspace-edits-typed-token.md`. Verify: `make docs` and `make docs-check`.
