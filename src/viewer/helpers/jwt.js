const jwt = require('jsonwebtoken');

module.exports = ({
  create: (data, secret) => jwt.sign(data, secret),
  decode: (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      return null;
    }
  }
});
