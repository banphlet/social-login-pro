'use strict'
import NextAuthHandler from '../../../server/services/social-auth/auth'
import Providers from '../../../server/services/social-auth/providers'
import config from '../../../server/config'
import customServerHandler from '../../../server/request-handler'
import Cors from 'cors'

export default customServerHandler({
  handler: NextAuthHandler({
    providers: [
      Providers.Facebook({
        clientId: config.get('FACEBOOK_CLIENT_ID'),
        clientSecret: config.get('FACEBOOK_CLIENT_SECRET')
      }),
      Providers.Twitter({
        clientId: config.get('TWITTER_CLIENT_ID'),
        clientSecret: config.get('TWITTER_CLIENT_SECRET')
      }),
      Providers.Google({
        clientId: config.get('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
        clientSecret: config.get('GOOGLE_CLIENT_SECRET')
      }),
      Providers.LinkedIn({
        clientId: config.get('LINKEDIN_CLIENT_ID'),
        clientSecret: config.get('LINKEDIN_CLIENT_SECRET')
      }),
      Providers.Slack({
        clientId: config.get('SLACK_CLIENT_ID'),
        clientSecret: config.get('SLACK_CLIENT_SECRET')
      }),
      Providers.GitHub({
        clientId: config.get('GITHUB_CLIENT_ID'),
        clientSecret: config.get('GITHUB_CLIENT_SECRET')
      }),
      Providers.Reddit({
        clientId: config.get('REDDIT_CLIENT_ID'),
        clientSecret: config.get('REDDIT_CLIENT_SECRET')
      }),
      Providers.Twitch({
        clientId: config.get('TWITCH_CLIENT_ID'),
        clientSecret: config.get('TWITCH_CLIENT_SECRET')
      }),
      Providers.Discord({
        clientId: config.get('DISCORD_CLIENT_ID'),
        clientSecret: config.get('DISCORD_CLIENT_SECRET')
      }),
      Providers.LINE({
        clientId: config.get('LINE_CLIENT_ID'),
        clientSecret: config.get('LINK_CLIENT_SECRET')
      }),
      Providers.Foursquare({
        clientId: config.get('FOUR_SQUARE_CLIENT_ID'),
        clientSecret: config.get('FOUR_SQUARE_CLIENT_SECRET'),
        apiVersion: '20210119'
      }),
      Providers.VK({
        clientId: config.get('VK_CLIENT_ID'),
        clientSecret: config.get('VK_CLIENT_SECRET')
      }),
      Providers.Yandex({
        clientId: config.get('YANDEX_CLIENT_ID'),
        clientSecret: config.get('YANDEX_CLIENT_SECRET')
      })
      // Providers.Tumblr({
      //     clientId: config.get('TUMBLR_CLIENT_ID'),
      //     clientSecret: config.get('TUMBLR_CLIENT_SECRET')
      // })
    ],
    secret: config.get('APP_KEY')
  }),
  middleware: Cors(),
  allowAllMethods: true
})
