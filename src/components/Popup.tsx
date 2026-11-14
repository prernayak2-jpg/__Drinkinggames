import type { ReactNode } from 'react'
import { ChoiceButton } from './ChoiceButton'

/** A pop-up that stays on screen until someone taps OK. */
export function Popup({ children, onOk }: { children: ReactNode; onOk: () => void }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true">
      <div className="animate-rule-pop w-full max-w-sm rounded-3xl border-2 border-neon-pink bg-ink p-6 text-center shadow-[0_0_30px_rgba(255,61,127,0.6)]">
        {children}
        <ChoiceButton variant="primary" className="mt-6 w-full" autoFocus onClick={onOk}>
          OK
        </ChoiceButton>
      </div>
    </div>
  )
}
