'use strict';

const mongoose = require('mongoose');
const AppError = require('../utils/app-error');
const LedgerEntry = require('../models/ledger.model');

async function getBalanceMinor(accountId, session = null) {
  const q = LedgerEntry.find({ accountId }).select('amountMinor').lean();
  if (session) q.session(session);
  const rows = await q.exec();
  return rows.reduce((acc, row) => acc + BigInt(String(row.amountMinor)), 0n);
}

async function postBalancedJournal(input) {
  let sum = 0n;
  for (const line of input.lines) {
    sum += line.amountMinor;
  }
  if (sum !== 0n) {
    throw new AppError('Ledger lines must net to zero', 400, 'UNBALANCED_JOURNAL');
  }

  const journalId = new mongoose.Types.ObjectId();
  const docs = input.lines.map((line) => ({
    journalId,
    accountId: line.accountId,
    amountMinor: line.amountMinor.toString(),
    currency: input.currency,
    transactionId: input.transactionId ?? null,
    narrative: input.narrative ?? '',
  }));

  await LedgerEntry.insertMany(docs, { session: input.session });
  return journalId;
}

module.exports = {
  getBalanceMinor,
  postBalancedJournal,
};
