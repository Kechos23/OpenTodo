## Decision

Reveal the textarea through the shared list focus handler. Reuse the list's sticky-header-aware scroll logic and pass `preventScroll: true` to focus so the browser does not move the pane a second time. When the sticky header and input have both been pushed up by the end of the list, use the header's resting position. Keep the list position if it already exposes the field. Suspend the list's scroll anchoring while Quick Add has focus, so a wrapping draft cannot move its own title back under the header. The header and scroll pane come from the list's existing DOM, so the same handler works with the details panel open.

A global scroll padding rule can move an already-visible sticky field. Always jumping to the top would lose the user's place in a long list. The fix adds no new chrome, scrolling region, displayed property, destination, shortcut, data field, API or dependency.
