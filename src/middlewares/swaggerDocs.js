import createHttpError from 'http-errors';
import * as fs from 'node:fs';
import { SWAGGER_PATH } from '../constans/index.js';
import swaggerUI from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    const swaggerDocs = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDocs)];
  } catch {
    return (req, res, next) =>
      next(new createHttpError.InternalServerError("Can't load swagger docs"));
  }
};
