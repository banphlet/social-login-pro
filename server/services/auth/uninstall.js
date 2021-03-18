'use strict'

import { shops } from '../../models'
import { StoreStatusTypes } from '../../models/shops/schema'

export default async function uninstall (payload) {
  return shops().upsertByPlatformDomainOrExternalId(
    {
      externalId: payload.id
    },
    {
      status: StoreStatusTypes.DEACTIVATED,
      plan: {
        name: 'Free Plan',
        platforms: ['facebook', 'twitter'],
        price: 0,
        external_id: ''
      }
    }
  )
}
