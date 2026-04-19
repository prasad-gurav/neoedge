'use strict';

const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const ledgerController = require('../controllers/ledger.controller');

const router = Router();

router.get('/balance/:accountId', asyncHandler(ledgerController.getBalance));
router.get('/entries/:accountId', asyncHandler(ledgerController.listEntries));

module.exports = router;
