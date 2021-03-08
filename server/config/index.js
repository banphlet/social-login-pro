require('dotenv').config()
import convict from 'convict'

import isNil from 'lodash/isNil'
convict.addFormat(require('convict-format-with-validator').email)

const config = convict({
  PORT: {
    doc: 'port',
    format: 'port',
    default: process.env.PORT
  },
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
    default: isNil(process.env.IS_TEST_CHARGE)
      ? false
      : !!process.env.IS_TEST_CHARGE
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
  TUMBLR_CLIENT_ID: {
    doc: 'TUMBLR_CLIENT_ID',
    default: process.env.TUMBLR_CLIENT_ID,
    format: '*',
    env: 'TUMBLR_CLIENT_ID'
  },
  TUMBLR_CLIENT_SECRET: {
    doc: 'TUMBLR_CLIENT_SECRET',
    default: process.env.TUMBLR_CLIENT_SECRET,
    format: '*',
    env: 'TUMBLR_CLIENT_SECRET'
  },
  VK_CLIENT_SECRET: {
    doc: 'VK_CLIENT_SECRET',
    default: process.env.VK_CLIENT_SECRET,
    format: '*',
    env: 'VK_CLIENT_SECRET'
  },
  VK_CLIENT_ID: {
    doc: 'VK_CLIENT_ID',
    default: process.env.VK_CLIENT_ID,
    format: '*',
    env: 'VK_CLIENT_ID'
  },
  FOUR_SQUARE_CLIENT_ID: {
    doc: 'FOUR_SQUARE_CLIENT_ID',
    default: process.env.FOUR_SQUARE_CLIENT_ID,
    format: '*',
    env: 'FOUR_SQUARE_CLIENT_ID'
  },
  FOUR_SQUARE_CLIENT_SECRET: {
    doc: 'FOUR_SQUARE_CLIENT_SECRET',
    default: process.env.FOUR_SQUARE_CLIENT_SECRET,
    format: '*',
    env: 'FOUR_SQUARE_CLIENT_SECRET'
  },
  SLACK_CLIENT_SECRET: {
    doc: 'SLACK_CLIENT_SECRET',
    default: process.env.SLACK_CLIENT_SECRET,
    format: '*',
    env: 'SLACK_CLIENT_SECRET'
  },
  SLACK_CLIENT_ID: {
    doc: 'SLACK_CLIENT_ID',
    default: process.env.SLACK_CLIENT_ID,
    format: '*',
    env: 'SLACK_CLIENT_ID'
  },
  LINK_CLIENT_SECRET: {
    doc: 'LINK_CLIENT_SECRET',
    default: process.env.LINK_CLIENT_SECRET,
    format: '*',
    env: 'LINK_CLIENT_SECRET'
  },
  LINE_CLIENT_ID: {
    doc: 'LINE_CLIENT_ID',
    default: process.env.LINE_CLIENT_ID,
    format: '*',
    env: 'LINE_CLIENT_ID'
  },
  GITHUB_CLIENT_SECRET: {
    doc: 'GITHUB_CLIENT_SECRET',
    default: process.env.GITHUB_CLIENT_SECRET,
    format: '*',
    env: 'GITHUB_CLIENT_SECRET'
  },
  GITHUB_CLIENT_ID: {
    doc: 'GITHUB_CLIENT_ID',
    default: process.env.GITHUB_CLIENT_ID,
    format: '*',
    env: 'GITHUB_CLIENT_ID'
  },
  REDDIT_CLIENT_SECRET: {
    doc: 'REDDIT_CLIENT_SECRET',
    default: process.env.REDDIT_CLIENT_SECRET,
    format: '*',
    env: 'REDDIT_CLIENT_SECRET'
  },
  REDDIT_CLIENT_ID: {
    doc: 'REDDIT_CLIENT_ID',
    default: process.env.REDDIT_CLIENT_ID,
    format: '*',
    env: 'REDDIT_CLIENT_ID'
  }
})

config.validate({ allowed: 'strict' })

export default config
