const errorHandler = (err, req, res, next) => {
  const error = err;
  if (error.statusCode === 500 || !error.statusCode) {
    error.statusCode = 500;
    error.message = 'Произошла ошибка сервера';
  }

  res.status(error.statusCode).send({ message: error.message });
  next();
};

module.exports = errorHandler;
