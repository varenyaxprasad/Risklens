import { useRef } from 'react'
import { cn } from '@/lib/utils'

type SpotlightCardProps = {
  children: React.ReactNode
  className?: string
}

export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        'group bg-card relative overflow-hidden rounded-xl border transition-transform duration-300 hover:-translate-y-1',
        className
      )}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
        style={{
          background:
            'radial-gradient(320px circle at var(--x) var(--y), rgba(52,211,153,0.16), transparent 60%)',
        }}
      />
      <div className='relative'>{children}</div>
    </div>
  )
}