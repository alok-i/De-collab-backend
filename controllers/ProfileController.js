const UserProfile = require('../models/UserProfile');
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { promisify } = require('util');



exports.editProfile = (req, res, next) => {
    const { twitterId, usernameTwitter, aboutUs, tags, Socials, fundingRounds } = req.body;
      
    UserProfile.findOne({ twitterId }).then((Profile)=>{
        if(!Profile){

            Profile = new UserProfile({ twitterId, usernameTwitter, aboutUs, tags, Socials, fundingRounds})
        } else {
            // Profile found, update the specified parameters
            if (usernameTwitter) Profile.usernameTwitter = usernameTwitter;
            if (aboutUs) Profile.aboutUs = aboutUs;
            if (tags) Profile.tags = tags;
            if (Socials) Profile.Socials = Socials;
            if (fundingRounds) Profile.fundingRounds = fundingRounds;
        }

        return Profile.save();
    })
    .then(()=> {
        res.status(201).json({ success: true});
    })
    .catch((error)=> {
        console.log(error);
        res.status(500).json({ error: "profile edit failed, contact admin"});
    })

}

 