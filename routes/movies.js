const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { urlValidator } = require('../utils/urlValidator');
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

const routerMovies = express.Router();

routerMovies.get('/', getMovies);

routerMovies.post('/', celebrate({
  body: Joi.object()
    .keys({
      nameEN: Joi.string().required(),
      nameRU: Joi.string().required(),
      movieId: Joi.number().required(),
      thumbnail: Joi.string().required().custom(urlValidator),
      trailerLink: Joi.string().required().custom(urlValidator),
      image: Joi.string().required().custom(urlValidator),
      description: Joi.string().required(),
      year: Joi.string().required(),
      duration: Joi.string().required(),
      director: Joi.string().required(),
      country: Joi.string().required(),
    }),
}), postMovie);

routerMovies.delete('/:id', celebrate({
  params: Joi.object()
    .keys({ id: Joi.string().required() }),
}), deleteMovie);

module.exports = routerMovies;
