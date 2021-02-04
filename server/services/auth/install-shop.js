'use strict'

import joi from '../../lib/joi'
import { validate } from '../../lib/utils'
import { Platforms } from '../../models/shops/schema'

const schema = {
  code: joi.string().required(),
  platform: joi
    .string()
    .valid(...supportedPlatforms())
    .required(),
  instanceId: joi.string().when('platform', {
    is: Platforms.WIX,
    then: joi.required(),
    otherwise: joi.optional()
  })
}

export default function installShop (payload) {
    const validated = validate(payload)
    console.log(validated);
}
