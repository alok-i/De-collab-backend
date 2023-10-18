const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
    twitterId: {
        required: false,
        type: String,
        index: true
    },
    photoUrl: {
        type : String
    },
    company_name:{
        type: String
    },
    usernameTwitter: {
        required: false,
        type: String
    },
    about_us : {
        type: String,
    },
    tags: {
        type: [String]
    },
    social_link_linkedin: {
        type: String
    },
    social_link_telegram: {
        type: String
    },
    social_link_medium: {
        type: String
    },  
    fundingRounds: [
        {
            roundType: String,  // Seed, SeriesA, SeriesB, etc.
            amount: String,
            date: Date,
            // other relevant fields
        }
    ] 
})

const UserProfile = mongoose.model('UserProfile' , userProfile);

module.exports = UserProfile;