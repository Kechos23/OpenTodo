// The quick add stays reachable in long lists (OpenSpec change add-position, design
// D4): from 768 px, where no floating Add button is shown, the list page's quick add
// row sticks right under the sticky page header and the rows scroll under it. Below
// 768 px it scrolls with the list as before. On a phone held in landscape (coarse
// pointer, under 500 px tall) the pinned row would cover the top of the list, so the
// `pins` variant leaves it unstuck there too; revealRow reads the computed position,
// so it stops counting the row as soon as it no longer sticks.
// No scroll padding on the scroller: the browser would read the stuck field itself
// as covered and scroll the list back up each time the field takes focus.
import { type RefObject, useEffect } from 'react'
import { pinnedBottom, revealRow, scrollParent } from './revealRow'
import { type BelowHeader, useBelowStickyHeader } from '../bulk/useBelowStickyHeader'

/**
 * The classes that make the wrapper stick from 768 px, except on a landscape phone (the
 * `pins` variant), on the page surface. The row keeps its box (the
 * page's left edge and spacing do not move); a pseudo-element paints the surface into the
 * page gutters so rows never show beside it.
 */
export const STICKY_QUICK_ADD = 'pins:sticky pins:z-9 pins:bg-surface pins:before:pointer-events-none pins:before:absolute pins:before:bottom-0 pins:before:-top-(--below-head-gap) pins:before:-inset-x-8 pins:before:-z-10 pins:before:bg-surface'

/** Where the sticky quick add sticks: just below the sticky page header, where it rests. */
export function useStickyQuickAdd(el: RefObject<HTMLElement | null>, active: boolean): BelowHeader {
  const offset = useBelowStickyHeader(el, active)
  useEffect(() => {
    const row = el.current
    const scroller = row?.closest<HTMLElement>('[data-main-scroller]')
    if (!active || !row || !scroller) return
    // A wrapping draft grows the sticky row. Scroll anchoring would keep a task
    // below it in place and could pull the focused title back under the header.
    const start = () => { scroller.dataset.quickAddFocused = '' }
    const stop = () => { delete scroller.dataset.quickAddFocused }
    const blur = (ev: FocusEvent) => { if (!row.contains(ev.relatedTarget as Node | null)) stop() }
    row.addEventListener('focusin', start)
    row.addEventListener('focusout', blur)
    if (row.contains(document.activeElement)) start()
    return () => {
      row.removeEventListener('focusin', start)
      row.removeEventListener('focusout', blur)
      stop()
    }
  }, [el, active])
  return offset
}

/** Reveal the title before focusing it, without asking the browser to scroll again. */
export function focusQuickAdd(input: HTMLTextAreaElement): void {
  const scroller = scrollParent(input)
  const header = input.closest('[data-page-body]')?.querySelector<HTMLElement>('[data-page-header]')
  const box = input.getBoundingClientRect()
  const headerBox = header?.getBoundingClientRect()
  const pinned = header && getComputedStyle(header)
  if (scroller && headerBox && pinned?.position === 'sticky' && box.top < headerBox.bottom) {
    // At the end of a list, both sticky elements can travel together until the
    // header reaches its resting position. Clear that position, not just its current edge.
    const top = Number.parseFloat(pinned.top) || 0
    const restingBottom = scroller.getBoundingClientRect().top + top + headerBox.height
    scroller.scrollTop -= Math.max(headerBox.bottom, restingBottom) - box.top + 4
  } else if (!scroller || box.top < pinnedBottom(scroller, input) || box.bottom > scroller.getBoundingClientRect().bottom) {
    revealRow(input)
  }
  input.focus({ preventScroll: true })
}
