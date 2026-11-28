## Why

Phone task lists hide their tab labels as the user scrolls down (#2215). The floating Add task button disappears with the labels. Keeping the full bar visible gives the user stable targets for navigation and capture.

## What changes

- Keep the full tab bar and Add task in place while scrolling on phone task screens that already offer Add task.
- Keep the tab labels visible and use the existing Quick Add sheet.
- Preserve the current collapse behaviour on Notes and screens without Add task.

This follows up the shipped `phone-modern-look` change. No new roadmap entry, dependency, or preference is needed.
