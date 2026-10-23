import { createFileRoute } from '@tanstack/react-router'
import { Assess } from '@/features/risklens/assess'

export const Route = createFileRoute('/_authenticated/assess/')({
  component: Assess,
})