const express = require('express');
const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  patchUser,
  getUserMe,
} = require('../controllers/users');

const routerUsers = express.Router();

routerUsers.get('/me', getUserMe);

routerUsers.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
}), patchUser);

module.exports = routerUsers;
