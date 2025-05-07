import { contactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await contactCollection.find();
};

export const getContactById = async (contactId) => {
  return await contactCollection.findById(contactId);
};
