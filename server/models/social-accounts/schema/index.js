'use strict'

import mongoose from 'mongoose'

export const SocialAccountStatus = {
  ACTIVE: 'active',
  DEACTIVATED: 'deactivated'
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
    error: String
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
    status: {
      type: String,
      enum: Object.values(SocialAccountStatus),
      d: SocialAccountStatus.ACTIVE
    },
    catalogs: {
      type: [catalogSchema],
      default: []
    },
    access_token: {
      type: String,
      required: true
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
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)
