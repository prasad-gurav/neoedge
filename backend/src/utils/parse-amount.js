'use strict';

const AppError = require('./app-error');

function parseMinorUnits(raw) {
  if (typeof raw === 'bigint') {
    if (raw < 0n) throw new AppError('Amount must be non-negative', 400, 'INVALID_AMOUNT');
    return raw;
  }
  if (typeof raw === 'number') {
    if (!Number.isInteger(raw) || raw < 0 || !Number.isFinite(raw)) {
      throw new AppError('amountMinor must be a non-negative integer', 400, 'INVALID_AMOUNT');
    }
    return BigInt(raw);
  }
  const s = String(raw ?? '').trim();
  if (!/^\d+$/.test(s)) {
    throw new AppError('amountMinor must be digits only (minor units)', 400, 'INVALID_AMOUNT');
  }
  return BigInt(s);
}

module.exports = { parseMinorUnits };
