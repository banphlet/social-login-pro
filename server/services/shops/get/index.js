'use strict'

import { required } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'
import { ModeOfPayment } from '../../../models/orders/schema'
import { getServices } from '../../../lib/payments'
import { startCase } from 'lodash'

export async function getByPaymentServiceId (
  paymentServiceId = required('paymentServiceId')
) {
  const { _id, __v, ...restOfShop } = await shopModel().getByPaymentServiceId(
    paymentServiceId
  )
  return restOfShop
}

export const getById = async (id = required('id')) => {
  const { _id, __v, ...restOfShop } = await shopModel().getById(id)
  return restOfShop
}

export const getByHandle = async (handle = required('handle')) => {
  const {
    _id,
    __v,
    payment_service_refresh_token,
    payment_service_access_token,
    notification,
    id_tracker,
    ...restOfShop
  } = await shopModel().getByHandle(handle)
  return restOfShop
}

export const getPaymentServices = async (
  paymentServiceId = required('paymentServiceId')
) => {
  const { _id, __v, ...restOfShop } = await shopModel().getByPaymentServiceId(
    paymentServiceId
  )
  const payments = await getServices({
    accessToken: restOfShop.payment_service_access_token,
    refreshToken: restOfShop.payment_service_refresh_token
  })
  const providers = payments.data
    ?.filter(payment => payment.is_top_up_provider)
    .map(provider => ({
      id: provider.id,
      name: provider.name,
      provider: provider.provider,
      type: ModeOfPayment.DIGIDUKA_MOBILE_MONEY
    }))
    .concat([
      {
        id: ModeOfPayment.BANK,
        name: startCase(ModeOfPayment.BANK),
        type: ModeOfPayment.BANK
      },
      {
        id: ModeOfPayment.CASH_ON_DELIVERY,
        name: startCase(ModeOfPayment.CASH_ON_DELIVERY),
        type: ModeOfPayment.CASH_ON_DELIVERY
      }
    ])

  return providers
}
