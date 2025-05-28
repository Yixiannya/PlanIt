const express = require('express');
const passport = require('passport');
const router = express.Router();

// Renders login screen
router.get('/login', function(req, res, next) {
  res.render('login');
});


// Web Google Oauth 2.0
// Initiates the Google OAuth 2.0 authentication flow
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback URL for handling the OAuth 2.0 response
router.get('/auth/google/callback', passport.authenticate('google', { 
  failureRedirect: '/login' }), 
  // Successful authentication, redirect or handle the user as desired
  (req, res) => {
    res.redirect('/profile');
});


// Android Google Oauth 2.0
// Frontend should have an implementation of Google sign in,
// then it will be posting a request to /auth/google, with the id token.
// If all goes well, it should return a user with the associated GoogleId.
// If no such user exists, it will create a new user with the given GoogleId.
router.post('/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) return res.status(400).json({ error: 'ID token required' });

    const googleUser = await verifyGoogleToken(idToken);

    let user = await User.findOne({ googleId: googleUser.googleId });

    // User doesn't exist, so we create one
    if (!user) {
      user = await User.create({
        googleId: googleUser.googleId,
        name: googleUser.name,
        email: googleUser.email,
      });
    }

    // const token = createJWT(user);
    res.json({ user });

  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});


router.get('/profile', (req, res) => {
  console.log(req.user);
  res.send(`<pre>${JSON.stringify(req.user, null, 2)}</pre>`);
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;