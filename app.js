const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require("cors");

require("./config/dev.env");
const app = express();


require('./config/dev.env')
//CONFIGURATION
dotenv.config({ path: "./config/dev.env" });

//ROUTES
const routes =  require('./routes/web')
// const handleError = require("./middlewares/error");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", routes);
// app.use(handleError);
module.exports = app;