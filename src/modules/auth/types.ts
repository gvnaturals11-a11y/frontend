import { ReactElement } from 'react'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export type AuthPageWithLayout = {
  getLayout?: (page: ReactElement) => ReactElement
}

