## ADDED Requirements

### Requirement: Reveal the inline Quick Add field before typing

When the user presses `q` or activates **Add task** from the desktop sidebar on a view with an inline Quick Add field, the app SHALL reveal the field in its list pane, clear of sticky headers, and focus it for immediate typing. If the field is already fully visible, the list SHALL keep its scroll position. This interaction SHALL work offline and SHALL write no task data until submission.

#### Scenario: A sticky header covers Quick Add

- **WHEN** the user invokes Quick Add from a scrolled Today, Upcoming or project List view and the list header covers any part of the title field
- **THEN** the title field becomes fully visible in that view, receives keyboard focus, and stays clear of the header while the draft grows

#### Scenario: Quick Add is already in sight

- **WHEN** the user invokes Quick Add while its title field is already fully visible
- **THEN** the field receives focus and the list remains at the same scroll position
