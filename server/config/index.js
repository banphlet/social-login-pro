import convict from 'convict'

convict.addFormat(require('convict-format-with-validator').email)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  DB_URL: {
    doc: 'Database url',
    default: process.env.DB_URL,
    format: '*',
    env: 'DB_URL'
  },
  APP_KEY: {
    doc: 'APP KEY',
    default: process.env.APP_KEY,
    format: '*',
    env: 'APP_KEY',
    sensitive: true
  },
  NO_REPLY_EMAIL: {
    doc: 'Email to send emails from',
    default: process.env.NO_REPLY_EMAIL || 'no-reply@digiduka.com',
    format: 'email'
  },
  APP_URL: {
    doc: 'APP_URL',
    default: process.env.APP_URL,
    format: '*',
    env: 'APP_URL'
  },
  WIX_CLIENT_ID: {
    doc: 'WIX_CLIENT_ID',
    default: process.env.WIX_CLIENT_ID,
    format: '*',
    env: 'WIX_CLIENT_ID'
  },
  WIX_CLIENT_SECRET: {
    doc: 'WIX_CLIENT_SECRET',
    default: process.env.WIX_CLIENT_SECRET,
    format: '*',
    env: 'WIX_CLIENT_SECRET'
  }
})

config.validate({ allowed: 'strict' })

export default config
