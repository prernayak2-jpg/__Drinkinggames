import type { ReactNode } from 'react'

type SceneLayoutProps = {
  /** The full-screen background illustration */
  scene: ReactNode
  children: ReactNode
}

/** A single no-scroll screen: illustration behind, content anchored to the bottom. */
export function SceneLayout({ scene, children }: SceneLayoutProps) {
  return (
    <div className="animate-scene-in relative h-dvh overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        {scene}
      </div>
      {/* Darken the lower half so text stays readable over the art */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      <main className="relative mx-auto flex h-full max-w-md flex-col justify-end gap-5 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  )
}
