import convict from 'convict'

import isNil from "lodash/isNil";
convict.addFormat(require('convict-format-with-validator').email)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  IS_TEST_CHARGE: {
    doc: 'Is paryment test charge',
    format: Boolean,
    env: 'IS_TEST_CHARGE',
    default: isNil(process.env.IS_TEST_CHARGE) ? false : !!process.env.IS_TEST_CHARGE
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
  NEXT_PUBLIC_APP_URL: {
    doc: 'NEXT_PUBLIC_APP_URL',
    default: process.env.NEXT_PUBLIC_APP_URL,
    format: '*',
    env: 'NEXT_PUBLIC_APP_URL'
  },
  NEXT_PUBLIC_SHOPIFY_CLIENT_ID: {
    doc: 'NEXT_PUBLIC_SHOPIFY_CLIENT_ID',
    default: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
    format: '*',
    env: 'NEXT_PUBLIC_SHOPIFY_CLIENT_ID'
  },
  SHOPIFY_CLIENT_SECRET: {
    doc: 'SHOPIFY_CLIENT_SECRET',
    default: process.env.SHOPIFY_CLIENT_SECRET,
    format: '*',
    env: 'SHOPIFY_CLIENT_SECRET'
  },
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: {
    doc: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    default: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    format: '*',
    env: 'NEXT_PUBLIC_GOOGLE_CLIENT_ID'
  },
  GOOGLE_CLIENT_SECRET: {
    doc: 'GOOGLE_CLIENT_SECRET',
    default: process.env.GOOGLE_CLIENT_SECRET,
    format: '*',
    env: 'GOOGLE_CLIENT_SECRET'
  },
  FACEBOOK_CLIENT_ID: {
    doc: 'FACEBOOK_CLIENT_ID',
    default: process.env.FACEBOOK_CLIENT_ID,
    format: '*',
    env: 'FACEBOOK_CLIENT_ID'
  },
  FACEBOOK_CLIENT_SECRET: {
    doc: 'FACEBOOK_CLIENT_SECRET',
    default: process.env.FACEBOOK_CLIENT_SECRET,
    format: '*',
    env: 'FACEBOOK_CLIENT_SECRET'
  },
  TWITTER_CLIENT_ID: {
    doc: 'TWITTER_CLIENT_ID',
    default: process.env.TWITTER_CLIENT_ID,
    format: '*',
    env: 'TWITTER_CLIENT_ID'
  },
  TWITTER_CLIENT_SECRET: {
    doc: 'TWITTER_CLIENT_SECRET',
    default: process.env.TWITTER_CLIENT_SECRET,
    format: '*',
    env: 'TWITTER_CLIENT_SECRET'
  },
  DISCORD_CLIENT_ID: {
    doc: 'DISCORD_CLIENT_ID',
    default: process.env.DISCORD_CLIENT_ID,
    format: '*',
    env: 'DISCORD_CLIENT_ID'
  },
  DISCORD_CLIENT_SECRET: {
    doc: 'DISCORD_CLIENT_SECRET',
    default: process.env.DISCORD_CLIENT_SECRET,
    format: '*',
    env: 'DISCORD_CLIENT_SECRET'
  },
  LINKEDIN_CLIENT_ID: {
    doc: 'LINKEDIN_CLIENT_ID',
    default: process.env.LINKEDIN_CLIENT_ID,
    format: '*',
    env: 'LINKEDIN_CLIENT_ID'
  },
  LINKEDIN_CLIENT_SECRET: {
    doc: 'LINKEDIN_CLIENT_SECRET',
    default: process.env.LINKEDIN_CLIENT_SECRET,
    format: '*',
    env: 'LINKEDIN_CLIENT_SECRET'
  },
  YANDEX_CLIENT_ID: {
    doc: 'YANDEX_CLIENT_ID',
    default: process.env.YANDEX_CLIENT_ID,
    format: '*',
    env: 'YANDEX_CLIENT_ID'
  },
  YANDEX_CLIENT_SECRET: {
    doc: 'YANDEX_CLIENT_SECRET',
    default: process.env.YANDEX_CLIENT_SECRET,
    format: '*',
    env: 'YANDEX_CLIENT_SECRET'
  },
  TWITCH_CLIENT_ID: {
    doc: 'TWITCH_CLIENT_ID',
    default: process.env.TWITCH_CLIENT_ID,
    format: '*',
    env: 'TWITCH_CLIENT_ID'
  },
  TWITCH_CLIENT_SECRET: {
    doc: 'TWITCH_CLIENT_SECRET',
    default: process.env.TWITCH_CLIENT_SECRET,
    format: '*',
    env: 'TWITCH_CLIENT_SECRET'
  },
})

config.validate({ allowed: 'strict' })

export default config
