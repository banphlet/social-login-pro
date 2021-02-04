'use strict'
import joi from '../../../lib/joi'
import { ModeOfPayment } from '../../../models/orders/schema'

export default joi.object({
  payment_user_id: joi
    .string()
    .guid()
    .required(),
  name: joi.string(),
  logo_url: joi.string().uri(),
  contact: {
    phone_number: joi.string(),
    email: joi.string(),
    whatsapp_number: joi.string(),
    facebook_handle: joi.string(),
    instagram_handle: joi.string()
  },
  notification: {
    email: joi.string(),
    phone_number: joi.string(),
    status: joi.boolean()
  },
  custom_domain: joi.string().uri(),
  storefront: {
    visibility: joi.boolean(),
    theme: joi.string(),
    primary_colour: joi.string(),
    secondary_colour: joi.string()
  },
  payment_services: joi.array().items(
    joi.object({
      id: joi.any().required(),
      name: joi.string().required(),
      provider: joi.string(),
      type: joi
        .string()
        .required()
        .valid(...Object.values(ModeOfPayment))
    })
  )
})
