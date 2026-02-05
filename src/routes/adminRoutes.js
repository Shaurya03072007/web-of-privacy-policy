const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Auth Routes
router.get('/auth/google', adminController.googleLogin);
router.get('/auth/google/callback', adminController.googleCallback);

// API Routes
router.get('/users', adminController.listUsers); // Protected by Controller logic (Admin check added)
router.get('/me', adminController.getMe);
router.post('/users/:id/tier', adminController.updateUserTier);
router.post('/logout', adminController.logout);

module.exports = router;
