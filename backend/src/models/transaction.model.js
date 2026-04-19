'use strict';

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    fromAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
    toAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true,
    },
    amountMinor: { type: String, required: true },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    status: {
      type: String,
      enum: ['CREATED', 'POSTED', 'FAILED'],
      default: 'CREATED',
    },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    failureReason: { type: String, default: '' },
    journalId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
