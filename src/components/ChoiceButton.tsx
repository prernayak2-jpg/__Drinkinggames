import type { ButtonHTMLAttributes } from 'react'

type ChoiceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'choice' | 'primary'
}

const variants = {
  // A wooden tile, like the "Who are you here with?" cards
  choice:
    'rounded-xl border-t-[6px] border-mustard bg-wood font-display text-xl text-cream shadow-md shadow-black/40 hover:brightness-110',
  // The mustard sign-style button: outer mustard frame, thin dark inner line
  primary:
    'rounded-xl border-[3px] border-ink bg-mustard font-display text-2xl tracking-[0.12em] text-ink uppercase ring-[3px] ring-mustard hover:brightness-105 disabled:bg-[#6b5a3c] disabled:text-ink/70 disabled:ring-[#6b5a3c]',
}

export function ChoiceButton({ variant = 'choice', className = '', ...props }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-14 px-4 py-3 transition active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
