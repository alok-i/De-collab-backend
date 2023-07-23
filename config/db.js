const mongoose = require("mongoose");
require("dotenv").config();
module.exports = async function dbConnect() {
    const URL = process.env.MONGO_URL;
    try {
        await mongoose.connect(URL);
        console.log("Connected successfull.");
    } catch (err) {
        console.log(err);
    }
};