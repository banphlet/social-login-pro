import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head />
        <script
          async
          defer
          crossOrigin='anonymous'
          src='https://connect.facebook.net/en_US/sdk.js'
        ></script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
