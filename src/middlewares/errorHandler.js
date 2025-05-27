import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (createHttpError.isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err.message,
    });

    return;
  }

  res.status(500).json({
    status: 500,
    message: err.name,
    data: err.message,
  });
};
