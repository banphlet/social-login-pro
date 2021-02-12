'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    ip: String,
    email: String,
    is_blocked: {
      type: Boolean,
      default: false
    },
    unblock_date: Date,
    attempts: {
      type: Number,
      default: 1
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
