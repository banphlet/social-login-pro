import { Card, Tabs } from '@shopify/polaris'
import React from 'react'
import Analytics from '../Components/Analytics'
import Settings from '../Components/Settings'

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

export default function Home ({ shop }) {
  const [selected, setSelected] = React.useState(0)

  const handleTabChange = React.useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
  )

  return (
    <div style={{ padding: 5 }}>
      <Card>
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={handleTabChange}
          disclosureText='More views'
        >
          {selected === 0 && <Analytics shop={shop} />}
          {selected === 1 && <Settings shop={shop} />}
        </Tabs>
      </Card>
    </div>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
