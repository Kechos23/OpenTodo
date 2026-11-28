// @vitest-environment happy-dom
// Add task in the sidebar (OpenSpec change add-task-button D1, issue #1936): from 768 px,
// a labelled button above the destinations that runs what `q` runs: the list's quick add
// with the view's defaults, else the command bar in Add mode.
import 'fake-indexeddb/auto'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../lib/db'
import { addDaysISO, todayISO } from '../lib/dates'
import { createLabel } from '../lib/labels'
import { createProject, resetDeviceId } from '../lib/ops'
import type { User } from '../lib/types'
import { click, key, minWidthPx, render, type, waitFor } from '../ui/test-utils'
import { navigate, type Route } from './router'
import { Shell } from './Shell'
import { setShortcutHints } from './shortcuts'

const user = { id: 'u1', email: 'a@example.com', name: 'Ada', role: 'owner', created_at: 0 } as unknown as User
const original = window.matchMedia

function viewport(width: number) {
  window.matchMedia = ((q: string) => ({
    matches: q.includes('pointer: fine') || minWidthPx(q) <= width, media: q, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

beforeEach(async () => {
  await db.delete()
  await db.open()
  resetDeviceId()
  viewport(1280)
  setShortcutHints(false)
  vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 404 })))
})
afterEach(() => { window.matchMedia = original; setShortcutHints(false); vi.unstubAllGlobals() })

const button = () => document.querySelector<HTMLButtonElement>('[data-add-task-button]')
const listField = () => document.querySelector<HTMLTextAreaElement>('[data-quick-add-row] textarea')
const barField = () => document.querySelector<HTMLTextAreaElement>('[data-quick-add-layout="palette"] textarea')

/** Clicks Add task in `route`, types `title` where the focus lands and adds it; returns the saved task. */
async function addFrom(route: Route, title: string) {
  navigate(route)
  const r = await render(<Shell user={user} onLogout={() => {}} />)
  await waitFor(() => !!button() && !!listField(), 'the button and the list quick add')
  await click(button()!)
  await waitFor(() => document.activeElement === listField(), 'the list quick add focused')
  await type(listField()!, title)
  await act(async () => { listField()!.form!.requestSubmit() })
  const find = async () => (await db.tasks.toArray()).find((t) => t.title === title)
  await waitFor(async () => !!(await find()), 'the task')
  const task = (await find())!
  await r.unmount()
  return task
}

describe('Add task in the sidebar', () => {
  it.each(['q', 'sidebar'] as const)('reveals the field behind a sticky header via %s', async (entry) => {
    navigate({ view: 'today' })
    const r = await render(<Shell user={user} onLogout={() => {}} />)
    try {
      await waitFor(() => !!button() && !!listField())
      const input = listField()!
      const scroller = input.closest<HTMLElement>('[data-main-scroller]')!
      const header = input.closest('[data-page-body]')!.querySelector<HTMLElement>('[data-page-header]')!
      // happy-dom has no layout. Give the scroll pane and its pinned header stable geometry.
      scroller.style.overflowY = 'auto'
      Object.defineProperty(scroller, 'scrollHeight', { value: 900 })
      Object.defineProperty(scroller, 'clientHeight', { value: 500 })
      scroller.getBoundingClientRect = () => new DOMRect(0, 0, 600, 500)
      header.style.position = 'sticky'
      header.getBoundingClientRect = () => new DOMRect(0, 0, 600, 100)
      input.getBoundingClientRect = () => new DOMRect(20, 320 - scroller.scrollTop, 560, 40)
      const activate = () => entry === 'q' ? key(document.body, 'q', { code: 'KeyQ' }) : click(button()!)

      scroller.scrollTop = 250
      await activate()
      expect(document.activeElement).toBe(input)
      expect(input.getBoundingClientRect().top).toBeGreaterThanOrEqual(100)
      expect(scroller.scrollTop).toBeGreaterThan(0)

      input.blur()
      // Already visible, even with only one pixel below the header.
      scroller.scrollTop = 219
      await activate()
      expect(document.activeElement).toBe(input)
      expect(scroller.scrollTop).toBe(219)
    } finally {
      await r.unmount()
    }
  })


  it('Today: the list quick add, and the task is due today', async () => {
    const task = await addFrom({ view: 'today' }, 'Water the plants')
    expect(task.due?.date).toBe(todayISO())
  })

  it('Upcoming: the task is due tomorrow', async () => {
    const task = await addFrom({ view: 'upcoming' }, 'Book the car')
    expect(task.due?.date).toBe(addDaysISO(todayISO(), 1))
  })

  it('a project: the task lands in it', async () => {
    const pid = await createProject({ name: 'Work' })
    const task = await addFrom({ view: 'project', id: pid }, 'Draft agenda')
    expect(task.project_id).toBe(pid)
  })

  it('a label: the task carries it', async () => {
    const lid = await createLabel({ name: 'errands' })
    const task = await addFrom({ view: 'label', id: lid }, 'Post the parcel')
    expect(task.labels).toEqual([lid])
  })

  it('a screen without a quick add opens the command bar in Add mode; the task goes to the Inbox', async () => {
    navigate({ view: 'trash' })
    const r = await render(<Shell user={user} onLogout={() => {}} />)
    await waitFor(() => !!button(), 'the button')
    await click(button()!)
    await waitFor(() => !!barField() && document.activeElement === barField(), 'the bar in Add mode, focused')
    await type(barField()!, 'Renew the passport')
    await act(async () => { barField()!.form!.requestSubmit() })
    await waitFor(async () => (await db.tasks.count()) === 1, 'the task')
    const [task] = await db.tasks.toArray()
    expect([task.title, task.project_id ?? null, task.due ?? null]).toEqual(['Renew the passport', null, null])
    await r.unmount()
  })

  it('is a named button with the `q` key, printed only while shortcut hints are on', async () => {
    navigate({ view: 'inbox' })
    const r = await render(<Shell user={user} onLogout={() => {}} />)
    await waitFor(() => !!button(), 'the button')
    expect(button()!.tagName).toBe('BUTTON')
    expect(button()!.textContent).toContain('Add task')
    expect(button()!.getAttribute('aria-keyshortcuts')).toBe('q')
    expect(button()!.querySelector('[data-go-hint]')).toBeNull()
    // Above the primary destinations.
    const inbox = document.querySelector('[data-destination="inbox"]')!
    expect(button()!.compareDocumentPosition(inbox) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await act(async () => { setShortcutHints(true) })
    await waitFor(() => button()!.querySelector('[data-go-hint]')?.textContent === 'q', 'the q hint')
    await r.unmount()
  })

  it('the phone drawer has no Add task: the add button is the way to add there', async () => {
    viewport(390)
    navigate({ view: 'inbox' })
    const r = await render(<Shell user={user} onLogout={() => {}} />)
    await waitFor(() => !!document.querySelector('[data-add-button]'), 'the add button')
    expect(button()).toBeNull()
    await r.unmount()
  })
})
