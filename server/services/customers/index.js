'use strict'

import isAccessRestricted from './is-access-restricted'
import createOrUpdate from './create-or-update'
import getCustomers from './get-customers'

export default function customerService () {
  return Object.assign({}, { isAccessRestricted, createOrUpdate, getCustomers })
}
