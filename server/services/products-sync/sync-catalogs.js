'use strict'

import joi, { objectId } from '../../lib/joi'
import { validate } from '../../lib/utils'
import { socialAccount } from '../../models'
import platforms from '../platforms'
import * as fbLib from '../../lib/facebook'
import { SyncStatus } from '../../models/social-accounts/schema'
import addNewJob from './scheduler'

const schema = joi.object({
  catalog_id: joi.string().required(),
  id: objectId().required(),
  shop_id: objectId().required()
})

const syncProducts = async account => {
  const products = await platforms(account?.shop?.platform).fetchAllProducts({
    accessToken: account?.shop?.external_access_token,
    refreshToken: account?.shop?.external_access_secret,
    brand: account?.shop.name
  })

  await Promise.all(
    account.catalogs.map(async catalog => {
      const response = await fbLib
        .syncProducts({
          products,
          accessToken: account?.access_token,
          catalogId: catalog.id
        })
        .catch(err => {
          const isCatalogInValidError = /does not exist/.test(
            err.response?.body?.error?.message
          )
          if (isCatalogInValidError) {
            return {
              error: 'This Catalog does not exist'
            }
          }
          throw err
        })
      await socialAccount().updateByCatalogIdAndSocialAccount({
        id: account.id,
        catalogId: catalog.id,
        update: {
          ...(response?.handles && {
            'catalogs.$.last_sync_handle': response.handles[0],
            'catalogs.$.sync_status': SyncStatus.PUSHED
          }),
          ...(response.error && {
            'catalogs.$.error': response.error,
            'catalogs.$.sync_status': SyncStatus.ERROR
          })
        }
      })
      response.handles &&
        addNewJob({
          handle: response.handles[0],
          catalogId: catalog.id,
          id: account.id,
          accessToken: account?.access_token
        })
    })
  )
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
