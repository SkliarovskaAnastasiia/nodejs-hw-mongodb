import {
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { getAllContacts, getContactById } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseOrderParams } from '../utils/parseOrderParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseOrderParams(req.query);
  const { type, isFavourite } = parseFilterParams(req.query);

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const data = await getContactById(contactId);
  console.log(data);

  if (!data) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfuly found contact with id ${contactId}`,
    data,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
};

export const pathcContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await updateContact(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
