import '@shopify/polaris/dist/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import { Provider } from '@shopify/app-bridge-react'

import i18n from '../i18n'

function MyApp ({ Component, pageProps }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Provider
        config={{
          shopOrigin: pageProps?.shop?.platform_domain,
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          forceRedirect: true
        }}
      >
        <Frame>
          <Component {...pageProps} />
        </Frame>
      </Provider>
    </AppProvider>
  )
}

export default i18n.appWithTranslation(MyApp)
