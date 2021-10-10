'use strict'

import createOrUpdate from './create-or-update'
import getCustomers from './get-customers'
import createOrLogin from './createOrLogin'

export default function customerService () {
  return Object.assign({}, { createOrUpdate, getCustomers, createOrLogin })
}
