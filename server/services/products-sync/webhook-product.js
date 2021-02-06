'use strict'

import { syncProducts } from '../../lib/facebook'
import joi from '../../lib/joi'
import { parseString, validate } from '../../lib/utils'
import { shops } from '../../models'
import { Platforms } from '../../models/shops/schema'
import platforms from '../platforms'
import pino from 'pino'
import sync from './sync'

const logger = pino()

export default async function webhookProduct (payload) {
  const validated = validate(
    joi.object({
      token: joi.string().required(),
      platform: joi
        .string()
        .required()
        .valid(...Object.values(Platforms))
    }),
    payload
  )
  const decoded = platforms(validated.platform).decodeToken(validated.token)
  const generalInfo = parseString(decoded.data)
  const shop = await shops().getByExternalIdAndPlatform({
    externalId: generalInfo.instanceId,
    platform: validated.platform
  })
  const productInfo = parseString(generalInfo.data)
  const product = await platforms(validated.platform).getSingleProduct({
    accessToken: shop.external_access_token,
    refreshToken: shop.external_access_secret,
    productId: productInfo.productId,
    brand: shop.name
  })
  await Promise.all(
    shop?.social_accounts.map(account => {
      return sync({
        catalogs: account.catalogs,
        accessToken: account.access_token,
        accountId: account.id,
        products: Array.isArray(product) ? product : [product],
        trackQueue: true
      })
    })
  )
  logger.info('done syncing product update', productInfo)
}
