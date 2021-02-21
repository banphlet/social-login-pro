'use strict'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'
import { LimitBy, StoreStatusTypes } from '../../../models/shops/schema'

const schema = joi.object({
  shop_id: objectId().required(),
  limit_by: joi.string().valid(...Object.values(LimitBy)),
  attempts: joi.number(),
  banner_message: joi.string(),
  duration: joi.number(),
  text_color: joi.string(),
  background_color: joi.string(),
  status: joi.string().valid(...Object.values(StoreStatusTypes)),
  blacklisted_ips: joi.array().items(joi.string()),
  social_button_round: joi.boolean(),
  social_platform_status: joi.string().valid(...Object.values(StoreStatusTypes)),
  social_platforms: joi.array().items(joi.string().valid('google', 'facebook', 'twitter')),
  social_login_with_text: joi.boolean()
})

export const updateShopById = async payload => {
  const validated = validate(schema, payload)

  const {
    external_access_token,
    __v,
    _id,
    ...shop
  } = await shopModel().updateById(validated.shop_id, validated)
  return shop
}
