'use strict';

const mongoose = require('mongoose');
const AppError = require('../utils/app-error');

module.exports = function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      requestId: req.requestId,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details,
      requestId: req.requestId,
    });
    return;
  }

  if (err && typeof err === 'object' && err.code === 11000) {
    res.status(409).json({
      error: 'Resource already exists',
      code: 'DUPLICATE_KEY',
      requestId: req.requestId,
    });
    return;
  }

  console.error('[unhandled]', req.requestId, err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL',
    requestId: req.requestId,
  });
};
