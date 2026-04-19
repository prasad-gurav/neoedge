'use strict';

const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const transactionController = require('../controllers/transaction.controller');

const router = Router();

router.post('/', asyncHandler(transactionController.createTransfer));
router.get('/account/:accountId', asyncHandler(transactionController.listForAccount));
router.get('/:id', asyncHandler(transactionController.getById));

module.exports = router;
