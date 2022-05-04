const express = require('express');
const inboxController = require('../controllers/inbox.controller');
const { verifyAccessToken } = require('../middlewares/jwt');
const verifyRoles = require('../middlewares/roles');
const ROLES = require('../../../configs/roles.config');

const router = express.Router();

router
  .route('/')
  .get(
    verifyAccessToken,
    verifyRoles(ROLES.user, ROLES.admin),
    inboxController.getInboxDocuments
  );

module.exports = router;
