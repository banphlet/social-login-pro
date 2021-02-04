'use strict'
import joi, { objectId } from '../../../lib/joi'
import { validate } from '../../../lib/utils'
import { SocialPlatforms } from '../../../models/shops/schema'

const schema = joi.object({
  catalog_id: joi.string().required(),
  access_token: joi.string().required(),
  external_id: joi.string().required(),
  name: joi.string().required(),
  handle: joi.string().required(),
  shop_id: objectId().required(),
  platform: joi
    .string()
    .valid(...Object.values(SocialPlatforms))
    .required()
})

export async function addSocialAccount (payload) {
  const validated = validate(schema, payload)
  console.log(validated)
}
