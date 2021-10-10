const { i18n } = require('./next-i18next.config.js')

module.exports = {
  i18n,
  async headers () {
    return [
      {
        source: '/*',
        headers: [
          {
            key: 'x-frame-options',
            value: 'allow'
          }
        ]
      }
    ]
  }
}
