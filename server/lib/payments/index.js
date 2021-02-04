'use strict'

import config from '../../config'
import request from '../request'
import { required } from '../utils'

const paymentRequestWrapper = request.extend({
  prefixUrl: `${config.get('PAYMENT_API_URL')}/v1`,
  responseType: 'json'
})

export const getUser = (token = required('token')) =>
  paymentRequestWrapper
    .get('users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => response.body)

export const getServices = ({
  accessToken = required('accessToken'),
  refreshToken = required('refreshToken')
}) =>
  paymentRequestWrapper
    .get('services', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      context: { accessToken, refreshToken }
    })
    .then(response => response.body)

export const makePaymentRequest = async ({
  phoneNumber = required('phoneNumber'),
  amount = required('amount'),
  userId = required('userId'),
  accessToken,
  refreshToken,
  serviceId
}) =>
  paymentRequestWrapper
    .post('wallets/top_up', {
      json: {
        phone_number: phoneNumber,
        amount,
        source: 'shop',
        user_id: userId,
        is_buy_goods: true,
        payment_service_id: serviceId
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      context: { accessToken, refreshToken }
    })
    .then(response => response.body)
