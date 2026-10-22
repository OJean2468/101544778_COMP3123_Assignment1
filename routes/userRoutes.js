const express = require('express');
const userController = require('../controllers/userController');
const { validateSignup, validateLogin } = require('../validators/validator');

const router = express.Router();

// Endpoints
router.post('/signup', validateSignup, userController.signup);
router.post('/login', validateLogin, userController.login);

module.exports = router;