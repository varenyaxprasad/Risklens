import { Navigate, Outlet } from '@tanstack/react-router'
import { isLoggedIn } from '@/lib/demo-auth'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SkipToMain } from '@/components/skip-to-main'
import { RiskLensNav } from '@/features/risklens/risklens-nav'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  if (!isLoggedIn()) return <Navigate to='/login' />

  return (
    <SearchProvider>
      <LayoutProvider>
        <SkipToMain />
        <RiskLensNav />
        {children ?? <Outlet />}
      </LayoutProvider>
    </SearchProvider>
  )
}