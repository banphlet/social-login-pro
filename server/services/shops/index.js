'use strict'
import * as get from './get'
import * as update from './update'

export default function shopService () {
  return Object.assign({}, { ...get, ...update })
}
