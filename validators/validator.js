const { body, oneOf } = require('express-validator');

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

// User: signup
const validateSignup = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(USERNAME_REGEX).withMessage('Username must be 3-30 characters: letters, numbers, or underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }).withMessage('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character')
    .isByteLength({ max: 72 }).withMessage('Password must be at most 72 bytes')
];

// User: login (requires username OR email, plus password)
const validateLogin = [
  oneOf(
    [
      body('username').trim().notEmpty(),
      body('email').trim().notEmpty().isEmail()
    ],
    { message: 'Please provide a valid username or email' }
  ),
  body('password').notEmpty().withMessage('Password is required')
];

// Employee: create (all fields required)
const validateCreateEmployee = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('date_of_joining').isISO8601().withMessage('Valid date_of_joining is required (YYYY-MM-DD)'),
  body('department').trim().notEmpty().withMessage('Department is required')
];

// Employee: update (fields optional, validated if present)
const validateUpdateEmployee = [
  body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Must be a valid email'),
  body('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
  body('salary').optional().isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
  body('date_of_joining').optional().isISO8601().withMessage('Must be a valid date'),
  body('department').optional().trim().notEmpty().withMessage('Department cannot be empty')
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateEmployee,
  validateUpdateEmployee
};
