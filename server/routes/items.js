const express = require('express');
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getCategories
} = require('../controllers/itemController.js');
const {
  validateCreateItem,
  validateUpdateItem,
  validatePagination,
  validateItemFilters
} = require('../middleware/validation.js');
const { authenticateToken, optionalAuth } = require('../middleware/auth.js');
const { upload, handleUploadError } = require('../middleware/upload.js');

const router = express.Router();

// Public routes
router.get('/', validatePagination, validateItemFilters, optionalAuth, getItems);
router.get('/categories', getCategories);
router.get('/:id', getItemById);

// Protected routes
router.post('/',
  authenticateToken,
  upload.array('images', 5),
  handleUploadError,
  validateCreateItem,
  createItem
);

router.put('/:id',
  authenticateToken,
  validateUpdateItem,
  updateItem
);

router.delete('/:id',
  authenticateToken,
  deleteItem
);

module.exports = router;