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
  plugins: [new webpack.EnvironmentPlugin(['NEXT_PUBLIC_APP_URL'])]
}
