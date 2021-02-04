'use strict'

import { required } from '../../../lib/utils'
import { shops as shopModel, socialAccount } from '../../../models'
import platforms from '../../platforms'

export async function getByExternalId (
  externalId = required('externalId'),
  platform = required('platform')
) {
  const actualExternalId = await platforms(platform).verifyToken({
    token: externalId
  })
  const {
    external_access_secret,
    external_access_token,
    __v,
    _id,
    ...shop
  } = await shopModel().getByExternalIdAndPlatform({
    externalId: actualExternalId,
    platform
  })
  return shop
}

export const getSocialPlatforms = async (shopId = required('shopId')) => {
  await shopModel().getById(shopId)
  return socialAccount().fetchByShopId(shopId)
}
