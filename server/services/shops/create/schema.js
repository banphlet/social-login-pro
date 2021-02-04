'use strict'
import joi from '../../../lib/joi'

export default joi.object({
  name: joi.string().required(),
  payment_user_id: joi
    .string()
    .guid()
    .required(),
  handle: joi.string().required(),
  country: joi.string().required(),
  currency: joi.string().required(),
  logo_url: joi.string(),
  contact: {
    phone_number: joi.string(),
    email: joi.string(),
    whatsapp_number: joi.string(),
    facebook_handle: joi.string(),
    instagram_handle: joi.string()
  },
  notification: {
    email: joi.string(),
    phone_number: joi.string()
  },
  payment_service_access_token: joi.string().required(),
  payment_service_refresh_token: joi.string().required()
})
