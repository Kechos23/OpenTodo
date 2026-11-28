## Why

Android gesture navigation can take a swipe from the screen edge as Back. The phone's top menu button opens the sidebar, but it can be hard to reach one-handed. Issue #2169 proposes opening the same drawer from the bottom tab bar.

## What Changes

- Allow an inward touch swipe starting inside the first tab of the full Android bar, after scrolling has stopped.
- Mark the start with a small handle and open the existing drawer on release. Tapping a tab retains its normal action.
- Leave the system gesture area, the floating Add task button and the existing edge gesture in their current roles.

This is a follow-up to Android edge gesture issue #1311 and the phone navigation work. There is no dedicated roadmap entry. No new preference, API route, dependency or native bridge is required.
