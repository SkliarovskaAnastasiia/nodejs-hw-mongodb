import { contactCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  type,
  isFavourite,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactCollection.find();

  if (type) {
    console.log(type);
    contactsQuery.where('contactType').equals(type);
  }
  if (isFavourite) {
    contactsQuery.where('isFavourite').equals(isFavourite);
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
