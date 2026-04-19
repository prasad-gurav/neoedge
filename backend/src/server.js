'use strict';

const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');

async function start() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB not available; start Mongo or set MONGODB_URI. Error:', err.message);
  }

  app.listen(env.port, () => {
    console.log(`Listening on http://127.0.0.1:${env.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
