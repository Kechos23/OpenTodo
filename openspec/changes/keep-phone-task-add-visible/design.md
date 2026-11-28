## Decision

The shell already knows which routes offer Add task or New note. Use that to disable scroll-driven compaction on task screens with Add task. The shared scroll hook retains its existing restore rules for the other screens. The full height and width of the task bar stay constant during a scroll.

The existing safe-area insets and content padding protect the last row. The add button still uses the same Quick Add sheet. This keeps the same chrome, shortcuts, scroll regions, task properties, and destinations, with no changes to data, APIs, storage, runtime dependencies, or native code.
