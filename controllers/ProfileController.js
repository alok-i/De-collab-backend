const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { promisify } = require('util');
const AppError = require('../utils/appError');
const UserProfile = require('../models/userProfile');


exports.editProfile = (req, res, next) => {
    const { twitterId, usernameTwitter, about_us, tags, social_link_linkedin, social_link_telegram, social_link_medium, company_name, fundingRounds } = req.body;
      
    UserProfile.findOne({ twitterId }).then((Profile)=>{
        if(!Profile){

            Profile = new UserProfile({ twitterId, usernameTwitter, about_us, tags, social_link_linkedin, social_link_telegram, social_link_medium, company_name, fundingRounds })
        } else {
            // Profile found, update the specified parameters
            if(company_name) Profile.company_name = company_name;
            if (usernameTwitter) Profile.usernameTwitter = usernameTwitter;
            if (about_us) Profile.about_us = about_us;
            if (tags) Profile.tags = tags;
            if (fundingRounds) Profile.fundingRounds = fundingRounds;
            if(social_link_linkedin) Profile.social_link_linkedin = social_link_linkedin;
            if(social_link_medium) Profile.social_link_medium = social_link_medium;
            if(social_link_telegram) Profile.social_link_telegram = social_link_telegram;

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

exports.getProfile = catchAsyncErrors(async (req, res, next)=> {
     
    const requestedTwitterId = req.params.twitterId;
    const profile = await UserProfile.findOne({twitterId: requestedTwitterId});

    if(!profile){
         return next(new AppError("this user dosent exist", 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
           profile
        }
      });

})

 