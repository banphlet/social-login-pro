'use strict'
import { getUser } from '../../lib/payments'
import errors from '../../lib/errors'

const authEndpointsPattern = [/api\/admin/]

export default async function auth (req, res, next) {
  const requiresAuth = authEndpointsPattern.some(regex => regex.test(req.url))
  if (!requiresAuth) {
    return
  }
  try {
    const token = req.headers?.authorization?.split(' ')[1]
    const user = await getUser(token)
    req.user = user?.data
    req.paymentServiceAccessToken = token
  } catch (error) {
    next(
      errors.throwError({
        name: errors.InvalidTokenError,
        message: 'you are not authorized to access this resource'
      })
    )
  }
}
