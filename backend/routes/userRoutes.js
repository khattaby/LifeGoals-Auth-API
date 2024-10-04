const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);


module.exports = router;
