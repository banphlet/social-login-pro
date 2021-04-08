'use strict'
import { pick } from 'lodash/fp'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import shopService from '../../../server/services/shops'
import Cors from 'cors'

import { providersList } from '../../../server/services/social-auth/providers'
import getAuthorizationUrl from '../../../server/services/social-auth/auth/signin/oauth'

const getAuthorizationUrls = ({ socialPlatforms, shopId }) =>
  Promise.all(
    socialPlatforms.map(async providerId => {
      const provider = providersList.find(({ id }) => id === providerId)
      return {
        platform: providerId,
        authorization_url: await getAuthorizationUrl({
          options: { provider },
          query: { shop_id: shopId }
        })
      }
    })
  )

const attachAuthorizationurlToPlatforms = req => async ({
  social_platforms = [],
  ...rest
}) => {
  return {
    ...rest,
    social_platforms: await getAuthorizationUrls({
      socialPlatforms: social_platforms,
      shopId: req?.query.shop_id
    })
  }
}

const getShopSettings = (req, res) =>
  shopService()
    .getByShopId(req?.query.shop_id)
    .then(
      pick([
        'social_login_with_text',
        'social_platforms',
        'social_platform_status',
        'social_button_round'
      ])
    )
    .then(attachAuthorizationurlToPlatforms(req))
    .then(respond({ res, req }))

export default customServerHandler({
  handler: getShopSettings,
  middleware: Cors()
})
