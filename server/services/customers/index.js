'use strict'

import isAccessRestricted from './is-access-restricted'
import createOrUpdate from './create-or-update'

export default function customerService () {
  return Object.assign({}, { isAccessRestricted, createOrUpdate })
}
