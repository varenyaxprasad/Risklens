import { useState } from 'react'
import { post } from '@/lib/risklens-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type Message = { role: 'user' | 'assistant'; text: string; sources?: string[] }

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    const q = question.trim()
    if (!q || loading) return
    setQuestion('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setLoading(true)
    try {
      const data = await post<{ answer: string; sources: string[] }>(
        '/api/chat',
        { question: q }
      )
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: data.answer, sources: data.sources },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Could not reach the RiskLens server.' },
      ])
    }
    setLoading(false)
  }

  return (
    <>
      <Header>
        <h1 className='text-lg font-semibold'>Assistant</h1>
      </Header>
      <Main>
        <Card className='mx-auto max-w-3xl'>
          <CardContent className='space-y-4 pt-6'>
            <div className='min-h-64 space-y-3'>
              {messages.length === 0 && (
                <p className='text-muted-foreground text-sm'>
                  Ask a credit-risk question, for example: What is
                  debt-to-income ratio?
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto w-fit max-w-[85%] rounded-lg px-3 py-2 text-sm'
                      : 'bg-muted max-w-[85%] rounded-lg px-3 py-2 text-sm'
                  }
                >
                  <p className='whitespace-pre-wrap'>{m.text}</p>
                  {m.sources && m.sources.length > 0 && (
                    <p className='text-muted-foreground mt-2 text-xs'>
                      Sources: {m.sources.join(', ')}
                    </p>
                  )}
                </div>
              ))}
              {loading && (
                <p className='text-muted-foreground text-sm'>Thinking...</p>
              )}
            </div>
            <div className='flex gap-2'>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder='Ask a credit-risk question'
              />
              <Button onClick={send} disabled={loading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}