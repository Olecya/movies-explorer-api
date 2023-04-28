require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { addressMongodb } = require('./utils/config');
const apiLimiter = require('./middlewares/apiLimiter');

const { PORT = 3000 } = process.env;
const app = express();
app.use(requestLogger);
app.use(helmet());
app.use(apiLimiter);

mongoose.connect(addressMongodb)
  .then(() => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log(`Error during connection ${error}`);
  });

app.use(cors({}));
app.use(bodyParser.json());
app.use('/', router);

app.use(errors());
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
