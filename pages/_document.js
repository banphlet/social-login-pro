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
          src='https://connect.facebook.net/en_US/all.js'
        ></script>
        <script src='//static.parastorage.com/services/js-sdk/1.537.0/js/wix.min.js'></script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
