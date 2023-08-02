const mongoose = require("mongoose");

const userTwitter = new mongoose.Schema({
    twitterId: {
        required: false,
        type: String
    },
    usernameTwitter: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model("userTwitter", userTwitter);
