'use strict'

import joi, { objectId } from '../../lib/joi'
import { validate } from '../../lib/utils'
import { socialAccount } from '../../models'
import platforms from '../platforms'
import sync from './sync'
import pino from 'pino'

const logger = pino()

const schema = joi.object({
  catalog_id: joi.string().required(),
  id: objectId().required(),
  shop_id: objectId().required()
})

const syncProducts = async account => {
  try {
    logger.info('Starting sync')
    const products = await platforms(account?.shop?.platform).fetchAllProducts({
      accessToken: account?.shop?.external_access_token,
      refreshToken: account?.shop?.external_access_secret,
      brand: account?.shop.name
    })

    logger.info('Got products', products.length)

    await sync({
      catalogs: account?.catalogs,
      accessToken: account?.access_token,
      products,
      trackQueue: true,
      accountId: account.id
    })
    logger.info('Done  syncing products')
  } catch (error) {
    console.log(error)
  }
}

export default async function syncCatalogs (payload) {
  const validated = validate(schema, payload)
  const account = await socialAccount().getByIdAndCatalogs({
    shopId: validated.shop_id,
    catalogId: validated.catalog_id,
    id: validated.id
  })
  syncProducts(account)
  return {
    message: 'We are syncing your products. Check back later'
  }
}
