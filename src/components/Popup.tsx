import type { ReactNode } from 'react'
import { BottleLamp } from './BottleLamp'
import { ChoiceButton } from './ChoiceButton'

/** A pop-up card that stays on screen until someone taps the button. */
export function Popup({ children, onOk, okLabel = 'Bottoms up' }: { children: ReactNode; onOk: () => void; okLabel?: string }) {
  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center overflow-y-auto bg-black/85 p-5" role="dialog" aria-modal="true">
      <BottleLamp cord={24} cone className="[@media(max-height:720px)]:hidden" />
      <div className="animate-rule-pop relative w-full max-w-sm rounded-2xl border-[5px] border-brick bg-cream p-1.5 text-center text-ink shadow-2xl shadow-black">
        <div className="rounded-xl border-2 border-brick px-5 pt-5 pb-6">
          <div className="trim mx-auto mb-4 w-4/5" />
          {children}
          <ChoiceButton
            variant="primary"
            className="mt-6 w-full ring-ink!"
            autoFocus
            onClick={onOk}
          >
            {okLabel}
          </ChoiceButton>
        </div>
      </div>
    </div>
  )
}
