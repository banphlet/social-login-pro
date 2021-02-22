import { Card, Tabs } from '@shopify/polaris'
import React from 'react'
import Analytics from '../Components/Analytics'
import Settings from '../Components/Settings'
import { AppProvider, Frame } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import { Provider, useAppBridge } from '@shopify/app-bridge-react'
import { TitleBar, Button, ButtonGroup } from '@shopify/app-bridge/actions';
import SocialLogin from '../Components/SocialLogin'
import useMutation from '../Hooks/useMutation'


const tabs = [
  {
    id: 'Analytics',
    content: 'Analytics',
    accessibilityLabel: 'Analytics',
    panelID: 'Analytics'
  },
  {
    id: 'Settings',
    content: 'Limit Login Settings',
    panelID: 'Settings'
  },
  {
    id: 'Social Login',
    content: 'Social Login Settings',
    panelID: 'Social Login'
  }
]


const Main = ({ shop }) => {
  const [selected, setSelected] = React.useState(0)
  const { makeRequest, loading, data: { data } = {} } = useMutation({
    path: 'shops/me',
    method: 'put'
  })
  const app = useAppBridge();

  React.useEffect(() => {
    showPlan()
  }, [])

  const showPlan = () => {
    const saveButton = Button.create(app, { label: shop.plan?.name, style: Button.Style.Danger });
    TitleBar.create(app, {
      buttons: {
        secondary: [saveButton],
      }
    });
  }


  const handleTabChange = React.useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
  )
  return <Frame>
    <div style={{ padding: 5 }}>
      <Card>
        <Tabs
          tabs={tabs}
          selected={selected}
          onSelect={handleTabChange}
          disclosureText='More views'
        >
          {selected === 0 && <Analytics shop={shop} />}
          {selected === 1 && <Settings makeRequest={makeRequest} loading={loading} data={data} shop={shop} />}
          {selected === 2 && <SocialLogin makeRequest={makeRequest} loading={loading} data={data} shop={shop} />}
        </Tabs>
      </Card>
    </div>
  </Frame>
}

export default function Home({ shop }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Provider
        config={{
          shopOrigin: shop?.platform_domain,
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          forceRedirect: true
        }}
      >
        <Main shop={shop} />
      </Provider>
    </AppProvider>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
