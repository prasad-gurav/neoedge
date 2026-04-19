'use strict';

const mongoose = require('mongoose');
const LedgerEntry = require('../models/ledger.model');
const Account = require('../models/account.model');
const { getBalanceMinor } = require('../services/ledger.service');
const AppError = require('../utils/app-error');

async function getBalance(req, res) {
  const { accountId } = req.params;
  const acc = await Account.findById(accountId).lean();
  if (!acc) {
    throw new AppError('Account not found', 404, 'NOT_FOUND');
  }
  const balanceMinor = (
    await getBalanceMinor(new mongoose.Types.ObjectId(accountId))
  ).toString();
  res.json({
    accountId,
    currency: acc.currency,
    balanceMinor,
  });
}

async function listEntries(req, res) {
  const { accountId } = req.params;
  const acc = await Account.findById(accountId).lean();
  if (!acc) {
    throw new AppError('Account not found', 404, 'NOT_FOUND');
  }
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const entries = await LedgerEntry.find({ accountId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({
    data: entries.map((e) => ({
      id: e._id.toString(),
      journalId: e.journalId.toString(),
      accountId: e.accountId.toString(),
      amountMinor: e.amountMinor,
      currency: e.currency,
      transactionId: e.transactionId ? e.transactionId.toString() : null,
      narrative: e.narrative,
      createdAt: e.createdAt,
    })),
  });
}

module.exports = {
  getBalance,
  listEntries,
};
