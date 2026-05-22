export const errorHandler = (err, req, res, next) => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  
  // Determine status code
  let status = err.statusCode || err.status || 500;
  if (res.statusCode && res.statusCode !== 200) {
    status = res.statusCode;
  }

  // Log error in production
  if (NODE_ENV === 'production') {
    console.error({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status,
      message: err.message,
      userId: req.user?._id,
    });
  } else {
    // Log with full stack in development
    console.error(err);
  }

  // Handle specific MongoDB errors
  if (err.name === 'ValidationError') {
    status = 400;
    err.message = 'Validation error: ' + Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    status = 400;
    err.message = 'Invalid ID format';
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} already exists`;
  }

  // Send response
  res.status(status).json({
    message: err.message || 'Server error',
    status,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
    // Include error code for frontend handling
    ...(err.code && { code: err.code }),
  });
};
