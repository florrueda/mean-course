const express = require('express');

const UserController = require('../controllers/user');
const User = require('../models/user');

const router = express.Router();

// Ruta de signup
router.post('/signup', UserController.createUser);

// Ruta de login
router.post('/login', UserController.userLogin);

module.exports = router;
