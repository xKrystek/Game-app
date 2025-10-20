const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/user-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/auth', authMiddleware);
router.post('/logout', logoutUser);

module.exports = router;
