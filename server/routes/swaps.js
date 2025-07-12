const express = require('express');
const {
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
  redeemWithPoints
} = require('../controllers/swapController.js');
const {
  validateSwapRequest,
  validateSwapResponse
} = require('../middleware/validation.js');
const { authenticateToken } = require('../middleware/auth.js');
const { body } = require('express-validator');

const router = express.Router();

// All swap routes require authentication
router.use(authenticateToken);

// Get swap requests (sent or received)
router.get('/', getSwapRequests);

// Create new swap request
router.post('/', validateSwapRequest, createSwapRequest);

// Respond to swap request
router.put('/:id/respond', validateSwapResponse, respondToSwapRequest);

// Redeem item with points
router.post('/redeem',
  [
    body('item_id')
      .isInt({ min: 1 })
      .withMessage('Valid item ID is required')
  ],
  redeemWithPoints
);

module.exports = router;