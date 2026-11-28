## Decisions

Start on the first tab, away from the screen edge. The small marker is decorative and adds no tap target. Use the existing touch direction lock and release thresholds, including the mirrored direction in right-to-left layouts. A pointer that travels vertically or cancels leaves the drawer closed. A horizontal swipe that takes the gesture cancels the tab's hold and suppresses the click on release. A tap or a stationary hold still belongs to its tab.

Use the existing bar state and the time of the last scroll in the content pane. The same 600 ms quiet interval as the bar's idle restore guards the swipe, even when an upward scroll restores the bar early or when reduced motion keeps it full. An attempt started during scrolling does not become eligible while the finger stays down. Opening the existing drawer reuses its focus and dismiss behaviour. The top menu button is the click and keyboard alternative.

A full-width gesture would put every tab and more of the system edge in play. A dedicated button would reduce the room available to the existing tabs. The first-tab region keeps the target local without a new control, shortcut, row of chrome, property, destination or scroll region. This adds no persistent data, API, dependency or runtime service.
