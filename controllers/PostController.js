const Post = require("../models/post");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

exports.createPost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { user_id, description, tags } = req.body;
    const post = await Post.create({
      user_id,
      description,
      tags,
    });  
    return res.send({
        status: "200",
        type: "Success",
        message:
          "Post created successfully.",
    });
  } catch (error) {
    console.log(error);
  }
});
