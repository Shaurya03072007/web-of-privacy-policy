const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const permissionController = require('../controllers/permissionController');
const { strictLimiter } = require('../middleware/security');

// Auth Routes
router.post('/auth/google', authController.googleLogin);
router.post('/auth/verify-session', authController.verifySession);

// Permission Routes
// Apply strict limiter to sensitive permission check
router.post('/permissions/check', strictLimiter, permissionController.checkPermissions);

module.exports = router;
