'use strict'
import NextAuthHandler from '../../../server/lib/social-auth/auth'
import Providers from '../../../server/lib/social-auth/providers'
import config from "../../../server/config";
import customServerHandler from '../../../server/request-handler'
import Cors from 'cors'

export default customServerHandler({
    handler: NextAuthHandler({
        providers: [
            Providers.Google({
                clientId: config.get('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
                clientSecret: config.get('GOOGLE_CLIENT_SECRET')
            })
        ],
        secret: config.get('APP_KEY')
    }),
    middleware: Cors(),
    allowAllMethods: true
})