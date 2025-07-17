import cloudinary from 'cloudinary';
import { getEnvVal } from './getEnvVal.js';
import { CLOUDINARY } from '../constans/index.js';
import fs from 'node:fs/promises';

cloudinary.v2.config({
  cloud_name: getEnvVal(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVal(CLOUDINARY.API_KEY),
  api_secret: getEnvVal(CLOUDINARY.API_SECRET),
});

export const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.v2.uploader.upload(filePath);
  await fs.unlink(filePath);

  return result.secure_url;
};
