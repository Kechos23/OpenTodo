// Avatar (OpenSpec change ui-primitives, design D8): initials on a palette hue
// derived from the account id, so a person has the same colour everywhere. With
// a picture (settings-refresh D10) the image covers the initials in the same
// circle; while it loads, offline or when it fails, the initials show.
import { useState } from 'react'
import { HUE_NAMES } from './tokens/pairs'
import type { HueName } from './tokens/palette'

/** Initials for a name or email: first letters of the first two words. */
export function initials(name: string): string {
  const parts = name.trim().split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[1][0] : '')).toUpperCase()
}

/** FNV-1a 32-bit hash of the account id, mapped onto the 12 palette hues. */
export function avatarHue(accountId: string): HueName {
  let h = 0x811c9dc5
  for (let i = 0; i < accountId.length; i++) {
    h ^= accountId.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return HUE_NAMES[h % HUE_NAMES.length]
}

const SIZES = { xs: 'h-4 w-4 text-[9px]', sm: 'h-6 w-6 text-hint', md: 'h-8 w-8 text-meta', lg: 'h-10 w-10 text-meta' } as const // style-lint-allow: initials inside a 20 px circle

export interface AvatarProps {
  id: string
  name: string
  size?: keyof typeof SIZES
  /** Decorative next to a visible name (default); otherwise the name is announced. */
  decorative?: boolean
  /** The profile picture's address; the initials stay underneath as the fallback. */
  src?: string
  className?: string
}

export function Avatar({ id, name, size = 'sm', decorative = true, src, className }: AvatarProps) {
  const [failed, setFailed] = useState<string | null>(null)
  const picture = src && failed !== src ? src : undefined
  return (
    <span
      data-hue={avatarHue(id)}
      data-avatar-picture={picture ? true : undefined}
      className={`relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-hue-soft font-semibold text-hue before:content-[attr(data-initials)] ${SIZES[size]}${className ? ` ${className}` : ''}`}
      {...(decorative ? { 'aria-hidden': true, 'data-initials': initials(name) } : { role: 'img', 'aria-label': name })}
    >
      {/* Decorative initials are drawn, not text: a control named by its person ("Account menu for Ada Lovelace")
          then holds no visible text its name leaves out (WCAG 2.5.3, the sidebar's rail). */}
      {decorative ? null : initials(name)}
      {picture && <img src={picture} alt="" draggable={false} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(picture)} />}
    </span>
  )
}
