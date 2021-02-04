'use strict'
import { pipe, pick, prop } from 'lodash/fp'
import { asyncPipe, validate } from '../../../lib/utils'
import querystring from 'querystring'
import joi from '../../../lib/joi'
import { post, get } from '../../../lib/request'
import config from '../../../config'

const BASE_OAUTH_URL = 'https://www.wix.com'
const BASE_WIX_API = 'https://www.wixapis.com/apps/v1'

const APP_ID = config.get('WIX_CLIENT_ID')
const APP_SECRET = config.get('WIX_CLIENT_SECRET')

const schema = joi.object({
  token: joi.string().required(),
  redirectUrl: joi
    .string()
    .uri()
    .required()
})

const getPermissionUrl = pipe(
  validate(schema),
  params =>
    `${BASE_OAUTH_URL}/app-oauth-installation/consent/?${querystring.stringify({
      appId: APP_ID,
      token: params.token,
      redirectUrl: params.redirectUrl
    })}`
)

const getAccessTokenAndRefreshToken = post(`${BASE_OAUTH_URL}/oauth/access`)

const getOauthAccessTokens = asyncPipe(
  pick(['code']),
  validate(joi.object({ code: joi.string().required() })),
  ({ code }) => ({
    body: {
      code,
      grant_type: 'authorization_code',
      client_id: APP_ID,
      client_secret: APP_SECRET
    }
  }),
  getAccessTokenAndRefreshToken,
  // eslint-disable-next-line camelcase
  ({ access_token, refresh_token }) => ({
    refreshToken: refresh_token,
    accessToken: access_token
  })
)

const getDetails = get(`${BASE_WIX_API}/instance`)
const getShopEmail = get(
  'https://www.wixapis.com/site-properties/v4/properties?fields.paths=email'
)
const getShopDetails = ({ accessToken }) =>
  Promise.all([
    getDetails({
      headers: {
        Authorization: accessToken
      }
    }),
    getShopEmail({
      headers: {
        Authorization: accessToken
      }
    })
  ])

const getSiteDetails = asyncPipe(
  pick(['accessToken']),
  validate(joi.object({ accessToken: joi.string().required() })),
  getShopDetails,
  ([siteDetails, moreDetails]) => ({
    externalId: siteDetails.instance.instanceId,
    domain: siteDetails.site.url,
    name: siteDetails.site.siteDisplayName,
    email: moreDetails.properties.email
  })
)

/**
 *Verify Token from Wix
 *@params {string} token from wix
 *@throws {InvalidTokenError} When we cant verify token
 *@returns {Promise} Resolves to the externalId in the payload
 *
 * **/
const decode = pipe(
  token => token.split('.')[1],
  payload => Buffer.from(payload, 'base64').toString('ascii'),
  JSON.parse
)
const logAndThrowInvalidToken = err => {
  log.error(err)
  throw new Error('token is not valid')
}

const tryCatch = (fn, errorThrower) => params => {
  try {
    return fn(params)
  } catch (error) {
    return errorThrower(error)
  }
}

const verifyToken = asyncPipe(
  validate(joi.object({ token: joi.string().required() })),
  prop('token'),
  tryCatch(decode, logAndThrowInvalidToken),
  prop('instanceId')
)

export { getPermissionUrl, getOauthAccessTokens, getSiteDetails, verifyToken }
