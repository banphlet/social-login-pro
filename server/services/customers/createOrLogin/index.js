'use strict'
import { propEq } from 'lodash/fp'
import platforms from '../../platforms'
import { createMd5Hash } from '../../../lib/utils'
import { shops as shopModel } from '../../../models'

const customerAlreadyExists = body =>
  (body?.errors?.email || []).every(item =>
    /has already been taken/gi.test(item)
  )

const createOrUpdateCustomerIfNotAvailable = (shop, customer) =>
  platforms(shop.platform)
    .createCustomer({
      accessToken: shop.external_access_token,
      platformDomain: shop.platform_domain,
      customer
    })
    .catch(error => {
      const isCustomerAlreadyExists = customerAlreadyExists(
        error.response?.body
      )
      if (isCustomerAlreadyExists)
        return platforms(shop.platform).updateCustomerPassword({
          accessToken: shop.external_access_token,
          platformDomain: shop.platform_domain,
          ...customer
        })
      throw error
    })

export default async function createOrLogin ({ profile, shopId }) {
  const shop = await shopModel().getById(shopId)
  const password = createMd5Hash(profile.email)
  const customerToCreate = {
    ...profile,
    first_name: profile?.name?.split(' ')[0],
    last_name: profile?.name?.split(' ')[1],
    password: password,
    password_confirmation: password,
    send_email_welcome: false,
    verified_email: true
  }

  await createOrUpdateCustomerIfNotAvailable(shop, customerToCreate)
  return {
    email: profile.email,
    password,
    domain: shop.domain
  }
}
