// Code to handle the creation of JWT.
const jwt = require('jsonwebtoken');

function createJWT(user) {
  console.log("Creating JWT");
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.displayName
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  createJWT
}