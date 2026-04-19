'use strict';

const mongoose = require('mongoose');

const ledgerEntrySchema = new mongoose.Schema(
  {
    journalId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    amountMinor: { type: String, required: true },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      default: null,
      index: true,
    },
    narrative: { type: String, default: '', maxlength: 500 },
  },
  { timestamps: true }
);

ledgerEntrySchema.index({ accountId: 1, createdAt: -1 });

module.exports = mongoose.model('LedgerEntry', ledgerEntrySchema);
