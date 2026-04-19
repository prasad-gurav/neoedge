'use strict';

const express = require('express');
const mongoose = require('mongoose');

const requestIdMiddleware = require('./middleware/request-id.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const userRoutes = require('./routes/user.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');
const ledgerRoutes = require('./routes/ledger.routes');

const app = express();

app.use(express.json({ limit: '256kb' }));
app.use(requestIdMiddleware);

app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const db =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.json({ ok: true, service: 'neoedge', db });
});

const apiV1 = express.Router();
apiV1.use('/users', userRoutes);
apiV1.use('/accounts', accountRoutes);
apiV1.use('/transactions', transactionRoutes);
apiV1.use('/ledger', ledgerRoutes);

app.use('/api/v1', apiV1);

app.use(errorMiddleware);

module.exports = app;
