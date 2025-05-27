import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { getEnvVal } from './utils/getEnvVal.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/noFoundHandler.js';
import router from './routers/index.js';

const PORT = Number(getEnvVal('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cookieParser());

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
