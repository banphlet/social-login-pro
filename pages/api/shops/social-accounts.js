'use strict'
import customServerHandler from '../../../server/request-handler'
import shopService from '../../../server/services/shops'
import respond from '../../../server/request-handler/respond'
import { httpStatusCodes } from '../../../server/request-handler/error-handler'

const addSocialAccountHandler = (req, res) =>
  shopService()
    .addSocialAccount(req.body)
    .then(respond({ req, res, status: httpStatusCodes.CREATED }))

export default customServerHandler({
  handler: addSocialAccountHandler,
  method: 'POST'
})
