'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model =
  mongoose.models.SocialAccount || mongoose.model('SocialAccount', schema)
const SocialAccountModal = BaseModel(Model)

const customErrorMessage = 'social account does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  SocialAccountModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  SocialAccountModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  SocialAccountModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const getByExternalIdAndPlatform = ({ externalId, platform }) =>
  SocialAccountModal.ensureExists({
    query: {
      external_id: externalId,
      platform
    }
  })

const updateById = (id, update) =>
  SocialAccountModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const upsertByExternalIdPlatformAndShopId = (
  { externalId, platform, shopId },
  update = required('update')
) =>
  SocialAccountModal.upsert({
    query: {
      external_id: externalId,
      platform,
      shop: shopId
    },
    update
  })

const fetchByShopId = shopId =>
  SocialAccountModal.fetch({
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
  SocialAccountModal.ensureExists({
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

const updateByCatalogIdAndSocialAccount = ({
  catalogId = required('catalogId'),
  id = required('id'),
  update = {}
}) =>
  SocialAccountModal.updateOne({
    query: {
      'catalogs.id': catalogId,
      _id: id
    },
    update
  })

const removeCatalogById = ({ socialAccountId, catalogId, shopId }) =>
  SocialAccountModal.updateOne({
    query: {
      _id: socialAccountId,
      shop: shopId,
      'catalogs.id': catalogId
    },
    update: {
      $pull: { catalogs: { id: catalogId } }
    }
  })

export default () => ({
  ...SocialAccountModal,
  removeCatalogById,
  create,
  getByEmail,
  getById,
  updateById,
  upsertByExternalIdPlatformAndShopId,
  getByExternalIdAndPlatform,
  fetchByShopId,
  getByIdAndCatalogs,
  updateByCatalogIdAndSocialAccount
})
