'use strict'

import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { customers as customerModel } from '../../../models'

const schema = joi.object({
  shop_id: objectId().required(),
  page: joi.number().default(1),
  limit: joi.number().default(10),
  is_blocked: joi.boolean()
})

export default async function getCustomers (payload) {
  const validated = validate(schema, payload)
  const customers = await customerModel().paginateByShopId({
    shopId: validated.shop_id,
    page: validated.page,
    limit: validated?.limit,
    isBlocked: validated.is_blocked
  })
  return customers
}
