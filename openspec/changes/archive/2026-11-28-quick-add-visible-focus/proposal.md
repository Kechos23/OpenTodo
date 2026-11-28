## Why

In long desktop lists, activating Quick Add with `q` or the sidebar's Add task button can focus the field while it is hidden behind the sticky header (#2212). The typed draft is invisible until the user scrolls manually.

## What Changes

- Reveal the inline Quick Add field inside the list when it is clipped or covered, then focus it.
- Preserve the list position when the field is already visible.
- Cover both entry points in Today, Upcoming and a project's List view.

This corrects the shipped `add-position` behaviour tracked in #540 and #541. No new roadmap item is needed. Mobile capture, task defaults, and the command-bar fallback are outside the scope.
