const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/authMiddleware');
const bindController = require('../helpers/controllerHelper');

router.get('/me', verifyToken, bindController(AuthController, 'getProfile'));
router.post('/sign-in', bindController(AuthController, 'signIn'));
router.post('/sign-up', bindController(AuthController, 'signUp'));
router.post('/sign-in-with-google', bindController(AuthController, 'signInWithGoogle'));
router.post('/sign-out', bindController(AuthController, 'signOut'));
router.post('/refresh-token', verifyToken, bindController(AuthController, 'refreshToken'));

module.exports = router;
