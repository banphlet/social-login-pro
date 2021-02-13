'use strict'

import { required } from '../../../lib/utils'
import { customers, shops } from '../../../models'

export default async function deleteShopAndDetails ({
  shop_id: externalId = required('shop_id'),
  platform = required('platform')
}) {
  const shop = await shops().getByExternalIdAndPlatform({
    externalId,
    platform
  })

  await Promise.all([
    customers().deleteMany({
      query: {
        shop: shop.id
      }
    }),
    shops().deleteOne({
      query: {
        _id: shop.id
      }
    })
  ])
}
