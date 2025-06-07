import nodemailer from 'nodemailer';
import { SMTP } from '../constans/index.js';
import { getEnvVal } from './getEnvVal.js';

const transporter = nodemailer.createTransport({
  host: getEnvVal(SMTP.SMTP_HOST),
  port: getEnvVal(SMTP.SMTP_PORT),
  secure: false,
  auth: {
    user: getEnvVal(SMTP.SMTP_USER),
    pass: getEnvVal(SMTP.SMTP_PASSWORD),
  },
});

export const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: getEnvVal(SMTP.SMTP_FROM),
    to,
    subject,
    html,
  });
};
