const express = require('express');
const ProfileController = require('../controllers/ProfileController'); 

const router = express.Router();

router.post('/editProfile' , ProfileController.editProfile);
router.get('/getProfile/:twitterId', ProfileController.getProfile);
router.post('/uploadProfilePicture/:twitterId' , ProfileController.setProfilePicture);

module.exports = router;