const rateLimit = require('express-rate-limit');

const apiLimiter = (req, res, next) => {
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  });
  next();
};
module.exports = {
  apiLimiter,
};
