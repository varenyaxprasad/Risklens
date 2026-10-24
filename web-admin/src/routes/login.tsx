import { createFileRoute } from '@tanstack/react-router'
import { Login } from '@/features/landing/login'

export const Route = createFileRoute('/login')({
  component: Login,
})