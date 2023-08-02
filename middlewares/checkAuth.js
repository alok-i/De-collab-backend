const User = require("../models/user");
exports.checkauthentication = async (req, res, next) => {
  //header token
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader;
  try {
      if (token) {
    //remove 'bearer' from token
          var parts = token.split(" ");
    //verify length of token
      if (parts.length === 2) {
        var userToken = parts[1];
        const userdata = await User.findOne({ auth_token: userToken });
        if (!userdata) {
          throw new Error("Session Expired");
        }
      }
    }
    next();
  } catch (err) {
    return res.send({
      status: false,
      message: err.message,
    });
  }
};
