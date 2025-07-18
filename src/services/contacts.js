import { contactCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavorite,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactCollection.find({ userId });

  if (type) {
    console.log(type);
    contactsQuery.where('contactType').equals(type);
  }
  if (isFavorite) {
    contactsQuery.where('isFavorite').equals(isFavorite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  console.log(contacts);
  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) => {
  return await contactCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return await contactCollection.create(payload);
};

export const updateContact = async (contactId, userId, payload) => {
  return await contactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
    },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await contactCollection.findOneAndDelete({ _id: contactId, userId });
};
