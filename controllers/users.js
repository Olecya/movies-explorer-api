const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');

const { JWT_KEY_SECRET } = require('../utils/config');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = async (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) res.send(user);
      if (!user) {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => next(err));
};

const patchUser = async (req, res, next) => {
  const userId = req.user._id;
  const {
    name,
    email,
  } = req.body;

  return User.findByIdAndUpdate(userId, {
    name,
    email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundErr('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictErr('Пользователь с такими e-mail уже существует'));
      }
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Неверные данные'));
      } else {
        next(error);
      }
    });
};

const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          const { _id } = user;
          res.status(201)
            .send({
              user: {
                _id,
                name,
                email,
              },
            });
        })
        .catch((error) => {
          // console.log(error);
          if (error.name === 'ValidationError') {
            next(new BadRequestErr('Неверные данные'));
            return;
          }
          if (error.code === 11000) {
            next(new ConflictErr('Пользователь с такими e-mail уже существует'));
          } else {
            next(error);
          }
        });
    })
    .catch((e) => next(e));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : JWT_KEY_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((e) => next(e));
};

module.exports = {
  createUser,
  patchUser,
  getUserMe,
  login,
};
