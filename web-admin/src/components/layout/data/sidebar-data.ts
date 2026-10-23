import { LayoutDashboard, Calculator, MessagesSquare, ShieldAlert } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Utkarsh',
    email: 'utkarsh@risklens.local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'RiskLens',
      logo: ShieldAlert,
      plan: 'Credit risk insights',
    },
  ],
  navGroups: [
    {
      title: 'RiskLens',
      items: [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard },
        { title: 'Assess', url: '/assess', icon: Calculator },
        { title: 'Assistant', url: '/assistant', icon: MessagesSquare },
      ],
    },
  ],
}