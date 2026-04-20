'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const env = require('./config/env');
const requestIdMiddleware = require('./middleware/request-id.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const userRoutes = require('./routes/user.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');
const ledgerRoutes = require('./routes/ledger.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

const allowedOrigins = env.corsOrigins.length
	? env.corsOrigins
	: [
			'http://localhost:5173',
			'http://127.0.0.1:5173',
			'http://localhost:3000',
			'http://127.0.0.1:3000',
	  ];

const corsOptions = {
	origin(origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error(`Origin ${origin} not allowed by CORS`));
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Idempotency-Key'],
	exposedHeaders: ['X-Request-Id'],
	maxAge: 86400,
};

app.use(cors(corsOptions));

app.use((req, _res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    req.url = req.url.replace(/\/+(\?|$)/, '$1');
  }
  next();
});

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
apiV1.use('/admin', adminRoutes);

app.use('/api/v1', apiV1);

app.use(errorMiddleware);

module.exports = app;
