'use strict';

const Account = require('../models/account.model');
const User = require('../models/user.model');
const AppError = require('../utils/app-error');

async function create(req, res) {
  const userId = String(req.body?.userId ?? '');
  const currency = String(req.body?.currency ?? '').trim().toUpperCase();
  if (!userId || currency.length !== 3) {
    throw new AppError('userId and currency (ISO 4217) are required', 400, 'VALIDATION');
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  const accountType = req.body?.accountType === 'SAVINGS' ? 'SAVINGS' : 'CHECKING';

  try {
    const account = await Account.create({
      userId,
      currency,
      accountType,
    });
    res.status(201).json({
      id: account._id.toString(),
      userId: account.userId.toString(),
      currency: account.currency,
      accountType: account.accountType,
      status: account.status,
      createdAt: account.createdAt,
    });
  } catch (err) {
    if (err && typeof err === 'object' && err.code === 11000) {
      throw new AppError('Account already exists for this user and currency', 409, 'DUPLICATE_ACCOUNT');
    }
    throw err;
  }
}

async function getById(req, res) {
  const account = await Account.findById(req.params.id).lean();
  if (!account) {
    throw new AppError('Account not found', 404, 'NOT_FOUND');
  }
  res.json({
    id: account._id.toString(),
    userId: account.userId.toString(),
    currency: account.currency,
    accountType: account.accountType,
    status: account.status,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  });
}

async function listByUser(req, res) {
  const { userId } = req.params;
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  const rows = await Account.find({ userId, isSystem: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
  res.json({
    data: rows.map((a) => ({
      id: a._id.toString(),
      userId: a.userId.toString(),
      currency: a.currency,
      accountType: a.accountType,
      status: a.status,
      createdAt: a.createdAt,
    })),
  });
}

module.exports = {
  create,
  getById,
  listByUser,
};
