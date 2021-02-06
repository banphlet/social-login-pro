'use strict'

import { required } from '../../lib/utils'
import * as fbLib from '../../lib/facebook'
import { socialAccount } from '../../models'
import {
  SocialAccountStatus,
  SyncStatus
} from '../../models/social-accounts/schema'
import { chunk, flatten } from 'lodash'
import addNewJob from './scheduler'

const MaximumItemsPerChunk = 5000

const pushProductsInChunks = ({ products, accessToken, catalogId }) => {
  const productChunks = chunk(products, MaximumItemsPerChunk)

  return Promise.all(
    productChunks.map(chunks =>
      fbLib
        .syncProducts({
          products: chunks,
          accessToken: accessToken,
          catalogId: catalogId
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
    )
  )
}

const pushToFb = ({
  accessToken,
  products,
  trackQueue,
  accountId
}) => async catalog => {
  const fbResponse = await pushProductsInChunks({
    products,
    accessToken,
    catalogId: catalog.id
  })
  const response = flatten(fbResponse)[0]
  await socialAccount().updateByCatalogIdAndSocialAccount({
    id: accountId,
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
    trackQueue &&
    addNewJob({
      handle: response.handles[0],
      catalogId: catalog.id,
      id: accountId,
      accessToken
    })
}

export default function sync ({
  catalogs = required('catalogs'),
  accessToken = required('accessToken'),
  products = required('products'),
  trackQueue = true,
  accountId = required('accountId')
}) {
  return Promise.all(
    catalogs
      .filter(catalog => catalog.status === SocialAccountStatus.ACTIVE)
      .map(pushToFb({ accessToken, products, trackQueue, accountId }))
  )
}
