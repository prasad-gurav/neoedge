'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');
const AppError = require('../utils/app-error');
const { parseMinorUnits } = require('../utils/parse-amount');
const { withTransaction } = require('../utils/db-transaction');
const { postBalancedJournal } = require('../services/ledger.service');

function isDuplicateKey(err) {
  return Boolean(err && typeof err === 'object' && err.code === 11000);
}

async function ensureTreasuryAccount(superuserId, currency, session) {
  const query = {
    userId: superuserId,
    currency,
    accountType: 'TREASURY',
    isSystem: true,
  };
  let treasury = await Account.findOne(query).session(session);
  if (treasury) return treasury;

  const [created] = await Account.create(
    [
      {
        userId: superuserId,
        currency,
        accountType: 'TREASURY',
        status: 'ACTIVE',
        isSystem: true,
      },
    ],
    { session }
  );
  return created;
}

async function bootstrapSuperuser(req, res) {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  if (!email) {
    throw new AppError('email is required', 400, 'VALIDATION');
  }

  const existing = await User.findOne({ isSuperuser: true }).lean();
  if (existing) {
    throw new AppError(
      'A superuser already exists; use a privileged endpoint to add more',
      409,
      'SUPERUSER_EXISTS'
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  user.isSuperuser = true;
  await user.save();

  res.status(200).json({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    isSuperuser: user.isSuperuser,
  });
}

async function createDeposit(req, res) {
  const idempotencyKey = String(req.body?.idempotencyKey ?? '').trim();
  const toAccountId = String(req.body?.toAccountId ?? '').trim();
  const currency = String(req.body?.currency ?? '').trim().toUpperCase();
  const narrative = String(req.body?.narrative ?? 'Treasury deposit').slice(0, 500);

  if (!idempotencyKey || !toAccountId || currency.length !== 3) {
    throw new AppError(
      'idempotencyKey, toAccountId, and currency are required',
      400,
      'VALIDATION'
    );
  }
  if (!mongoose.Types.ObjectId.isValid(toAccountId)) {
    throw new AppError('Invalid toAccountId', 400, 'VALIDATION');
  }

  const amountMinor = parseMinorUnits(req.body?.amountMinor);
  if (amountMinor <= 0n) {
    throw new AppError('amountMinor must be positive', 400, 'INVALID_AMOUNT');
  }

  const superuserId = new mongoose.Types.ObjectId(req.superuser.id);

  try {
    const result = await withTransaction(async (session) => {
      const existing = await Transaction.findOne({ idempotencyKey }).session(session);
      if (existing) {
        return { replayed: true, doc: existing };
      }

      const toId = new mongoose.Types.ObjectId(toAccountId);
      const target = await Account.findById(toId).session(session);
      if (!target) {
        throw new AppError('Target account not found', 404, 'NOT_FOUND');
      }
      if (target.currency !== currency) {
        throw new AppError(
          'Target account currency does not match payload',
          400,
          'CURRENCY_MISMATCH'
        );
      }
      if (target.status !== 'ACTIVE') {
        throw new AppError('Target account must be ACTIVE', 409, 'ACCOUNT_NOT_ACTIVE');
      }
      if (target.isSystem) {
        throw new AppError(
          'Cannot deposit into a system account',
          400,
          'INVALID_TARGET'
        );
      }

      const treasury = await ensureTreasuryAccount(superuserId, currency, session);

      const [txn] = await Transaction.create(
        [
          {
            fromAccountId: treasury._id,
            toAccountId: toId,
            amountMinor: amountMinor.toString(),
            currency,
            status: 'CREATED',
            idempotencyKey,
          },
        ],
        { session }
      );

      const journalId = await postBalancedJournal({
        session,
        currency,
        transactionId: txn._id,
        narrative,
        lines: [
          { accountId: treasury._id, amountMinor: -amountMinor },
          { accountId: toId, amountMinor },
        ],
      });

      txn.journalId = journalId;
      txn.status = 'POSTED';
      await txn.save({ session });
      return { replayed: false, doc: txn };
    });

    const { doc, replayed } = result;
    res.status(replayed ? 200 : 201).json({
      id: doc._id.toString(),
      fromAccountId: doc.fromAccountId.toString(),
      toAccountId: doc.toAccountId.toString(),
      amountMinor: doc.amountMinor,
      currency: doc.currency,
      status: doc.status,
      journalId: doc.journalId ? doc.journalId.toString() : null,
      idempotencyKey: doc.idempotencyKey,
      replayed,
    });
  } catch (err) {
    if (isDuplicateKey(err)) {
      const doc = await Transaction.findOne({ idempotencyKey }).lean();
      if (doc) {
        res.status(200).json({
          id: doc._id.toString(),
          fromAccountId: doc.fromAccountId.toString(),
          toAccountId: doc.toAccountId.toString(),
          amountMinor: doc.amountMinor,
          currency: doc.currency,
          status: doc.status,
          journalId: doc.journalId ? doc.journalId.toString() : null,
          idempotencyKey: doc.idempotencyKey,
          replayed: true,
        });
        return;
      }
    }
    throw err;
  }
}

module.exports = {
  bootstrapSuperuser,
  createDeposit,
};
