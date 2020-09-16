const config = require('./utils/config')
const express = require('express')
const logger = require('./utils/logger')
const PersonRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', PersonRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


module.exports = app