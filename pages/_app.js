import '@shopify/polaris/dist/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import { AppProvider, Frame } from '@shopify/polaris'

function MyApp ({ Component, pageProps }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Frame>
        <Component {...pageProps} />
      </Frame>
    </AppProvider>
  )
}

export default MyApp
