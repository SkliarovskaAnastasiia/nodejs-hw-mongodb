import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { getEnvVal } from './utils/getEnvVal.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/noFoundHandler.js';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constans/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(getEnvVal('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(
    cors({
      origin: getEnvVal('FRONT_END', 'http://localhost:5173'),
      credentials: true,
    }),
  );
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cookieParser());
  app.use('/photos', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
