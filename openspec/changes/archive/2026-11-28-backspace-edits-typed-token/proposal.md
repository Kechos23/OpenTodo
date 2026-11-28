# Backspace edits a token being typed

## Why

Issue #2219: in quick add, after typing `@err`, `#Home`, `+30m`, `p1` or a link, Backspace takes three presses to delete one character. The token already reads as a chip, so the keyboard dismissal ("Dismiss and escape parsed tokens") claims Backspace: the first press highlights the chip, the second dismisses it, only the third deletes. While the person is still typing the token, often with its suggestion list open, Backspace has to edit the text.

## What Changes

- With the caret right after an attribute token (`#project`, `@label`, `p1`–`p4`, `+duration`, `spent/estimate`, `~energy`) or a link and no whitespace after it, Backspace deletes a character, as in any text field. A link typed by hand (`Read https://example.com/pa`) had the same three presses.
- After a space, or after a phrase (a date, a recurrence, a reminder), the two presses still highlight and dismiss the last chip. The chip's dismiss control is unchanged.
- "Links in quick add": its Backspace scenario now ends the line with a space.

## Out of scope

- The phone sheet's layout and the suggestion lists themselves; the `#` and `@` lists keep their keys.
- Any parse, op or sync change. No ROADMAP.md item: a bug fix. No new field, route, string or environment variable.
