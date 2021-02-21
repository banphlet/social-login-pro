import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" crossOrigin="anonymous" />
        <link href='/css/lla.css' rel="stylesheet" />
        <script
          async
          defer
          crossOrigin='anonymous'
          src='https://connect.facebook.net/en_US/all.js'
        ></script>
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/6521527.js"></script>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
