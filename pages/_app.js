import '@shopify/polaris/dist/styles.css'
import React from 'react'
import { appWithTranslation } from 'next-i18next'

function MyApp ({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default appWithTranslation(MyApp)
