import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { usersCollection } from '../db/models/user.js';
import { sessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { sendEmail } from '../utils/sendMails.js';
import { getEnvVal } from '../utils/getEnvVal.js';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { RESET_PASSWORD_TEMPLATE } from '../constans/index.js';

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

  return await sessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId, refreshToken) => {
  await sessionsCollection.deleteOne({ _id: sessionId, refreshToken });
};

export const requestResetPassword = async (email) => {
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw new createHttpError.NotFound('User not found');
  }

  const token = jwt.sign({ sub: user._id, email }, getEnvVal('JWT_SECRET'), {
    expiresIn: '15m',
  });

  const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendEmail(
    user.email,
    'Reset password',
    template({
      name: user.name,
      link: `${getEnvVal('APP_DOMAIN')}/reset-password?token=${token}`,
    }),
  );
};

export const resetPassword = async ({ password, token }) => {
  try {
    const decoded = jwt.verify(token, getEnvVal('JWT_SECRET'));

    const user = await usersCollection.findById(decoded.sub);
    if (!user) {
      throw new createHttpError.NotFound('User not found');
    }

    const encreptedPassword = await bcrypt.hash(password, 10);

    await usersCollection.findByIdAndUpdate(user._id, {
      password: encreptedPassword,
    });
  } catch (err) {
    throw new createHttpError.Unauthorized('Token is expired or invalid');
  }
};
