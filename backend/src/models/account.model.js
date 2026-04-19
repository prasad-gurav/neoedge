'use strict';

const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    accountType: {
      type: String,
      enum: ['CHECKING', 'SAVINGS'],
      default: 'CHECKING',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'FROZEN', 'CLOSED'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

accountSchema.index({ userId: 1, currency: 1 }, { unique: true });

module.exports = mongoose.model('Account', accountSchema);
