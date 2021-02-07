import '@shopify/polaris/dist/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import i18n from '../i18n'

function MyApp ({ Component, pageProps }) {
  React.useEffect(() => {
    i18n.i18n.changeLanguage(pageProps?.shop?.locale)
  }, [])
  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Component {...pageProps} />
      </Frame>
    </AppProvider>
  )
}

export default i18n.appWithTranslation(MyApp)
