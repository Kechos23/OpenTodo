## MODIFIED Requirements

### Requirement: Dismiss and escape parsed tokens
The user SHALL be able to reject an interpretation: activating a chip's dismiss control, or pressing Backspace when the caret is at the end of the line and the last chip is highlighted, SHALL keep that text literally in the title and SHALL suppress re-parsing of that span until the span's text changes. While the caret directly follows an attribute token (`#project`, `@label`, `p1`–`p4`, `+duration`, `spent/estimate`, `~energy`) or a link (`https://…`) with no whitespace after it, the token is being typed: Backspace SHALL delete a character and SHALL neither highlight nor dismiss its chip. Text inside double quotes SHALL never be parsed, and the quotes SHALL be removed from the saved title.

#### Scenario: Dismiss a false positive
- **WHEN** the user types `Review "may" report`, or types `Review may report` and dismisses the due chip for May
- **THEN** the title is `Review may report` and the task has no due date

#### Scenario: Dismissal survives further typing
- **WHEN** the user dismissed the due chip for `may` and keeps typing `... with Ana`
- **THEN** no due chip reappears for `may`

#### Scenario: Keyboard dismissal
- **WHEN** the caret is at the end of the line, after a phrase or a space, and the user presses Backspace twice
- **THEN** the first press highlights the last chip and the second press dismisses it, leaving the text unchanged

#### Scenario: Backspace while typing a token
- **WHEN** a label "errand" exists, the user types `Buy milk @err` with the caret at the end and presses Backspace
- **THEN** the line reads `Buy milk @er` and no chip is highlighted; the same holds after `#Home`, `+30m`, `p1` and `Read https://example.com/pa`

#### Scenario: A finished token is dismissed as before
- **WHEN** the user types `Buy milk @errand ` (with the space) and presses Backspace twice
- **THEN** the first press highlights the label chip and the second dismisses it, leaving the text unchanged

### Requirement: Links in quick add
In every quick add (the list's line, the phone's sheet, the capture screen, the command bar's Add mode and each line of a multi-line paste), a whitespace-separated token that starts with `http://` or `https://` and names a host SHALL be recognised as a link token, on by default: tinted in the field, previewed as a dismissible chip reading its host without `www.`, and on save written as a link attachment of the new task, named after its host, and removed from the title. Trailing `.`, `,`, `;`, `:`, `!`, `?` and an unbalanced closing bracket SHALL not be part of the URL and SHALL leave the title with it. Dismissal, double quotes and the per-device parsing switch SHALL apply as to every token. At most five links per line SHALL become attachments, and the others SHALL stay in the title. A line whose title would otherwise be empty SHALL keep the URL as its title with no chip. A link equal to the task's origin URL, or one the task already has, SHALL not be attached again, and the links SHALL be listed in the order typed. A line with a link SHALL never reuse an item of a reusable list. On a device with no signed-in account yet, links SHALL not be read, so they stay in the title where they were typed. The task and its link attachments SHALL be written as one local operation set, visible at once, uploaded together and converging like any attachment; one Undo SHALL remove them all. The task panel's title field and the inline title editor SHALL read links typed during the current edit the same way and, on commit, attach them to the edited task in the same undoable change; text that was in the title when the edit began SHALL never be read. Routines SHALL not parse links. `POST /api/v1/quick-add/parse` SHALL report the links as `fields.links` (the URLs in line order) with chips of kind `link` reading the host, and `ot add` SHALL attach them like the app (named after the host, compared with the scheme and host case, a default port and an empty path normalised), matching the shared quick-add vectors; with an agent token, which may not attach, `ot add` SHALL keep them in the title.

#### Scenario: A link becomes an attachment
- **WHEN** the user enters `Review the mockup https://example.com/mockup tomorrow` in Today's quick add
- **THEN** a task "Review the mockup" due tomorrow is created with one link attachment to `https://example.com/mockup` named "example.com", and a chip read `example.com` before saving

#### Scenario: Dismissed link stays in the title
- **WHEN** the user dismisses the link chip, or types `Read https://example.com/post ` (with the space) and presses Backspace twice at the end of the line
- **THEN** the task is titled `Read https://example.com/post` and has no attachment

#### Scenario: Quoted link is text
- **WHEN** the user enters `Note "https://example.com" for later`
- **THEN** the title is `Note https://example.com for later` and no attachment is created

#### Scenario: Sentence punctuation
- **WHEN** the user enters `Read the spec at https://example.com/a(b).`
- **THEN** the attachment's URL is `https://example.com/a(b)` and the title is `Read the spec at`

#### Scenario: Offline
- **WHEN** the device is offline and the user enters `Book https://example.com/hotel #Trip`
- **THEN** the task appears in Trip with its link attachment at once, both survive a reload, and both upload in the next successful sync

#### Scenario: Only a link
- **WHEN** the user enters `https://example.com/article`
- **THEN** no chip is shown and the task is titled `https://example.com/article` with no attachment

#### Scenario: Other schemes
- **WHEN** the user enters `Open javascript:alert(1) ftp://example.com/f`
- **THEN** no link chip is shown and the whole line is the title

#### Scenario: A link typed while editing a title
- **WHEN** a task is titled "Call the bank" and the user appends ` https://bank.example/contact` in the panel title and presses Enter
- **THEN** the title is "Call the bank", the task has a link attachment to `https://bank.example/contact`, and one Undo removes both changes

#### Scenario: A link already in the title stays
- **WHEN** a task is titled "Read https://example.com/post" and the user appends ` today` in the panel title and commits
- **THEN** the title is "Read https://example.com/post", the task is due today and has no new attachment

#### Scenario: A routine keeps its URL
- **WHEN** a routine creates a task from the line `Pay https://bank.example/bill`
- **THEN** the task is titled `Pay https://bank.example/bill` and has no attachment
