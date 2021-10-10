'use strict'
import NextAuthHandler from '../../../server/services/social-auth/auth'
import config from '../../../server/config'
import customServerHandler from '../../../server/request-handler'
import Cors from 'cors'

export default customServerHandler({
  handler: NextAuthHandler({
    secret: config.get('APP_KEY')
  }),
  middleware: Cors(),
  allowAllMethods: true
})
