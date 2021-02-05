'use strict'

import joi, { objectId } from '../../lib/joi'
import { validate } from '../../lib/utils'
import { socialAccount } from '../../models'

const schema = joi.object({
  catalogs: joi
    .array()
    .items(joi.string().required())
    .required(),
  id: objectId().required()
})

export default async function syncCatalogs (payload) {
  const validated = validate(schema, payload)
  const account = await socialAccount().getByIdAndCatalogs(validated)
  console.log(account)
}
