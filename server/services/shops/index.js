'use strict'
import create from './create'
import * as get from './get'
import update from './update'

export default function shopService () {
  return Object.assign({}, { create, update, ...get })
}
