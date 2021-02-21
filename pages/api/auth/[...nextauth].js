'use strict'
import NextAuthHandler from '../../../server/services/social-auth/auth'
import Providers from '../../../server/services/social-auth/providers'
import config from "../../../server/config";
import customServerHandler from '../../../server/request-handler'
import Cors from 'cors'

export default customServerHandler({
    handler: NextAuthHandler({
        providers: [
            Providers.Google({
                clientId: config.get('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
                clientSecret: config.get('GOOGLE_CLIENT_SECRET')
            }),
            Providers.Facebook({
                clientId: config.get('FACEBOOK_CLIENT_ID'),
                clientSecret: config.get('FACEBOOK_CLIENT_SECRET')
            }),
            Providers.Twitter({
                clientId: config.get('TWITTER_CLIENT_ID'),
                clientSecret: config.get('TWITTER_CLIENT_SECRET')
            }),
            Providers.Discord({
                clientId: config.get('DISCORD_CLIENT_ID'),
                clientSecret: config.get('DISCORD_CLIENT_SECRET')
            }),
            Providers.LinkedIn({
                clientId: config.get('LINKEDIN_CLIENT_ID'),
                clientSecret: config.get('LINKEDIN_CLIENT_SECRET')
            }),
            Providers.Yandex({
                clientId: config.get('YANDEX_CLIENT_ID'),
                clientSecret: config.get('YANDEX_CLIENT_SECRET')
            })
        ],
        secret: config.get('APP_KEY')
    }),
    middleware: Cors(),
    allowAllMethods: true
})