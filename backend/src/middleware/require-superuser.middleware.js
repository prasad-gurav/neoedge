'use strict';

const mongoose = require('mongoose');
const User = require('../models/user.model');
const AppError = require('../utils/app-error');

async function requireSuperuser(req, _res, next) {
  try {
    const userId = String(req.header('x-user-id') || '').trim();
    if (!userId) {
      throw new AppError('Missing x-user-id header', 401, 'UNAUTHENTICATED');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid x-user-id header', 401, 'UNAUTHENTICATED');
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      throw new AppError('User not found', 401, 'UNAUTHENTICATED');
    }
    if (user.status !== 'ACTIVE') {
      throw new AppError('User is not active', 403, 'ACCOUNT_NOT_ACTIVE');
    }
    if (!user.isSuperuser) {
      throw new AppError('Superuser privileges required', 403, 'FORBIDDEN');
    }

    req.superuser = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
    };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requireSuperuser;
