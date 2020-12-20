const AuthController = require('../controllers/auth')

const express = require('express');
const router = express.Router();

const passport = require('passport');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', passport.authenticate('jwt', {session: false}, null), AuthController.me);

module.exports = router
