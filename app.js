const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const userTwitter = require("./models/userTwitter");


require("./config/dev.env");
const app = express();


require('./config/dev.env')
//CONFIGURATION
dotenv.config({ path: "./config/dev.env" });

//ROUTES
const routes =  require('./routes/web')
const userRoutes =  require('./routes/user');
const user = require("./models/user");
// const handleError = require("./middlewares/error");

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(session({
//     secret: "secret-code",
//     resave: false,
//     saveUninitialized: false, 
//     cookie: {
//         sameSite: "none",
//         secure: false,
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }));

app.use(session({ secret: 'blah', name: 'id' }))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userTwitter.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
  

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: "N6xjoKgqSgGBJlc2bZJuUT3Kd",
        consumerSecret: "qAvzI6CL1WylIdJQnwEVPrG7gHq75qlU04wOcyXHnZVGOXNMmC",
        callbackURL: "/auth/twitter/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find the user in the database using the Twitter ID
          let user = await userTwitter.findOne({ twitterId: profile.id });
  
          if (!user) {
            // If the user doesn't exist, create a new user
            user = new userTwitter({
              twitterId: profile.id,
              usernameTwitter: profile.displayName,
            });
  
            await user.save();
          }
  
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: 'http://localhost:3000/', session: true }),
  function (req, res) {
    console.log("reached second");
    res.redirect('http://localhost:3000/register');
  });

  app.get('/getUser', (req, res)=> {
    res.send(req.user);
  })


app.use('/api/v1/users', userRoutes);
// app.use(handleError);
module.exports = app;