const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// router.get('/auth/twitter', UserController.twitterAuth);
// router.get('/auth/twitter/callback', UserController.twitterAuthOne);
// router.get('/getUser' , UserController.getUser);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

module.exports = router;

