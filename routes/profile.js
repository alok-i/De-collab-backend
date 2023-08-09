const express = require('express');
const ProfileController = require('../controllers/ProfileController'); 

router.post('/editProfile' , ProfileController.editProfile);

module.exports = router;