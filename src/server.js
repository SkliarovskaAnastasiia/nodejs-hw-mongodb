import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVal } from './utils/getEnvVal.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/noFoundHandler.js';
import contactRouter from './routers/contacts.js';

const PORT = Number(getEnvVal('PORT', '3000'));

const setupServer = () => {
  const app = express();

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );

  app.use(cors());
  app.use(pino({ transport: { target: 'pino-pretty' } }));

  app.use(contactRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
