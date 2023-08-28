const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user_id: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },
  tags: {
    type: [String],
    required: [true, "Please Enter Your tags"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Post", postSchema);
