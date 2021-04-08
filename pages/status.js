import { Card, EmptyState, Page, Tabs } from '@shopify/polaris'
import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import { useRouter } from 'next/router'

const tabs = [
  {
    id: 'Analytics',
    content: 'Analytics',
    accessibilityLabel: 'Analytics',
    panelID: 'Analytics'
  },
  {
    id: 'Settings',
    content: 'Settings',
    panelID: 'Settings'
  }
]

export default function Status () {
  const router = useRouter()
  const message = router.query?.token
    ? 'Account Connected Successfully'
    : 'An Error Occurred Connecting'

  return (
    <AppProvider>
      <Frame>
        <Page narrowWidth>
          <EmptyState
            heading={message}
            image='/empty.svg'
            largeImage='/empty.svg'
            fullWidth
          />
        </Page>
      </Frame>
    </AppProvider>
  )
}
