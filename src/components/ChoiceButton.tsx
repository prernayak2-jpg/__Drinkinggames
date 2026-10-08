import type { ButtonHTMLAttributes } from 'react'

type ChoiceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'choice' | 'primary'
}

const variants = {
  choice:
    'border-2 border-neon-teal/70 bg-black/60 text-white shadow-[0_0_14px_rgba(45,226,230,0.35)] backdrop-blur-sm hover:bg-neon-teal/20',
  primary:
    'bg-neon-pink text-ink shadow-[0_0_20px_rgba(255,61,127,0.6)] hover:brightness-110 disabled:bg-zinc-600 disabled:text-zinc-300 disabled:shadow-none',
}

export function ChoiceButton({ variant = 'choice', className = '', ...props }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-14 rounded-2xl px-4 py-3 font-sign text-xl transition active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
