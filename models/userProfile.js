const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
    twitterId: {
        required: false,
        type: String,
        index: true
    },
    companyName:{
        type: String
    },
    usernameTwitter: {
        required: false,
        type: String
    },
    aboutUs : {
        type: String,
    },
    Tags: {
        type: String
    },
    Socials: [{
        type: String
    }],
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