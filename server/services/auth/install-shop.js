'use strict'

import joi from '../../lib/joi'
import { validate } from '../../lib/utils'
import { Platforms } from '../../models/shops/schema'
import platforms from '../platforms'
import { shops as shopModel } from '../../models'

const schema = joi.object({
  code: joi.string().required(),
  platform: joi
    .string()
    .valid(...Object.values(Platforms))
    .required(),
  instanceId: joi.string().when('platform', {
    is: Platforms.WIX,
    then: joi.required(),
    otherwise: joi.optional()
  })
})

const getTokens = ({ platform, ...rest }) =>
  platforms(platform).getOauthAccessTokens(rest)

export default async function installShop (payload) {
  const validated = validate(schema, payload)
  const tokens = await getTokens(validated)
  const shopDetails = await platforms(validated.platform).getSiteDetails(tokens)
  await shopModel().upsertByDomainOrExternalId(
    { domain: shopDetails.domain, externalId: shopDetails.externalId },
    {
      domain: shopDetails.domain,
      external_id: shopDetails.externalId,
      name: shopDetails.name,
      email: shopDetails.email,
      external_access_token: tokens.accessToken,
      external_access_secret: tokens.refreshToken,
      platform: validated.platform
    }
  )

  return {
    url: shopDetails.domain
  }
}
