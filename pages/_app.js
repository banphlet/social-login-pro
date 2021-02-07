import '@shopify/polaris/dist/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import i18n, { supportedLanguages } from '../i18n'

function MyApp ({ Component, pageProps }) {
  React.useEffect(() => {
    const Wix = window.Wix
    const language = Wix.Utils.getLocale()
    const isSupported = supportedLanguages.includes(language)
    if (isSupported) {
      i18n.i18n.changeLanguage(language)
    }
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
