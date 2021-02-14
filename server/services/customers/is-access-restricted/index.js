'use strict'

import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { customers, shops } from '../../../models'
import moment from 'moment'
import { StoreStatusTypes } from '../../../models/shops/schema'

const schema = joi
  .object({
    shop_id: objectId().required(),
    ip: joi.string().ip(),
    email: joi.string().email()
  })
  .or('ip', 'email')

export default async function isAccessRestricted (payload) {
  const validated = validate(schema, payload)
  const shop = await shops().getById(validated.shop_id)
  let customer = await customers().getBasedOnCriteria({
    shopId: validated.shop_id,
    field: shop.limit_by,
    value: validated[shop.limit_by]
  })

  if (!customer || shop.status === StoreStatusTypes.DEACTIVATED)
    return {
      is_restricted: false
    }

  let payloadToUpsert = {}

  if (customer.attempts >= shop.attempts) {
    if (!customer.unblock_date) {
      payloadToUpsert = {
        is_blocked: true,
        unblock_date: moment()
          .add(shop.duration, 'minutes')
          .toDate()
      }
    } else {
      const isDateExpired = moment().isAfter(customer.unblock_date)
      if (isDateExpired) {
        payloadToUpsert = {
          attempts: 1
        }
      }
    }
  } else {
    payloadToUpsert = {
      is_blocked: false,
      unblock_date: null
    }
  }

  customer = await customers().updateById(customer.id, payloadToUpsert)

  return {
    is_restricted:
      shop.status === 'A' && moment().isBefore(customer.unblock_date),
    attempts: customer.attempts,
    message: shop.banner_message,
    text_color: shop.text_color,
    background_color: shop.background_color
  }
}
