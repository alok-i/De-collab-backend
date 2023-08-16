const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const userTwitter = require("./models/userTwitter");


require("./config/.env");
const app = express();


require('./config/.env')
//CONFIGURATION
dotenv.config({ path: "./config/.env" });

//ROUTES
const userRoutes =  require('./routes/user')
// const handleError = require("./middlewares/error");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/v1", userRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profile', profileRoute);
// app.use(handleError);
module.exports = app;