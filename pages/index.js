import { Card } from '@shopify/polaris'
import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import { Provider, useAppBridge } from '@shopify/app-bridge-react'
import { TitleBar, Button } from '@shopify/app-bridge/actions'
import SocialLogin from '../Components/SocialLogin'
import useMutation from '../Hooks/useMutation'
import { useTranslation } from 'next-i18next'

const Main = ({ shop }) => {
  const { t } = useTranslation()
  const { makeRequest, loading, data: { data } = {} } = useMutation({
    path: 'shops/me',
    method: 'put'
  })
  const app = useAppBridge()

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
  return (
    <Frame>
      <div style={{ padding: 5 }}>
        <Card>
          <SocialLogin
            makeRequest={makeRequest}
            loading={loading}
            data={data}
            shop={shop}
          />
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
          forceRedirect: true //process.env.NODE_ENV === 'production'
        }}
      >
        <Main shop={shop} />
      </Provider>
    </AppProvider>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
