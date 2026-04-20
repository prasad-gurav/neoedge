'use strict';

const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const requireSuperuser = require('../middleware/require-superuser.middleware');
const adminController = require('../controllers/admin.controller');

const router = Router();

router.post(
  '/superusers/bootstrap',
  asyncHandler(adminController.bootstrapSuperuser)
);

router.post(
  '/deposits',
  requireSuperuser,
  asyncHandler(adminController.createDeposit)
);

module.exports = router;
