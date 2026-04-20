'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const AppError = require('../utils/app-error');
const emailService = require('../services/email.service');

async function register(req, res) {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  const fullName = String(req.body?.fullName ?? '').trim();
  if (!email || !password || !fullName) {
    throw new AppError('email, password, and fullName are required', 400, 'VALIDATION');
  }
  if (password.length < 8) {
    throw new AppError('password must be at least 8 characters', 400, 'VALIDATION');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, fullName });

  await emailService.sendWelcomeEmail({ to: email, fullName });

  res.status(201).json({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    isSuperuser: user.isSuperuser,
    createdAt: user.createdAt,
  });
}

async function login(req, res) {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');
  if (!email || !password) {
    throw new AppError('email and password are required', 400, 'VALIDATION');
  }

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }
  if (user.status !== 'ACTIVE') {
    throw new AppError('Account is not active', 403, 'ACCOUNT_NOT_ACTIVE');
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  res.json({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    isSuperuser: user.isSuperuser,
    createdAt: user.createdAt,
  });
}

async function getById(req, res) {
  const user = await User.findById(req.params.id).select('-passwordHash').lean();
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  res.json({
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    isSuperuser: user.isSuperuser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

module.exports = {
  register,
  login,
  getById,
};
