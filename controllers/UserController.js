const User = require("../models/user");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendToken = require("../utils/jwtToken");
/**
 * --------------------------------------------------------------------------
 * * REGISTER API
 * --------------------------------------------------------------------------
 */

 const signToken = id => {
    console.log(expiresIn);
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  
  };

 const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    // Remove password from output
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };


exports.signup = catchAsyncErrors(async (req, res, next) => {
    try{
    const { name, email, password, passwordConfirm, tags } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        passwordConfirm,
        tags
    });

    createSendToken(user, 201, res);
}catch(error){
    console.log(error);
}
    next();
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