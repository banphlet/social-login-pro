'use strict'

import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { customers, shops } from '../../../models'

const schema = joi
  .object({
    shop_id: objectId().required(),
    ip: joi.string().ip(),
    email: joi
      .string()
      .allow(null),
    geo_location: joi.object().required()
  })
  .or('ip', 'email')

export default async function createOrUpdate(payload) {
  const validated = validate(schema, payload)
  const shop = await shops().getById(validated.shop_id)
  const customer = await customers().createOrUpdate({
    shopId: shop.id,
    ...validated
  })
  return customer
}
