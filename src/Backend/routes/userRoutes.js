const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/user', authenticateToken, getUser);

module.exports = router;
