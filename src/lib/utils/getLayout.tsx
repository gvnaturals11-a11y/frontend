import React from 'react'

export type PageWithLayout<P = {}> = React.ComponentType<P> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement
}

export function getLayout(
  Component: PageWithLayout,
  page: React.ReactElement
): React.ReactElement {
  return Component.getLayout ? Component.getLayout(page) : page
}

