const { body, param, query, validationResult } =require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Item validation rules
const validateCreateItem = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Valid category is required'),
  
  body('type')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Type must be between 2 and 100 characters'),
  
  body('size')
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Size must be one of: XS, S, M, L, XL, XXL'),
  
  body('condition_type')
    .isIn(['Like New', 'Good', 'Fair', 'Well-Worn'])
    .withMessage('Condition must be one of: Like New, Good, Fair, Well-Worn'),
  
  body('point_value')
    .isInt({ min: 10, max: 1000 })
    .withMessage('Point value must be between 10 and 1000'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters'),
  
  handleValidationErrors
];

const validateUpdateItem = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('point_value')
    .optional()
    .isInt({ min: 10, max: 1000 })
    .withMessage('Point value must be between 10 and 1000'),
  
  body('is_available')
    .optional()
    .isBoolean()
    .withMessage('Availability must be a boolean'),
  
  handleValidationErrors
];

// Swap request validation
const validateSwapRequest = [
  body('item_id')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  
  body('offered_item_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Offered item ID must be valid if provided'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message must not exceed 1000 characters'),
  
  handleValidationErrors
];

const validateSwapResponse = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid swap request ID is required'),
  
  body('status')
    .isIn(['accepted', 'declined'])
    .withMessage('Status must be either accepted or declined'),
  
  body('response_message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Response message must not exceed 1000 characters'),
  
  handleValidationErrors
];

// Admin validation
const validateAdminAction = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid item ID is required'),
  
  body('approval_status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
  
  body('rejection_reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Rejection reason must not exceed 500 characters'),
  
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateItemFilters = [
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  
  query('size')
    .optional()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .withMessage('Size must be one of: XS, S, M, L, XL, XXL'),
  
  query('condition_type')
    .optional()
    .isIn(['Like New', 'Good', 'Fair', 'Well-Worn'])
    .withMessage('Condition must be one of: Like New, Good, Fair, Well-Worn'),
  
  query('min_points')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum points must be a non-negative integer'),
  
  query('max_points')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum points must be a non-negative integer'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search term must not exceed 255 characters'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateItem,
  validateUpdateItem,
  validateSwapRequest,
  validateSwapResponse,
  validateAdminAction,
  validatePagination,
  validateItemFilters,
  handleValidationErrors
};