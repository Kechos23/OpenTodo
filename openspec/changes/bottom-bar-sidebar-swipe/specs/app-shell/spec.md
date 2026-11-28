## ADDED Requirements

### Requirement: Open the phone drawer from the Android tab bar

On an Android phone, while the full bottom tab bar is shown and the content has been idle for at least 600 ms, a deliberate horizontal touch swipe starting within the first tab and at least 32 CSS px from the start edge of the viewport SHALL open the sidebar on release. The start SHALL be indicated visually and the swipe SHALL travel towards the inline end. A committed swipe SHALL suppress the tab click and hold. A tap or stationary hold SHALL continue to use its tab's ordinary action. The top menu button SHALL remain the one-tap and keyboard alternative. The gesture SHALL work offline and write no data.

#### Scenario: Swipe in the full bar

- **WHEN** the user swipes inward from the marked part of the first tab while the full bar and idle list are shown
- **THEN** the sidebar opens on release and the current view remains selected

#### Scenario: Scroll is still in progress

- **WHEN** a swipe starts during a vertical scroll or while the bar is minimised
- **THEN** it does not open the drawer, even if the bar returns before the finger lifts

#### Scenario: Tap, short swipe or cancel

- **WHEN** the user taps the first tab, or starts a swipe and releases short of its threshold or cancels it
- **THEN** a tap uses its tab action and the unfinished swipe does not open the drawer

#### Scenario: The system edge

- **WHEN** a touch starts at the viewport edge or outside the first tab
- **THEN** the new gesture does not handle it

#### Scenario: Right-to-left layout

- **WHEN** an eligible touch starts in the first tab on the right and swipes inward to the left
- **THEN** the drawer opens on release
