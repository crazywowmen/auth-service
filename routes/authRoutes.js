const express = require('express');
const { signupUser, signinUser, testProtected, testUnProtected, isUserSignedIn } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signupUser);
router.post('/signin', signinUser);

// UnProtected Route
router.get('/test-unprotected', testUnProtected);

// Protected Route
router.get('/test-protected', authMiddleware, testProtected);

// New endpoint to check if the user is signed in
router.get('/check-auth', isUserSignedIn);

module.exports = router;