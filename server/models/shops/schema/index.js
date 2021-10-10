'use strict'

import mongoose from 'mongoose'
import Cryptr from 'cryptr'
import config from '../../../config'

const cryptr = new Cryptr(config.get('APP_KEY'))

export const StoreStatusTypes = {
  ACTIVE: 'A',
  DEACTIVATED: 'D'
}

export const Platforms = {
  SHOPIFY: 'shopify'
}

export const SupportedSocialLoginPlatforms = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  DISCORD: 'discord',
  LINKEDIN: 'linkedin',
  YANDEX: 'yandex',
  TWITCH: 'twitch',
  TUMBLR: 'tumblr',
  VK: 'vk',
  FOUR_SQUARE: 'foursquare',
  SLACK: 'slack',
  LINE: 'line',
  GITHUB: 'github',
  REDDIT: 'reddit',
  WORDPRESS: 'wordpress',
  INSTAGRAM: 'instagram'
  // SPOTIFY: 'spotify'
}

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(StoreStatusTypes),
      default: StoreStatusTypes.ACTIVE
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
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
    social_login_with_text: {
      type: Boolean,
      default: false
    },
    social_platforms: {
      type: [String],
      default: [
        SupportedSocialLoginPlatforms.TWITTER,
        SupportedSocialLoginPlatforms.GOOGLE
      ]
    },
    social_platform_status: {
      type: String,
      enum: Object.values(StoreStatusTypes),
      default: StoreStatusTypes.ACTIVE
    },
    social_button_round: {
      type: Boolean,
      default: true
    },
    locale: String,
    plan: {
      price: {
        type: Number,
        default: 0
      },
      name: {
        type: String,
        default: 'Free Plan'
      },
      external_id: String
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
