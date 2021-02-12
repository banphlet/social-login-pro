'use strict'

import mongoose from 'mongoose'
import Cryptr from 'cryptr'
import config from '../../../config'

const cryptr = new Cryptr(config.get('APP_KEY'))

export const StoreStatusTypes = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated'
}

export const Platforms = {
  SHOPIFY: 'shopify'
}

export const LimitBy = {
  IP: 'ip',
  EMAIL: 'email'
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
    platform_domain: {
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
      required: true,
      set: cryptr.encrypt,
      get: cryptr.decrypt
    },
    locale: {
      type: String,
      default: 'en'
    },
    limit_by: {
      type: String,
      enum: Object.values(LimitBy),
      default: LimitBy.IP
    },
    attempts: {
      type: Number,
      default: 3
    },
    duration: {
      type: Number,
      default: 10
    },
    banner_message: {
      type: String,
      default:
        'Too many login attempts. Login blocked temporary. Try again later'
    },
    text_color: {
      type: String,
      default: 'white'
    },
    background_color: {
      type: String,
      default: '#B74949'
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

export default schema
