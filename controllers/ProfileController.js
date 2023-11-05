const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { promisify } = require("util");
const AppError = require("../utils/appError");
const UserProfile = require("../models/userProfile");
const AWS = require("aws-sdk")
const multer = require("multer");
const multerS3 = require("multer-s3");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.BUCKET_REGION,
});

const s3 = new AWS.S3();

exports.editProfile = (req, res, next) => {
  const {
    twitterId,
    usernameTwitter,
    about_us,
    tags,
    social_link_linkedin,
    social_link_telegram,
    social_link_medium,
    company_name,
    fundingRounds,
  } = req.body;

  UserProfile.findOne({ twitterId })
    .then((Profile) => {
      if (!Profile) {
        Profile = new UserProfile({
          twitterId,
          usernameTwitter,
          about_us,
          tags,
          social_link_linkedin,
          social_link_telegram,
          social_link_medium,
          company_name,
          fundingRounds,
        });
      } else {
        // Profile found, update the specified parameters
        if (company_name) Profile.company_name = company_name;
        if (usernameTwitter) Profile.usernameTwitter = usernameTwitter;
        if (about_us) Profile.about_us = about_us;
        if (tags) Profile.tags = tags;
        if (fundingRounds) Profile.fundingRounds = fundingRounds;
        if (social_link_linkedin)
          Profile.social_link_linkedin = social_link_linkedin;
        if (social_link_medium) Profile.social_link_medium = social_link_medium;
        if (social_link_telegram)
          Profile.social_link_telegram = social_link_telegram;
      }

      return Profile.save();
    })
    .then(() => {
      res.status(201).json({ success: true });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "profile edit failed, contact admin" });
    });
};

exports.getProfile = catchAsyncErrors(async (req, res, next) => {
  const requestedTwitterId = req.params.twitterId;
  const profile = await UserProfile.findOne({ twitterId: requestedTwitterId });

  if (!profile) {
    return next(new AppError("this user dosent exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

const upload = (bucketName) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, `image-${Date.now()}.jpeg`);
      },
    }),
  });



exports.setProfilePicture = catchAsyncErrors(async (req, res, next) => {
  const requestedTwitterId = req.params.twitterId;
  const uploadSingle = upload("decollab-bucket").single("croppedImage");

  uploadSingle(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      let Profile = await UserProfile.findOne({ twitterId: requestedTwitterId });

      if (!Profile) {
        Profile = new UserProfile({
          twitterId,
          usernameTwitter,
          about_us,
          tags,
          social_link_linkedin,
          social_link_telegram,
          social_link_medium,
          company_name,
          fundingRounds,
          photoUrl: req.file.location, // Set the photoUrl here
        });
      } else {
        // Profile found, update the specified parameters
        Profile.photoUrl = req.file.location;
      }
      
      // console.log(req.file.location);
      await Profile.save();
 
      return res.status(201).json({ success: true, data: req.file.location });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
});
