import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BarChart3,
  FileSearch,
  MessagesSquare,
  ShieldCheck,
} from 'lucide-react'
import { get } from '@/lib/risklens-api'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Health = { status: string; model: string }
type Status = 'checking' | 'offline' | Health

const trust = [
  { icon: BarChart3, text: 'Factor-level explanations' },
  { icon: FileSearch, text: 'Answers cite their sources' },
  { icon: ShieldCheck, text: 'Estimates, not lending decisions' },
]

const steps = [
  {
    title: '1. Enter applicant details',
    text: 'Fill in the loan and applicant information on the Assess page.',
  },
  {
    title: '2. Get a risk estimate',
    text: 'The model returns a default probability and the factors that pushed it up or down.',
  },
  {
    title: '3. Ask the assistant',
    text: 'Ask credit-risk questions and get answers grounded in the knowledge base.',
  },
]

export function Dashboard() {
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    get<Health>('/api/health')
      .then(setStatus)
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <>
      <section className='relative overflow-hidden border-b bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950'>
        <div className='mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center'>
          <h1 className='text-5xl font-semibold tracking-tight md:text-7xl'>
            Understand{' '}
            <em
              className='font-normal'
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              credit
            </em>{' '}
            risk
          </h1>
          <p className='text-muted-foreground mt-5 max-w-xl text-lg'>
            Clear default-risk estimates and plain-language answers for every
            loan application.
          </p>
          <div className='mt-8 flex gap-3'>
            <Link
              to='/assess'
              className='bg-foreground text-background flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium'
            >
              Start assessment <ArrowUpRight className='h-4 w-4' />
            </Link>
            <Link
              to='/assistant'
              className='flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium'
            >
              <MessagesSquare className='h-4 w-4' /> Ask the assistant
            </Link>
          </div>
        </div>
      </section>

      <section className='border-b'>
        <div className='mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-3'>
          {trust.map((t) => (
            <div
              key={t.text}
              className='flex items-center justify-center gap-3 text-sm font-medium'
            >
              <t.icon className='h-5 w-5' /> {t.text}
            </div>
          ))}
        </div>
      </section>

      <main className='mx-auto w-full max-w-6xl space-y-4 px-4 py-10'>
        <div className='grid gap-4 md:grid-cols-3'>
          {steps.map((s) => (
            <Card key={s.title}>
              <CardHeader>
                <CardTitle className='text-base'>{s.title}</CardTitle>
                <CardDescription>{s.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>System status</CardTitle>
            <CardDescription>Live check of the RiskLens engine.</CardDescription>
          </CardHeader>
          <CardContent className='flex items-center gap-3'>
            {status === 'checking' && <Badge variant='outline'>Checking...</Badge>}
            {status === 'offline' && (
              <Badge variant='destructive'>Engine offline</Badge>
            )}
            {typeof status === 'object' && (
              <>
                <Badge variant='secondary'>Engine online</Badge>
                <span className='text-muted-foreground text-sm'>
                  Model:{' '}
                  {status.model === 'trained'
                    ? 'trained model'
                    : 'demo model (mock results)'}
                </span>
              </>
            )}
          </CardContent>
        </Card>

        <p className='text-muted-foreground text-xs'>
          RiskLens gives estimates for information only. It is not a lending
          decision.
        </p>
      </main>
    </>
  )
}