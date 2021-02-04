'use strict'

import mongoose from 'mongoose'
import planSchema from './plan'
import { ModeOfPayment } from '../../../models/orders/schema/enum'

export const StoreStatusTypes = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated'
}

export const Platforms = {
  WIX: 'wix'
}

export default new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true
    },
    external_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      index: true,
      sparse: true
    },
    platform: {
      type: String,
      enum: Object.values(Platforms)
    },
    external_access_token: {
      type: String,
      required: true
    },
    external_access_secret: {
      type: String,
      required: function () {
        return this.platform === Platforms.WIX
      }
    },
    facebook_catalog_id: String,
    facebook_user_access_token: String,
    facebook_user_name: String,
    facebook_handle: String,
    last_facebook_sync_handle: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)
