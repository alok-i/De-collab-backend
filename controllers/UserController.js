const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendToken = require("../utils/jwtToken");
const AppError = require("../utils/appError");
require("dotenv").config();

/**
 * --------------------------------------------------------------------------
 * * REGISTER API
 * --------------------------------------------------------------------------
 */

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

};

const createSendToken = async(user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  
  //fetching user based on token
  await User.findByIdAndUpdate(user._id, { auth_token: token });
  res.status(statusCode).send({
    status: 'success',
    token,
    data: {
      user
    }
  });
};


exports.signup = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, tags } = req.body;
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      tags
    });
    createSendToken(user, 201, res);
  } catch (error) {
    next(new AppError("Error while signup" , 404))
  }
});
/**
 * --------------------------------------------------------------------------
 * * LOGIN API
 * --------------------------------------------------------------------------
 */
exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exist in DB
  //check if user exists && password is correct
  //If two checks are fine send token to client
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or pass', 401));
  }

  createSendToken(user, 200, res);
});

/**
 * --------------------------------------------------------------------------
 * * SEARCH API
 * --------------------------------------------------------------------------
 */
exports.search = catchAsyncErrors(async (req, res, next) => {
  const search = req.params.search;
  const searchData = await User.find({ $or: [{ name: { '$regex': search } }] }); 
  return res.send({
    status: "200",
    type: "Success",
    searchData,
    message:
      "data fetched successfully.",
  });
})
