'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model = mongoose.models.Customer || mongoose.model('Customer', schema)
const CustomerModal = BaseModel(Model)

const customErrorMessage = 'customer does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  CustomerModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  CustomerModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  CustomerModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const getByExternalIdAndPlatform = ({ externalId, platform }) =>
  CustomerModal.ensureExists({
    query: {
      external_id: externalId,
      platform
    }
  })

const updateById = (id, update) =>
  CustomerModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const upsertByExternalIdPlatformAndShopId = (
  { externalId, platform, shopId },
  update = required('update')
) =>
  CustomerModal.upsert({
    query: {
      external_id: externalId,
      platform,
      shop: shopId
    },
    update
  })

const fetchByShopId = shopId =>
  CustomerModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const getByIdAndCatalogs = ({
  id = required('id'),
  catalogId = required('catalogs'),
  shopId = required('shopId')
}) =>
  CustomerModal.ensureExists({
    query: {
      _id: id,
      shop: shopId
    },
    populate: ['shop'],
    select: {
      catalogs: { $elemMatch: { id: catalogId } },
      access_token: 1,
      platform: 1
    }
  })

const updateByCatalogIdAndCustomer = ({
  catalogId = required('catalogId'),
  id = required('id'),
  update = {}
}) =>
  CustomerModal.updateOne({
    query: {
      'catalogs.id': catalogId,
      _id: id
    },
    update
  })

const removeCatalogById = ({ CustomerId, catalogId, shopId }) =>
  CustomerModal.updateOne({
    query: {
      _id: CustomerId,
      shop: shopId,
      'catalogs.id': catalogId
    },
    update: {
      $pull: { catalogs: { id: catalogId } }
    }
  })

export default () => ({
  ...CustomerModal,
  removeCatalogById,
  create,
  getByEmail,
  getById,
  updateById,
  upsertByExternalIdPlatformAndShopId,
  getByExternalIdAndPlatform,
  fetchByShopId,
  getByIdAndCatalogs,
  updateByCatalogIdAndCustomer
})
