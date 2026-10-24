import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { DEMO_EMAIL, DEMO_PASSWORD, logIn } from '@/lib/demo-auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const fill = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    setError('')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (logIn(email, password)) {
      navigate({ to: '/dashboard' })
    } else {
      setError('Incorrect email or password. Use the sample credentials.')
    }
  }

  return (
    <div className='bg-background text-foreground grid min-h-svh lg:grid-cols-2'>
      <div className='relative hidden overflow-hidden border-r bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 lg:flex lg:flex-col lg:justify-between lg:p-10'>
        <motion.div
          className='absolute -top-20 -left-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl'
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className='absolute right-0 bottom-0 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl'
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />
        <Link to='/' className='relative flex items-center gap-2 text-xl font-bold'>
          <span className='bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-lg'>
            <ShieldAlert className='h-5 w-5' />
          </span>
          RiskLens
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='relative'
        >
          <p className='text-4xl font-semibold tracking-tight'>
            Credit-risk insight,{' '}
            <em
              className='font-normal'
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              explained
            </em>
            .
          </p>
          <p className='text-muted-foreground mt-3 max-w-sm text-sm'>
            Estimates and plain-language answers, with the reasoning shown.
          </p>
        </motion.div>
      </div>

      <div className='flex items-center justify-center p-6'>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-sm'
        >
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Welcome back</CardTitle>
              <CardDescription>
                Log in to open the RiskLens dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='bg-muted/40 mb-4 rounded-lg border p-3 text-xs'>
                <p className='font-medium'>Sample credentials</p>
                <p className='text-muted-foreground mt-1'>Email: {DEMO_EMAIL}</p>
                <p className='text-muted-foreground'>
                  Password: {DEMO_PASSWORD}
                </p>
                <button
                  type='button'
                  onClick={fill}
                  className='mt-2 underline underline-offset-2'
                >
                  Use sample credentials
                </button>
              </div>
              <form onSubmit={submit} className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='password'>Password</Label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={show ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='pr-10'
                    />
                    <button
                      type='button'
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                      className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
                    >
                      {show ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <Button
                  type='submit'
                  className='w-full transition-transform hover:scale-[1.02] active:scale-95'
                >
                  Log in
                </Button>
                <p className='text-muted-foreground text-center text-xs'>
                  Sample login for demonstration only.
                </p>
              </form>
            </CardContent>
          </Card>
          <p className='text-muted-foreground mt-4 text-center text-sm'>
            <Link to='/' className='hover:text-foreground underline'>
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}