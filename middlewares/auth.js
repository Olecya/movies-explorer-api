const jwt = require('jsonwebtoken');

const { JWT_KEY_SECRET } = require('../utils/config');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedErr('Войдите на сервис или зарегистрируйтесь'));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token.replace('Bearer ', ''), NODE_ENV ? JWT_SECRET : JWT_KEY_SECRET);
  } catch (err) {
    next(new UnauthorizedErr('Войдите на сервис или зарегистрируйтесь'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
