'use strict';

const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/', asyncHandler(userController.register));
router.get('/:id', asyncHandler(userController.getById));

module.exports = router;
