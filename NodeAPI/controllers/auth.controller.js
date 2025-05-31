// Code containing all methods used in authentication routes
const User = require('../models/user.model.js');

const {verifyGoogleToken} = require('../utils/verifyGoogleToken.js');
const {createJWT} = require('../utils/createJWT.js');

// Login screen
const login = async (req, res, next) => {
  res.render('login');
};

// Basic password email login method
const initiatePasswordAuth = async (req, res) => {
  try {
    const requestedEmail = req.body.email;
    const requestedPassword = req.body.password;
    
    const user = await User.findOne({ email: requestedEmail });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (requestedPassword != user.password) {
      return res.status(401).json({message: "Incorrect password"});
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};


// Android Oauth method
const initiateAndroidAuth = async (req, res) => {
  try {
    console.log("Received token");
    const { idToken } = req.body;

    if (!idToken) {
      console.log("No token received");
      return res.status(400).json({ error: 'ID token required' });
    }

    console.log("Verify token function");
    const googleUser = await verifyGoogleToken(idToken);

    console.log("Finding user");
    let user = await User.findOne({ googleId: googleUser.googleId });

    if (!user) {
      console.log("No such user found");
      user = await User.create({
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
      });
    }

    console.log("User found, creating JWT");
    const token = createJWT(user);

    console.log("Responding with JWT and user");
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const getProfileInfo = async (req, res) => {
  // User doesn't exist, go back to main page
  if (!req.user) {
    res.redirect('/');
  }
  // User exists, send user info
  res.send(req.user);
};

const logout = async (req, res) => {
  req.logout(function(err){
      
    if(err) {
      next(err);
    }

    res.redirect('/');
  });
};

module.exports = {
  login,
  initiatePasswordAuth,
  initiateAndroidAuth,
  getProfileInfo,
  logout
}