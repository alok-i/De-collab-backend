const express = require('express');
const ProfileController = require('../controllers/ProfileController'); 

const router = express.Router();

router.post('/editProfile' , ProfileController.editProfile);
router.get('/getProfile/:twitterId', ProfileController.getProfile);

module.exports = router;