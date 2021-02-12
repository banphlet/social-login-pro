import { Card, Tabs } from '@shopify/polaris'
import React from 'react'
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
          <Card.Section>
            {selected === 1 && <Settings shop={shop} />}
          </Card.Section>
        </Tabs>
      </Card>
    </div>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
