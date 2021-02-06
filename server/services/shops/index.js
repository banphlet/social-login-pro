'use strict'
import * as get from './get'
import * as update from './update'
import * as remove from './remove'

export default function shopService () {
  return Object.assign({}, { ...get, ...update, ...remove })
}
