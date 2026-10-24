import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/risklens/dashboard'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: Dashboard,
})