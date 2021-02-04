'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    paid_on: Date,
    expires_on: Date,
    payment_reference: String
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
