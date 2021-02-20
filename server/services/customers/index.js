'use strict'

import isAccessRestricted from './is-access-restricted'
import createOrUpdate from './create-or-update'
import getCustomers from './get-customers'
import createOrLogin from './createOrLogin'

export default function customerService() {
  return Object.assign({}, { isAccessRestricted, createOrUpdate, getCustomers, createOrLogin })
}
