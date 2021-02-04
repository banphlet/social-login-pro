'use strict'
import joi from 'joi'
import { formatPhoneNumber } from './utils'

export const objectId = () => {
  return joi.string().regex(/^[0-9a-fA-F]{24}$/)
}

export const phoneNumber = () => {
  return joi.string().custom((value, helper) => {
    const phone = formatPhoneNumber(value)
    if (!phone.isValid) return helper.message('phone number is not valid')
    return phone.formatInternational().replace(/\s/gi, '')
  })
}

export default joi
