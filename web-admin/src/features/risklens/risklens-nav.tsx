import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight, ShieldAlert } from 'lucide-react'
import { logOut } from '@/lib/demo-auth'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assess', label: 'Assess' },
  { to: '/assistant', label: 'Assistant' },
]

export function RiskLensNav() {
  const navigate = useNavigate()

  const out = () => {
    logOut()
    navigate({ to: '/' })
  }

  return (
    <div className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='mx-auto flex h-20 max-w-6xl items-center justify-between px-4'>
        <Link
          to='/dashboard'
          className='flex items-center gap-2 text-xl font-bold'
        >
          <span className='bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-lg'>
            <ShieldAlert className='h-5 w-5' />
          </span>
          RiskLens
        </Link>
        <nav className='bg-muted/40 flex gap-1 rounded-full border p-1'>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className='text-muted-foreground rounded-full px-5 py-2 text-sm font-medium transition-colors'
              activeProps={{ className: 'bg-background text-foreground' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-4'>
          <button
            onClick={out}
            className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          >
            Log out
          </button>
          <Link
            to='/assess'
            className='bg-foreground text-background flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-medium transition-transform hover:scale-105 active:scale-95'
          >
            Assess now
            <span className='bg-background text-foreground flex h-8 w-8 items-center justify-center rounded-full'>
              <ArrowUpRight className='h-4 w-4' />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}