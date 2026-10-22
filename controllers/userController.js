const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// 1. POST /api/v1/user/signup (Status: 201)
exports.signup = async (req, res) => {
  try {
    // Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: 'Username or email already exists'
      });
    }

    // Create user (password is automatically hashed by User.js pre-save hook)
    const newUser = await User.create({
      username,
      email,
      password
    });

    return res.status(201).json({
      message: 'User created successfully.',
      user_id: newUser._id,
      user: newUser // Password is automatically removed by User.js toJSON transform
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Server error during signup'
    });
  }
};

// 2. POST /api/v1/user/login (Status: 200)
exports.login = async (req, res) => {
  try {
    // Check for input validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Support login via Username + password OR Email + password
    // Also supports if someone passes either inside the "username" or "email" field
    const identifier = email || username;
    const user = await User.findOne({
      $or: [
        { email: identifier ? identifier.toLowerCase() : null },
        { username: identifier }
      ]
    }).select('+password'); // Explicitly include password for bcrypt comparison

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid Username/Email and password'
      });
    }

    // Verify password using the helper method in User.js
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid Username/Email and password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      jwt_token: token
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || 'Server error during login'
    });
  }
};