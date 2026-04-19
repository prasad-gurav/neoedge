'use strict';

const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const accountController = require('../controllers/account.controller');

const router = Router();

router.post('/', asyncHandler(accountController.create));
router.get('/user/:userId', asyncHandler(accountController.listByUser));
router.get('/:id', asyncHandler(accountController.getById));

module.exports = router;
