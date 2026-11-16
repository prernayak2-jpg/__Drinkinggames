import type { ReactNode } from 'react'

type SceneLayoutProps = {
  /** The background illustration */
  scene: ReactNode
  children: ReactNode
  /** Fade the art into the dark floor so text stays readable (default on) */
  fade?: boolean
  /**
   * On laptop-width screens, put the illustration in its own column on the left
   * and the content beside it, instead of stacking content over the art.
   */
  split?: boolean
}

/**
 * One screen of the bar. On phones: illustration behind, content anchored to the bottom.
 * On laptops: either the same backdrop with a wider centred column, or (split) art left, content right.
 */
export function SceneLayout({ scene, children, fade = true, split = false }: SceneLayoutProps) {
  return (
    <div className={`animate-scene-in relative h-dvh overflow-hidden bg-ink ${split ? 'lg:grid lg:grid-cols-2' : ''}`}>
      <div className={`absolute inset-0 overflow-hidden ${split ? 'lg:relative' : ''}`} aria-hidden="true">
        {/* In the split view the art is taller than its column so the empty floor is cropped off */}
        <div className={`absolute inset-x-0 top-0 h-full ${split ? 'lg:h-[135%]' : ''}`}>{scene}</div>
        {split && <div className="absolute inset-y-0 right-0 hidden w-32 bg-linear-to-l from-ink to-transparent lg:block" />}
      </div>
      {fade && (
        <div
          className={`absolute inset-0 bg-linear-to-t from-ink via-ink/60 via-35% to-transparent to-60% ${split ? 'lg:hidden' : ''}`}
        />
      )}
      <main
        className={`relative mx-auto flex h-full w-full max-w-md flex-col gap-5 overflow-y-auto px-6 pt-[max(7rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] [&>*:first-child]:mt-auto ${
          split ? 'lg:max-w-lg lg:px-12 lg:pt-12 lg:[&>*:first-child]:mt-auto lg:[&>*:last-child]:mb-auto' : 'lg:max-w-lg'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
