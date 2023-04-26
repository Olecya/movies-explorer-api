const validatorUser = require('validator');
// const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
  nameEN: {
    required: [true],
    type: String,
  },
  nameRU: {
    type: String,
    required: [true],
  },
  movieId: {
    type: String,
    required: [true],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validatorUser.isURL(value),
      massage: 'Invalid URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validatorUser.isURL(value),
      massage: 'Invalid URL',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validatorUser.isURL(value),
      massage: 'Invalid URL',
    },
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('movie', moviesSchema);
