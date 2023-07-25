const express = require('express');
const UserController = require('../controllers/UserController');
const PostController = require('../controllers/PostController');
const router = express.Router();
//users
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/search', UserController.search);

//posts
router.post('/create/post', PostController.createPost);
module.exports = router;

