import { BottleLamp } from '../components/BottleLamp'

/** The default backdrop: a dark room lit by one hanging bottle lamp. */
export function TableScene({ label = '#b8201c' }: { label?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <BottleLamp label={label} cone cord={36} className="mx-auto" />
    </div>
  )
}
