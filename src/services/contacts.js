import { contactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await contactCollection.find();
};

export const getContactById = async (contactId) => {
  return await contactCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return await contactCollection.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await contactCollection.findByIdAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
    },
  );
};

export const deleteContact = async (contactId) => {
  return await contactCollection.findByIdAndDelete(contactId);
};
