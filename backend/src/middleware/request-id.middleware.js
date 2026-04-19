'use strict';

const { randomUUID } = require('crypto');

module.exports = function requestIdMiddleware(req, res, next) {
  const header = req.headers['x-request-id'];
  const id = typeof header === 'string' && header.length > 0 ? header : randomUUID();
  req.requestId = id;
  res.setHeader('x-request-id', id);
  next();
};
