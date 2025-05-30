const jwt = require('jsonwebtoken');

function createJWT(user) {
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