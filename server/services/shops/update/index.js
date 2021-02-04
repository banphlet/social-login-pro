'use strict'
import { validate } from '../../../lib/utils'
import schema from './schema'
import { shops as shopModel } from '../../../models'

export default async function update (payload) {
  const { payment_user_id, ...restOfValidated } = validate(schema, payload)
  const shop = await shopModel().getByPaymentServiceId(payment_user_id)
  const {
    _id,
    __v,
    payment_service_refresh_token,
    payment_service_access_token,
    ...restOfShop
  } = await shopModel().updateById(shop.id, restOfValidated)
  return restOfShop
}
