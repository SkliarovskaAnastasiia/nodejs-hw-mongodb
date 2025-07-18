import createHttpError from 'http-errors';
import { sessionsCollection } from '../db/models/session.js';
import { usersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token)
    return next(new createHttpError.Unauthorized('Access token missing'));

  const session = await sessionsCollection.findOne({ accessToken: token });
  if (!session)
    return next(new createHttpError.Unauthorized('Session not found'));

  const isExpired = Date.now() > new Date(session.accessTokenValidUntil);
  if (isExpired)
    return next(new createHttpError.Unauthorized('Access token expired'));

  const user = await usersCollection.findById(session.userId);
  if (!user) return new createHttpError.Unauthorized();

  req.user = user;

  next();
};
