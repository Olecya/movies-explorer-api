const Movie = require('../models/movie');

const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
const NotFoundErr = require('../errors/NotFoundErr');

const getMovies = async (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })

    .then((movies) => {
      res.send(movies);
    })
    .catch((error) => next(error));
};

const postMovie = async (req, res, next) => {
  console.log(req.user);
  const owner = req.user;
  const {
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
  } = req.body;
  Movie.create({
    nameEN,
    nameRU,
    movieId,
    owner,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
  })
    .then((r) => {
      res.status(201)
        .send(r);
    })
    .catch((error) => {
      // console.log(error);
      if (error.name === 'ValidationError') {
        next(new BadRequestErr('Неверные данные req.user'));
      } else {
        next(error);
      }
    });
};
const deleteMovie = async (req, res, next) => {
  const userId = req.user._id;
  const { id } = req.params;
  console.log(id);
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        next((new NotFoundErr(`Кино не найдено ${id}`)));
        return;
      }
      if (userId === movie.owner.toString()) {
        movie.deleteOne({})
          .then(() => {
            res.send(movie);
          })
          .catch((e) => next(e));
      } else {
        next(new ForbiddenErr('Неверный пользователь'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestErr(`Кино не найдено ${id}`));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
