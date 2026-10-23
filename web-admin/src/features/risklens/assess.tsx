import { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { post } from '@/lib/risklens-api'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

type Field =
  | { name: string; label: string; kind: 'number'; initial: string }
  | { name: string; label: string; kind: 'select'; options: string[] }

const yesNo = ['Yes', 'No']

const fields: Field[] = [
  { name: 'Age', label: 'Age', kind: 'number', initial: '35' },
  { name: 'Income', label: 'Annual income', kind: 'number', initial: '60000' },
  { name: 'LoanAmount', label: 'Loan amount', kind: 'number', initial: '120000' },
  { name: 'CreditScore', label: 'Credit score', kind: 'number', initial: '680' },
  { name: 'MonthsEmployed', label: 'Months employed', kind: 'number', initial: '48' },
  { name: 'NumCreditLines', label: 'Credit lines', kind: 'number', initial: '3' },
  { name: 'InterestRate', label: 'Interest rate (%)', kind: 'number', initial: '12' },
  { name: 'LoanTerm', label: 'Loan term (months)', kind: 'number', initial: '36' },
  { name: 'DTIRatio', label: 'Debt-to-income ratio', kind: 'number', initial: '0.35' },
  {
    name: 'Education',
    label: 'Education',
    kind: 'select',
    options: ["High School", "Bachelor's", "Master's", 'PhD'],
  },
  {
    name: 'EmploymentType',
    label: 'Employment type',
    kind: 'select',
    options: ['Full-time', 'Part-time', 'Self-employed', 'Unemployed'],
  },
  {
    name: 'MaritalStatus',
    label: 'Marital status',
    kind: 'select',
    options: ['Single', 'Married', 'Divorced'],
  },
  { name: 'HasMortgage', label: 'Has mortgage', kind: 'select', options: yesNo },
  { name: 'HasDependents', label: 'Has dependents', kind: 'select', options: yesNo },
  {
    name: 'LoanPurpose',
    label: 'Loan purpose',
    kind: 'select',
    options: ['Home', 'Auto', 'Education', 'Business', 'Other'],
  },
  { name: 'HasCoSigner', label: 'Has co-signer', kind: 'select', options: yesNo },
]

type Result = {
  probability: number
  risk_level: string
  top_factors: { feature: string; impact: number }[]
  mock?: boolean
}

const initialValues = Object.fromEntries(
  fields.map((f) => [f.name, f.kind === 'number' ? f.initial : f.options[0]])
)

export function Assess() {
  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }))

  const submit = async () => {
    setError('')
    const payload: Record<string, string | number> = {}
    for (const f of fields) {
      const raw = values[f.name]
      if (f.kind === 'number') {
        if (raw.trim() === '' || Number.isNaN(Number(raw))) {
          setError(`Enter a valid number for ${f.label}`)
          return
        }
        payload[f.name] = Number(raw)
      } else {
        payload[f.name] = raw
      }
    }
    setLoading(true)
    try {
      setResult(await post<Result>('/api/predict', payload))
    } catch {
      setError('Could not reach the RiskLens server.')
    }
    setLoading(false)
  }

  return (
    <>
      <Header>
        <h1 className='text-lg font-semibold'>Assess</h1>
      </Header>
      <Main>
        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Applicant details</CardTitle>
              <CardDescription>
                Enter the loan and applicant information.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                {fields.map((f) => (
                  <div key={f.name} className='space-y-1.5'>
                    <Label htmlFor={f.name}>{f.label}</Label>
                    {f.kind === 'number' ? (
                      <Input
                        id={f.name}
                        value={values[f.name]}
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                    ) : (
                      <Select
                        value={values[f.name]}
                        onValueChange={(v) => set(f.name, v)}
                      >
                        <SelectTrigger id={f.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {f.options.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button onClick={submit} disabled={loading}>
                {loading ? 'Assessing...' : 'Assess risk'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>
                An estimate for information only, not a lending decision.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {!result && (
                <p className='text-muted-foreground text-sm'>
                  Submit the form to see the estimated default risk.
                </p>
              )}
              {result && (
                <>
                  {result.mock && (
                    <Badge variant='outline'>Demo data (mock model)</Badge>
                  )}
                  <div className='flex items-center gap-3'>
                    <span className='text-4xl font-bold'>
                      {(result.probability * 100).toFixed(1)}%
                    </span>
                    <Badge
                      variant={
                        result.risk_level.toLowerCase() === 'high'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {result.risk_level} risk
                    </Badge>
                  </div>
                  <div>
                    <p className='mb-2 text-sm font-medium'>
                      Top factors (red raises risk, green lowers it)
                    </p>
                    <div className='h-64'>
                      <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={result.top_factors} layout='vertical'>
                          <XAxis type='number' />
                          <YAxis
                            type='category'
                            dataKey='feature'
                            width={110}
                          />
                          <Tooltip />
                          <Bar dataKey='impact'>
                            {result.top_factors.map((f) => (
                              <Cell
                                key={f.feature}
                                fill={f.impact > 0 ? '#ef4444' : '#22c55e'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}