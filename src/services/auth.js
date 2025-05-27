import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';

export const registerUser = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });
  if (user) throw new createHttpError.Conflict('Email in use');

  const encreptedPassword = await bcrypt.hash(payload.password, 10);

  return await usersCollection.create({
    ...payload,
    password: encreptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await usersCollection.findOne({ email });
  if (!user)
    throw new createHttpError.Unauthorized('Email or password is incorrect');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new createHttpError.Unauthorized('Email or password is incorrect');

  await sessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await sessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await sessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) throw new createHttpError.Unauthorized('Session not found');

  const isExpired = Date.now() > new Date(session.refreshTokenValidUntil);
  if (isExpired)
    throw new createHttpError.Unauthorized('Session token expired');

  await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const newSession = createSession();

  return {
    userId: session.userId,
    ...newSession,
  };
};

export const logoutUser = async (sessionId, refreshToken) => {
  await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });
};
