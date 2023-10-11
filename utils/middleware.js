const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('Authorization')
  if (auth === undefined) {
    return next()
  }
  request.token = auth.match(/^Bearer/)
    ? auth.replace('Bearer ', '')
    : null

  next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({
      error: 'Missing token'
    })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({
      error: 'User does not exist'
    })
  }

  request.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}