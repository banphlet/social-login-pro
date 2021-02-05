'use strict'

import got from '../../../lib/request'
import config from '../../../config'

const OAUTH_URL = 'https://www.wix.com/oauth/access'
const HTTP_UNAUTHORIZED = 401
const HTTP_FORBIDDEN = 403
const ERROR_CODES = [HTTP_FORBIDDEN, HTTP_UNAUTHORIZED]

const clientId = config.get('WIX_CLIENT_ID')

const clientSecret = config.get('WIX_CLIENT_SECRET')

const getAccessToken = async ({ refreshToken }) => {
  const response = await got.post(OAUTH_URL, {
    json: {
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    },
    responseType: 'json'
  })

  return response.body.access_token
}

const instance = got.extend({
  hooks: {
    afterResponse: [
      async (response, retryWithMergedOptions) => {
        if (ERROR_CODES.includes(response.statusCode)) {
          const context = response.request.options.context

          const { refreshToken } = context

          const token = await getAccessToken({
            refreshToken
          })

          const requestOptions = {
            headers: {
              Authorization: token
            }
          }

          instance.defaults.options = got.mergeOptions(
            instance.defaults.options,
            requestOptions
          )

          return retryWithMergedOptions(requestOptions)
        }

        return response
      }
    ]
  },
  mutableDefaults: true,
  prefixUrl: 'https://www.wixapis.com/stores/v1',
  responseType: 'json'
})

export default instance
