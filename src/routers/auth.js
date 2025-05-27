import { json, Router } from 'express';
import { isValid } from '../middlewares/isValid.js';
import { loginSchema, registerSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from '../controllers/auth.js';

const router = Router();

const jsonParser = json({
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb',
});

router.post(
  '/register',
  jsonParser,
  isValid(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  isValid(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;
