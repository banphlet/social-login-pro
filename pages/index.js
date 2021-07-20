import { Card, Tabs } from '@shopify/polaris'
import React, { useMemo } from 'react'
import Analytics from '../Components/Analytics'
import Settings from '../Components/Settings'
import { AppProvider, Frame } from '@shopify/polaris'
import { Provider, useAppBridge } from '@shopify/app-bridge-react'
import { TitleBar, Button } from '@shopify/app-bridge/actions'
import SocialLogin from '../Components/SocialLogin'
import useMutation from '../Hooks/useMutation'
import { useTranslation } from 'next-i18next'

const Main = ({ shop }) => {
  const { t } = useTranslation()
  const [selected, setSelected] = React.useState(0)
  const { makeRequest, loading, data: { data } = {} } = useMutation({
    path: 'shops/me',
    method: 'put'
  })
  const app = useAppBridge()

  const tabs = useMemo(
    () => [
      {
        id: 'Social Login',
        content: t('social_login_settings_tab_name'),
        panelID: 'Social Login'
      },
      {
        id: 'Settings',
        content: t('login_limit_settings_tab_name'),
        panelID: 'Settings'
      },
      {
        id: 'Analytics',
        content: t('login_limit_analytics_tab_name'),
        accessibilityLabel: 'Analytics',
        panelID: 'Analytics'
      }
    ],
    []
  )

  React.useEffect(() => {
    showPlan()
  }, [])

  const showPlan = () => {
    const saveButton = Button.create(app, {
      label: shop.plan?.name,
      style: Button.Style.Danger
    })
    TitleBar.create(app, {
      buttons: {
        secondary: [saveButton]
      }
    })
  }

  const handleTabChange = React.useCallback(
    selectedTabIndex => setSelected(selectedTabIndex),
    []
  )
  return (
    <Frame>
      <div style={{ padding: 5 }}>
        <Card>
          <Tabs
            tabs={tabs}
            selected={selected}
            onSelect={handleTabChange}
            disclosureText='More views'
          >
            {selected === 2 && <Analytics shop={shop} />}
            {selected === 1 && (
              <Settings
                makeRequest={makeRequest}
                loading={loading}
                data={data}
                shop={shop}
              />
            )}
            {selected === 0 && (
              <SocialLogin
                makeRequest={makeRequest}
                loading={loading}
                data={data}
                shop={shop}
              />
            )}
          </Tabs>
        </Card>
      </div>
    </Frame>
  )
}

export default function Home ({ shop }) {
  return (
    <AppProvider>
      <Provider
        config={{
          shopOrigin: shop?.platform_domain,
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          forceRedirect: process.env.NODE_ENV === 'production'
        }}
      >
        <Main shop={shop} />
      </Provider>
    </AppProvider>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
