# phone-ui Specification

## Purpose
Defines the screens a phone shows below 768 px: screens designed for a phone, drawing on the same hooks as the desktop ones, with every function of the web app; what they show beyond the desktop list (Today at a glance, Upcoming's week) and how they look.

## Requirements

### Requirement: Today at a glance
Below 768 px, Today in the phone UI SHALL show up to three tiles under its title and above its list: Done today, a ring of the tasks completed today out of those and the day's open tasks; Up next, the first open task of today at a time still ahead, or when none is, the day's first open task without a time; and Late, the number of tasks from earlier days. Tapping Up next SHALL open that task's page; tapping Late SHALL scroll the list to the Earlier group. A tile with nothing to show SHALL be left out, and on a day with no task and nothing late there SHALL be no tiles. The tiles SHALL count only what Today lists and the tasks completed today, so they agree with the list, also while Done today is hidden. Presentation only: no tile writes anything.

#### Scenario: A day in progress
- **WHEN** Today lists three tasks at 11:00, 14:00 and 18:00 and one from yesterday, one task was completed this morning, and it is 12:30
- **THEN** Done today reads 1 of 4 with its ring a quarter full, Up next shows the 14:00 task, and Late reads 1

#### Scenario: The evening
- **WHEN** every timed task of the day is past and one task of the day has no time
- **THEN** Up next shows the task without a time

#### Scenario: Late goes to the late tasks
- **WHEN** the user taps Late
- **THEN** the list scrolls to the Earlier group

#### Scenario: An empty day
- **WHEN** Today has no task and nothing is late
- **THEN** no tile is shown

### Requirement: Upcoming's week
Below 768 px, Upcoming in the phone UI SHALL show the next seven days, from tomorrow, as a row of day pills under its title, each with its short weekday, its date and one dot per task up to three. A day with tasks SHALL scroll the list to that day's group when tapped; a day without SHALL be shown without a card and SHALL NOT be offered. Each day's name for assistive technology SHALL start with its visible weekday and date and end with its number of tasks. The counts SHALL be the day groups Upcoming lists.

#### Scenario: A busy tomorrow
- **WHEN** Upcoming lists five tasks tomorrow and one on the third day
- **THEN** tomorrow's pill shows three dots, the third day's one, the other five days none and they cannot be chosen, and tapping tomorrow scrolls to Tomorrow

### Requirement: The look of the phone lists
Below 768 px every phone list SHALL draw a soft light of the accent behind its title that fades before the first rows, and its bar at the top SHALL be clear until the title has scrolled away and then frosted with its hairline. A card of phone rows, a tile, the task page's cards and the date sheet's groups SHALL have the phone card radius (16 px). On the task page the fields without a value SHALL be a grid of tiles, three to a row, each with its icon over its name, opening the same sheets as before. The light SHALL NOT print. Presentation only.

#### Scenario: The title in the light
- **WHEN** Today is open at the top on a phone, in the light or the dark theme
- **THEN** a wash of the accent shows behind the title and is gone before the first group, and the bar at the top has no hairline

#### Scenario: Scrolled away
- **WHEN** the user scrolls Today until its title has left the screen
- **THEN** the bar at the top shows the title over a frosted canvas with its hairline, and the rows never show through it

#### Scenario: Fields to add
- **WHEN** a task with only a date and a project is open on a 360 px phone
- **THEN** Start, Deadline, Reminder and the other fields without a value are tiles three to a row, each opening its sheet when tapped

### Requirement: What a task could have, as chips
On a phone the facts a task does not have yet SHALL show under its cards as one wrapping row of small chips, each the fact's icon and name, rather than as a grid of tiles; a tap SHALL open the fact's sheet as a tile did. While the person may change the task, the row SHALL end with an Attach chip that opens the attach choices (files, a link), in place of the paperclip under the note. A fact that gets a value SHALL leave the chips and join the cards.

#### Scenario: A task with only a date
- **WHEN** the person opens a task that has only a date on a 390 px phone
- **THEN** under the date's card one row of chips offers the other facts and Attach, two or three chips to a line, and no paperclip shows under the note

#### Scenario: Add a deadline
- **WHEN** the person taps the Deadline chip and picks Friday
- **THEN** Deadline leaves the chips and shows as a row in the cards with Friday

### Requirement: The task page's bar
On a phone the task page's bar SHALL hold Back, named by the list the task was opened from, and the task's menu, and no other control. When the task was opened from a list, the menu SHALL start with Next task and Previous task, each carrying the task's place in the list ("4 of 10") and disabled at the list's end; `j` and `k` SHALL step as before.

#### Scenario: Step from the menu
- **WHEN** the person opens the fourth of ten tasks of Today on a phone, opens the menu and chooses Next task
- **THEN** the fifth task's page shows in place, and its menu says "5 of 10"

### Requirement: A calm Today on a phone
On a phone Today's header SHALL show the menu button and one menu, with the list's display options as an item of that menu that opens them as a sheet; every list with display options SHALL do the same. Today's briefing SHALL leave out the late tasks while the Late card says them, and SHALL show nothing when that was all it had to say. The Earlier group's header SHALL offer one Reschedule control whose choices are Today, Tomorrow, Next week and Pick a date, the same writes with Undo as before. Where Today shows its Done today group, the Done today card SHALL, once a task was completed today, open that group and bring it into view. A task due yesterday SHALL say Yesterday in its row, with its time when it has one.

#### Scenario: Today with only late tasks to mention
- **WHEN** three tasks are late and nothing else stands out, and Today opens on a phone
- **THEN** the Late card shows 3, no briefing line shows, and the header shows the menu button and one menu

#### Scenario: Reschedule the late tasks
- **WHEN** the person taps Reschedule in the Earlier group's header and chooses Today
- **THEN** every task of the group moves to today and a toast offers Undo

#### Scenario: Yesterday's task
- **WHEN** a task was due yesterday at 09:30 and Today opens on a phone
- **THEN** its row says "Yesterday 09:30" in the danger tone
