import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { MotionConfig, animate, motion, useInView } from 'motion/react'
import {
  ArrowUpRight,
  BarChart3,
  FileSearch,
  Layers,
  MessagesSquare,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Reveal } from './reveal'
import { SpotlightCard } from './spotlight-card'

const features = [
  {
    icon: BarChart3,
    title: 'Default-risk estimate',
    text: 'Enter applicant details and get a default probability from the model.',
  },
  {
    icon: FileSearch,
    title: 'Explainable factors',
    text: 'See which factors pushed the estimate up and which pulled it down.',
  },
  {
    icon: MessagesSquare,
    title: 'Source-backed assistant',
    text: 'Ask credit-risk questions. Answers come from the knowledge base and name their sources.',
  },
  {
    icon: Layers,
    title: 'Clean architecture',
    text: 'A React front end, an Express API layer and a FastAPI engine running the ML and RAG code.',
  },
  {
    icon: ShieldCheck,
    title: 'Estimates, not decisions',
    text: 'Outputs are informational and never claim that a person will default.',
  },
  {
    icon: Zap,
    title: 'Built to extend',
    text: 'Swap in new models or documents without changing the interface.',
  },
]

const steps = [
  {
    title: 'Enter details',
    text: 'Fill in the loan and applicant information.',
  },
  {
    title: 'Get an estimate',
    text: 'The model returns a default probability and the main factors.',
  },
  {
    title: 'Ask why',
    text: 'Use the assistant to understand the terms and the reasoning.',
  },
]

const stack = ['React', 'Express', 'FastAPI', 'LangChain', 'ChromaDB', 'Gemini']

const sampleFactors = [
  { name: 'Credit score', width: 60, good: true },
  { name: 'Months employed', width: 30, good: true },
  { name: 'Debt-to-income', width: 42, good: false },
  { name: 'Loan amount', width: 25, good: false },
]

function SampleResult() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, 27, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: setValue,
    })
    return () => controls.stop()
  }, [inView])

  return (
    <div
      ref={ref}
      className='bg-card mx-auto w-full max-w-xl rounded-2xl border p-6 text-left shadow-2xl'
    >
      <p className='text-muted-foreground text-xs tracking-widest uppercase'>
        Sample output (illustrative)
      </p>
      <div className='mt-3 flex items-center gap-3'>
        <span className='text-5xl font-bold'>{value.toFixed(1)}%</span>
        <span className='bg-secondary rounded-full px-3 py-1 text-xs font-medium'>
          Low risk
        </span>
      </div>
      <div className='mt-6 space-y-3'>
        {sampleFactors.map((f, i) => (
          <div key={f.name}>
            <div className='mb-1 flex justify-between text-xs'>
              <span>{f.name}</span>
              <span className='text-muted-foreground'>
                {f.good ? 'lowers risk' : 'raises risk'}
              </span>
            </div>
            <div className='bg-muted h-2 overflow-hidden rounded-full'>
              <motion.div
                className={
                  f.good
                    ? 'h-full rounded-full bg-emerald-500'
                    : 'h-full rounded-full bg-red-500'
                }
                initial={{ width: 0 }}
                whileInView={{ width: `${f.width}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Landing() {
  return (
    <MotionConfig reducedMotion='user'>
      <div className='bg-background text-foreground min-h-svh scroll-smooth'>
        <div className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur'>
          <div className='mx-auto flex h-20 max-w-6xl items-center justify-between px-4'>
            <Link to='/' className='flex items-center gap-2 text-xl font-bold'>
              <span className='bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-lg'>
                <ShieldAlert className='h-5 w-5' />
              </span>
              RiskLens
            </Link>
            <nav className='text-muted-foreground hidden gap-8 text-sm font-medium md:flex'>
              <a href='#features' className='hover:text-foreground transition-colors'>
                Features
              </a>
              <a href='#how' className='hover:text-foreground transition-colors'>
                How it works
              </a>
              <a href='#sample' className='hover:text-foreground transition-colors'>
                Sample
              </a>
            </nav>
            <div className='flex items-center gap-3'>
              <Link
                to='/login'
                className='hover:text-muted-foreground text-sm font-medium transition-colors'
              >
                Login
              </Link>
              <Link
                to='/login'
                className='bg-foreground text-background flex items-center gap-2 rounded-full py-1.5 pr-1.5 pl-5 text-sm font-medium transition-transform hover:scale-105 active:scale-95'
              >
                Open app
                <span className='bg-background text-foreground flex h-8 w-8 items-center justify-center rounded-full'>
                  <ArrowUpRight className='h-4 w-4' />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <section className='relative overflow-hidden border-b'>
          <motion.div
            className='absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl'
            animate={{ x: [0, 70, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className='absolute top-32 right-1/4 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl'
            animate={{ x: [0, -60, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className='relative mx-auto flex max-w-4xl flex-col items-center px-4 py-32 text-center'>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-muted/50 mb-6 rounded-full border px-4 py-1.5 text-xs font-medium'
            >
              Credit-risk insight, explained
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className='text-5xl font-semibold tracking-tight md:text-7xl'
            >
              Understand{' '}
              <em
                className='font-normal'
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                credit
              </em>{' '}
              risk
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className='text-muted-foreground mt-6 max-w-xl text-lg'
            >
              Clear default-risk estimates and plain-language answers for every
              loan application.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className='mt-10 flex flex-wrap justify-center gap-3'
            >
              <Link
                to='/login'
                className='bg-foreground text-background flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-transform hover:scale-105 active:scale-95'
              >
                Start assessment <ArrowUpRight className='h-4 w-4' />
              </Link>
              <Link
                to='/login'
                className='hover:bg-muted flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-medium transition-all hover:scale-105 active:scale-95'
              >
                <MessagesSquare className='h-4 w-4' /> Ask the assistant
              </Link>
            </motion.div>
          </div>
        </section>

        <section className='border-b'>
          <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-6'>
            <span className='text-muted-foreground mr-2 text-xs tracking-widest uppercase'>
              Built with
            </span>
            {stack.map((s) => (
              <span
                key={s}
                className='hover:bg-muted rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5'
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        <section id='features' className='mx-auto max-w-6xl px-4 py-24'>
          <Reveal className='mb-12 text-center'>
            <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
              Everything you need to read the risk
            </h2>
            <p className='text-muted-foreground mt-3'>
              Move your mouse over the cards.
            </p>
          </Reveal>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <SpotlightCard className='h-full p-6'>
                  <f.icon className='mb-4 h-6 w-6' />
                  <h3 className='font-semibold'>{f.title}</h3>
                  <p className='text-muted-foreground mt-2 text-sm'>{f.text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </section>

        <section id='how' className='border-y'>
          <div className='mx-auto max-w-6xl px-4 py-24'>
            <Reveal className='mb-12 text-center'>
              <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
                How it works
              </h2>
            </Reveal>
            <div className='grid gap-8 md:grid-cols-3'>
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1}>
                  <div className='group'>
                    <span className='text-muted-foreground group-hover:text-foreground text-5xl font-semibold transition-colors'>
                      0{i + 1}
                    </span>
                    <h3 className='mt-3 text-lg font-semibold'>{s.title}</h3>
                    <p className='text-muted-foreground mt-1 text-sm'>{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id='sample' className='mx-auto max-w-6xl px-4 py-24 text-center'>
          <Reveal className='mb-10'>
            <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
              See what a result looks like
            </h2>
          </Reveal>
          <Reveal>
            <SampleResult />
          </Reveal>
        </section>

        <section className='border-t'>
          <Reveal className='mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center'>
            <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>
              Ready to try it?
            </h2>
            <p className='text-muted-foreground mt-3'>
              Run an assessment or ask the assistant a question.
            </p>
            <Link
              to='/login'
              className='bg-foreground text-background mt-8 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition-transform hover:scale-105 active:scale-95'
            >
              Start assessment <ArrowUpRight className='h-4 w-4' />
            </Link>
          </Reveal>
        </section>

        <footer className='border-t'>
          <div className='text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-xs md:flex-row'>
            <span>RiskLens</span>
            <span>
              Estimates are for information only and are not lending decisions.
            </span>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
