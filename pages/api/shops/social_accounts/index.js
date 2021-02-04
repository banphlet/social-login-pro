'use strict'
import { cond, propEq, T } from 'lodash/fp'
import customServerHandler from '../../../../server/request-handler'
import shopService from '../../../../server/services/shops'
import respond from '../../../../server/request-handler/respond'
import { httpStatusCodes } from '../../../../server/request-handler/error-handler'

const addOrUpdateSocialAccountHandler = (req, res) =>
  shopService()
    .addOrUpdateSocialAccount(req.body)
    .then(respond({ req, res, status: httpStatusCodes.CREATED }))

const getSocialAccounts = (req, res) =>
  shopService()
    .getSocialPlatforms(req.query?.shop_id)
    .then(respond({ req, res }))

export default cond([
  [
    propEq('method', 'POST'),
    customServerHandler({
      handler: addOrUpdateSocialAccountHandler,
      method: 'POST'
    })
  ],
  [
    propEq('method', 'GET'),
    customServerHandler({ handler: getSocialAccounts })
  ],
  [T, customServerHandler({})]
])
