import { Card, Tabs } from '@shopify/polaris'
import React from 'react'
import Analytics from '../Components/Analytics'
import Settings from '../Components/Settings'
import { AppProvider, Frame } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import { Provider } from '@shopify/app-bridge-react'


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

export default function Home({ shop }) {
  const [selected, setSelected] = React.useState(0)

  const handleTabChange = React.useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
  )

  return (
    <AppProvider i18n={enTranslations}>
      <Provider
        config={{
          shopOrigin: shop?.platform_domain,
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          forceRedirect: true
        }}
      >
        <Frame>
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
        </Frame>
      </Provider>
    </AppProvider>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
