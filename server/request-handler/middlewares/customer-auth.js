'use strict'
import errors from '../../lib/errors'
import { getCookie, verifyJwt } from '../../lib/utils'

export default async function customerAuth (req, res, next) {
  try {
    const token = getCookie(req) || req?.query?.access_token
    const decodedToken = await verifyJwt(token)
    req.shopId = decodedToken.shop_id
    req.customerId = decodedToken.customer_id
  } catch (error) {
    next(
      errors.throwError({
        name: errors.InvalidTokenError,
        message: 'you are not authorized to access this resource'
      })
    )
  }
}
