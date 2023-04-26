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
      nameEN: Joi.string().required().min(2).max(30),
      nameRU: Joi.string().required().min(2).max(30),
      movieId: Joi.string().required().min(2).max(30),
      thumbnail: Joi.string().required().custom(urlValidator),
      trailerLink: Joi.string().required().custom(urlValidator),
      image: Joi.string().required().custom(urlValidator),
      description: Joi.string().required().min(2).max(30),
      duration: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      country: Joi.string().required().min(2).max(30),
    }),
}), postMovie);

routerMovies.delete('/:id', deleteMovie);

module.exports = routerMovies;
