require('dotenv').config()
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: ['./public-script.js'],
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'lla.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NEXT_PUBLIC_APP_URL'])
    // new MangleCssClassPlugin({
    //   classNameRegExp: '[cl]-[a-z][a-zA-Z0-9_]*',
    //   log: true
    // })
  ]
}
