const logger = require('./logger')


exports.handle200Success = (res, message, ...args) => {
  return res.status(200).json({
    success: true,
    status: 200,
    message: message,
    data: args.length > 0 ? args[0] : {}
  });
};

exports.handle201Created = (res, message, data) => {
  return res.status(201).json({
    success: true,
    status: 201,
    message: message,
    data: data
  });
};

exports.handle400BadRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    status: 400,
    message: message,
    data: {}
  });
};

exports.handle401Unauthorized = (res, message) => {
  return res.status(401).json({
    success: false,
    status: 401,
    message: message,
    data: {}
  });
};

exports.handle403Forbidden = (res, message) => {
  return res.status(403).json({
    success: false,
    status: 403,
    message: message,
    data: {}
  });
};

exports.handle404NotFound = (res, message) => {
  return res.status(404).json({
    success: false,
    status: 404,
    message: message,
    data: {}
  });
};
exports.handle422ValidationError = (res, errorArray) => {
  return res.status(422).json({
    success: false,
    status: 422,
    message: errorArray.length === 1 ? 'There is a validation error.' : 'There are validation errors.',
    data: errorArray
  });
};

exports.handle500InternalServerError = (res, message, stackTrace) => {
  if (process.env.NODE_ENV === "development") logger.error('Error Stack Trace:\n' + stackTrace)
  return res.status(500).json({
    success: false,
    status: 500,
    message: message,
    data: process.env.NODE_ENV === "development" ? stackTrace : {}
  });
};

exports.handleRedirect = (res, status, url) => {
  return res.redirect(status, url);
};