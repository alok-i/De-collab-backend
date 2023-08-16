const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
    twitterId: {
        required: false,
        type: String
    },
    usernameTwitter: {
        required: false,
        type: String
    },
    aboutUs : {
        type: String,
    },
    tags: {
        type: String
    },
    Socials: {
        type: String
    },
    fundingRounds: {
        Seed: String,
        SeriesA: String,
        SeriesB: String
    }
})

const UserProfile = mongoose.model('UserProfile' , userProfile);

module.exports = UserProfile;