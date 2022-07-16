const config = require('./utils/config');
const express = require('express');
require('express-async-errors'); //allows us to eliminate the try-catch blocks completely
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

/** Routers */
app.use('/api/blogs', blogsRouter);

/** Error handling of router */
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;