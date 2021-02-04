'use strict'
import { isNil } from 'lodash'
import { makeSure, validate } from '../../../lib/utils'
import schema from './schema'
import { shops as shopModel } from '../../../models'
import errors from '../../../lib/errors'

const ensureShopDoesNotExist = makeSure(
  ({ payment_user_id: paymentUserId, handle }) =>
    shopModel()
      .get({ query: { $or: [{ payment_user_id: paymentUserId }, { handle }] } })
      .then(isNil),
  _ =>
    errors.throwError({
      name: errors.UserAlreadyExistsError,
      message: 'shop already exists'
    })
)

export default async function create (payload) {
  const validated = validate(schema, payload)
  await ensureShopDoesNotExist(validated)
  const {
    _id,
    __v,
    payment_service_refresh_token,
    payment_service_access_token,
    ...restOfShop
  } = await shopModel().create(validated)
  return restOfShop
}
