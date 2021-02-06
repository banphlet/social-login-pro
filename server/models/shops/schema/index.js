'use strict'

import mongoose from 'mongoose'

export const StoreStatusTypes = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated'
}

export const Platforms = {
  WIX: 'wix'
}

export const SocialPlatforms = {
  FACEBOOK: 'facebook'
}

const schema = new mongoose.Schema(
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
      enum: Object.values(Platforms),
      required: true
    },
    external_access_token: {
      type: String,
      required: true
    },
    external_access_secret: {
      type: String
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

schema.virtual('social_accounts', {
  ref: 'SocialAccount',
  localField: '_id',
  foreignField: 'shop',
  justOne: false
})

export default schema
