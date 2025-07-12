const express = require('express');
const {
  getDashboardStats,
  getItemsForModeration,
  moderateItem,
  getUsers,
  toggleUserStatus,
  getAnalytics
} = require('../controllers/adminController.js');
const {
  validateAdminAction,
  validatePagination
} = require('../middleware/validation.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
const { body, param } = require('express-validator');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken, requireAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Analytics
router.get('/analytics', getAnalytics);

// Item moderation
router.get('/items', validatePagination, getItemsForModeration);
router.put('/items/:id/moderate', validateAdminAction, moderateItem);

// User management
router.get('/users', validatePagination, getUsers);
router.put('/users/:id/status',
  [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Valid user ID is required'),
    body('is_active')
      .isBoolean()
      .withMessage('Active status must be a boolean')
  ],
  toggleUserStatus
);

module.exports = router;