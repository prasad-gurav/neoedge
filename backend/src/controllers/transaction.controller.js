'use strict';

const mongoose = require('mongoose');
const Transaction = require('../models/transaction.model');
const Account = require('../models/account.model');
const AppError = require('../utils/app-error');
const { parseMinorUnits } = require('../utils/parse-amount');
const { withTransaction } = require('../utils/db-transaction');
const { getBalanceMinor, postBalancedJournal } = require('../services/ledger.service');

function isDuplicateKey(err) {
  return Boolean(err && typeof err === 'object' && err.code === 11000);
}

async function createTransfer(req, res) {
  const idempotencyKey = String(req.body?.idempotencyKey ?? '');
  const fromAccountId = String(req.body?.fromAccountId ?? '');
  const toAccountId = String(req.body?.toAccountId ?? '');
  const currency = String(req.body?.currency ?? '').trim().toUpperCase();

  if (!idempotencyKey || !fromAccountId || !toAccountId || currency.length !== 3) {
    throw new AppError(
      'idempotencyKey, fromAccountId, toAccountId, and currency are required',
      400,
      'VALIDATION'
    );
  }

  const amountMinor = parseMinorUnits(req.body?.amountMinor);
  if (amountMinor <= 0n) {
    throw new AppError('amountMinor must be positive', 400, 'INVALID_AMOUNT');
  }
  if (fromAccountId === toAccountId) {
    throw new AppError('fromAccountId and toAccountId must differ', 400, 'SAME_ACCOUNT');
  }

  try {
    const result = await withTransaction(async (session) => {
      const existing = await Transaction.findOne({ idempotencyKey }).session(session);
      if (existing) {
        return { replayed: true, doc: existing };
      }

      const fromId = new mongoose.Types.ObjectId(fromAccountId);
      const toId = new mongoose.Types.ObjectId(toAccountId);

      const [from, to] = await Promise.all([
        Account.findById(fromId).session(session),
        Account.findById(toId).session(session),
      ]);
      if (!from || !to) {
        throw new AppError('Account not found', 404, 'NOT_FOUND');
      }
      if (from.currency !== currency || to.currency !== currency) {
        throw new AppError('Account currency does not match payload', 400, 'CURRENCY_MISMATCH');
      }
      if (from.status !== 'ACTIVE' || to.status !== 'ACTIVE') {
        throw new AppError('Both accounts must be ACTIVE', 409, 'ACCOUNT_NOT_ACTIVE');
      }

      const [txn] = await Transaction.create(
        [
          {
            fromAccountId: fromId,
            toAccountId: toId,
            amountMinor: amountMinor.toString(),
            currency,
            status: 'CREATED',
            idempotencyKey,
          },
        ],
        { session }
      );

      const balance = await getBalanceMinor(fromId, session);
      if (balance < amountMinor) {
        txn.status = 'FAILED';
        txn.failureReason = 'INSUFFICIENT_FUNDS';
        await txn.save({ session });
        return { replayed: false, doc: txn };
      }

      const journalId = await postBalancedJournal({
        session,
        currency,
        transactionId: txn._id,
        narrative: 'Book transfer',
        lines: [
          { accountId: fromId, amountMinor: -amountMinor },
          { accountId: toId, amountMinor },
        ],
      });

      txn.journalId = journalId;
      txn.status = 'POSTED';
      await txn.save({ session });
      return { replayed: false, doc: txn };
    });

    const { doc, replayed } = result;
    const httpStatus = replayed ? 200 : 201;
    res.status(httpStatus).json({
      id: doc._id.toString(),
      status: doc.status,
      failureReason: doc.failureReason || undefined,
      journalId: doc.journalId ? doc.journalId.toString() : null,
      replayed,
    });
  } catch (err) {
    if (isDuplicateKey(err)) {
      const doc = await Transaction.findOne({ idempotencyKey }).lean();
      if (doc) {
        res.status(200).json({
          id: doc._id.toString(),
          status: doc.status,
          failureReason: doc.failureReason || undefined,
          journalId: doc.journalId ? doc.journalId.toString() : null,
          replayed: true,
        });
        return;
      }
    }
    throw err;
  }
}

async function getById(req, res) {
  const doc = await Transaction.findById(req.params.id).lean();
  if (!doc) {
    throw new AppError('Transaction not found', 404, 'NOT_FOUND');
  }
  res.json({
    id: doc._id.toString(),
    fromAccountId: doc.fromAccountId.toString(),
    toAccountId: doc.toAccountId.toString(),
    amountMinor: doc.amountMinor,
    currency: doc.currency,
    status: doc.status,
    failureReason: doc.failureReason || undefined,
    journalId: doc.journalId ? doc.journalId.toString() : null,
    idempotencyKey: doc.idempotencyKey,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

async function listForAccount(req, res) {
  const { accountId } = req.params;
  const acc = await Account.findById(accountId).lean();
  if (!acc) {
    throw new AppError('Account not found', 404, 'NOT_FOUND');
  }
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const rows = await Transaction.find({
    $or: [{ fromAccountId: accountId }, { toAccountId: accountId }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.json({
    data: rows.map((t) => ({
      id: t._id.toString(),
      fromAccountId: t.fromAccountId.toString(),
      toAccountId: t.toAccountId.toString(),
      amountMinor: t.amountMinor,
      currency: t.currency,
      status: t.status,
      createdAt: t.createdAt,
    })),
  });
}

module.exports = {
  createTransfer,
  getById,
  listForAccount,
};
