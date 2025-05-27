import createHttpError from 'http-errors';
import { sessionsCollection } from '../db/models/session.js';
import { usersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader)
    return next(
      new createHttpError.Unauthorized('Authorization header missing'),
    );

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token)
    return next(
      new createHttpError.Unauthorized('Auth header should be of type Bearer'),
    );

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
