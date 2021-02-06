'use strict'

import mongoose from 'mongoose'
import Cryptr from 'cryptr'
import config from '../../../config'

const cryptr = new Cryptr(config.get('APP_KEY'))

export const SocialAccountStatus = {
  ACTIVE: 'A',
  DEACTIVATED: 'D'
}

export const SocialPlatforms = {
  FACEBOOK: 'facebook'
}

export const SyncStatus = {
  PUSHED: 'pushed',
  COMPLETED: 'completed',
  PENDING: 'pending',
  ERROR: 'error'
}

const catalogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      index: true
    },
    last_sync_handle: String,
    sync_status: {
      type: String,
      enum: Object.values(SyncStatus),
      default: SyncStatus.PENDING
    },
    error: String,
    status: {
      type: String,
      enum: Object.values(SocialAccountStatus),
      default: SocialAccountStatus.ACTIVE
    }
  },
  {
    _id: false
  }
)

export default new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    catalogs: {
      type: [catalogSchema],
      default: []
    },
    access_token: {
      type: String,
      required: true,
      set: cryptr.encrypt,
      get: cryptr.decrypt
    },
    external_id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    handle: {
      type: String
    },
    platform: {
      type: String,
      enum: Object.values(SocialPlatforms),
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true,
      getters: true
    },
    toObject: {
      virtuals: true,
      getters: true
    }
  }
)
