'use strict'

import errors from '../../../lib/errors'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { shops, socialAccount } from '../../../models'

export async function removeCatalogById (payload) {
  const validated = validate(
    joi.object({
      shop_id: objectId().required(),
      catalog_id: joi.string().required(),
      social_account_id: objectId().required()
    }),
    payload
  )
  const shop = await shops().getById(validated.shop_id)
  const socialAccountAndCatalogExistsForShop = shop.social_accounts.find(
    account =>
      account.id === validated.social_account_id &&
      account.catalogs.find(catalog => catalog.id === validated.catalog_id)
  )
  if (!socialAccountAndCatalogExistsForShop) {
    throw errors.throwError({
      name: errors.RequestNotFound,
      message: 'account not found'
    })
  }
  return socialAccount().removeCatalogById({
    shopId: shop.id,
    socialAccountId: validated.social_account_id,
    catalogId: validated.catalog_id
  })
}
