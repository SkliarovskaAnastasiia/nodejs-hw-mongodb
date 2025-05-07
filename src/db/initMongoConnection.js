import mongoose from 'mongoose';
import { getEnvVal } from '../utils/getEnvVal.js';

const initMongoConnection = async () => {
  try {
    const user = getEnvVal('MONGODB_USER');
    const pwd = getEnvVal('MONGODB_PASSWORD');
    const url = getEnvVal('MONGODB_URL');
    const db = getEnvVal('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
    );

    console.log('Mongo connection successfuly established');
  } catch (error) {
    console.log('Connection mongo error', error);
    throw error;
  }
};

export default initMongoConnection;
