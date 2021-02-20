'use strict'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import pino from 'pino'
import config from "../../../server/config";
import customServerHandler from '../../../server/request-handler'
import Cors from 'cors'

export default customServerHandler({
    handler: NextAuth({
        providers: [
            Providers.Google({
                clientId: config.get('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
                clientSecret: config.get('GOOGLE_CLIENT_SECRET')
            })
        ],
        secret: config.get('APP_KEY'),
        logger: pino(),
        cookies: {
            sessionToken: {
                name: `__Secure-next-auth.session-token`,
                options: {
                    httpOnly: false,
                    sameSite: false,
                    secure: false
                }
            },
            csrfToken: {
                name: `__Host-next-auth.csrf-token`,
                options: {
                    httpOnly: false,
                    sameSite: false,
                    path: '/',
                    secure: false
                }
            },
        }
    }),
    middleware: Cors(),
    allowAllMethods: true
})