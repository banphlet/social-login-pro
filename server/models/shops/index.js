'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model = mongoose.models.Shop || mongoose.model('Shop', schema)
const ShopModel = BaseModel(Model)

const customErrorMessage = 'shop does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  ShopModel.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  ShopModel.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  ShopModel.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })


const updateById = (id, update) =>
  ShopModel.updateOne({
    query: {
      _id: id
    },
    update
  })

export default () => ({
  ...ShopModel,
  create,
  getByEmail,
  getById,
  updateById
})
