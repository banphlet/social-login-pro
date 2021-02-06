'use strict'

import { syncProducts } from '../../lib/facebook'
import joi from '../../lib/joi'
import { parseString, validate } from '../../lib/utils'
import { shops } from '../../models'
import { Platforms } from '../../models/shops/schema'
import platforms from '../platforms'
import pino from 'pino'

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
      return Promise.all(
        account.catalogs.map(async catalog => {
          const handle = await syncProducts({
            products: Array.isArray(product) ? product : [product],
            catalogId: catalog.id,
            accessToken: account.access_token
          })
          logger.info(handle)
        })
      )
    })
  )
  logger.info('done syncing product update', productInfo)
}
