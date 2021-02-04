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
  NEXT_PUBLIC_APP_URL: {
    doc: 'NEXT_PUBLIC_APP_URL',
    default: process.env.NEXT_PUBLIC_APP_URL,
    format: '*',
    env: 'NEXT_PUBLIC_APP_URL'
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
  },
  NEXT_PUBLIC_APP_FACEBOOK_ID: {
    doc: 'NEXT_PUBLIC_APP_FACEBOOK_ID',
    default: process.env.NEXT_PUBLIC_APP_FACEBOOK_ID,
    format: '*',
    env: 'NEXT_PUBLIC_APP_FACEBOOK_ID'
  },
  FACEBOOK_APP_SECRET: {
    doc: 'FACEBOOK_APP_SECRET',
    default: process.env.FACEBOOK_APP_SECRET,
    format: '*',
    env: 'FACEBOOK_APP_SECRET'
  }
})

config.validate({ allowed: 'strict' })

export default config
