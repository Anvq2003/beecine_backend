const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/authMiddleware');
const bindController = require('../helpers/controllerHelper');
const { convertData } = require('../middlewares/convertDataMiddleware');

router.get('/me', verifyToken, bindController(AuthController, 'getProfile'));
router.get('/check-verified', bindController(AuthController, 'checkIsVerified'));

router.post('/sign-in', bindController(AuthController, 'signIn'));
router.post('/sign-in-admin', bindController(AuthController, 'signInAdmin'));
router.post('/sign-up', bindController(AuthController, 'signUp'));
router.post('/sign-in-with-google', bindController(AuthController, 'signInWithGoogle'));
router.post('/refresh-token', bindController(AuthController, 'refreshToken'));
router.post('/send-otp', bindController(AuthController, 'sendOtpToEmail'));
router.post('/verify-otp', bindController(AuthController, 'verifyOtp'));

router.put('/change-password', verifyToken, bindController(AuthController, 'changePassword'));
router.put('/reset-password', bindController(AuthController, 'resetPassword'));
module.exports = router;
