import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Calculator, MessagesSquare } from 'lucide-react'
import { get } from '@/lib/risklens-api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type Health = { status: string; model: string }
type Status = 'checking' | 'offline' | Health

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
    text: 'Ask credit-risk questions and get answers grounded in the knowledge base, with sources.',
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
      <Header>
        <h1 className='text-lg font-semibold'>Dashboard</h1>
      </Header>
      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Welcome to RiskLens
          </h2>
          <p className='text-muted-foreground'>
            Credit-risk estimates and explanations in one place.
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calculator className='h-5 w-5' /> Assess
              </CardTitle>
              <CardDescription>
                Estimate the default risk for a loan applicant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to='/assess'>Start assessment</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <MessagesSquare className='h-5 w-5' /> Assistant
              </CardTitle>
              <CardDescription>
                Ask credit-risk questions answered from the knowledge base.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant='outline'>
                <Link to='/assistant'>Open assistant</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System status</CardTitle>
              <CardDescription>Live check of the RiskLens engine.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
              {status === 'checking' && (
                <Badge variant='outline'>Checking...</Badge>
              )}
              {status === 'offline' && (
                <Badge variant='destructive'>Engine offline</Badge>
              )}
              {typeof status === 'object' && (
                <>
                  <Badge variant='secondary'>Engine online</Badge>
                  <p className='text-muted-foreground text-sm'>
                    Model:{' '}
                    {status.model === 'trained'
                      ? 'trained model'
                      : 'demo model (mock results)'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4 md:grid-cols-3'>
            {steps.map((s) => (
              <div key={s.title}>
                <p className='font-medium'>{s.title}</p>
                <p className='text-muted-foreground text-sm'>{s.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className='text-muted-foreground mt-4 text-xs'>
          RiskLens gives estimates for information only. It is not a lending
          decision.
        </p>
      </Main>
    </>
  )
}