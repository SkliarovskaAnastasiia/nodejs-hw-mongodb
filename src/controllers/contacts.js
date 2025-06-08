import fs from 'node:fs/promises';
import path from 'node:path';
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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { UPLOAD_DIR } from '../constans/index.js';
import { getEnvVal } from '../utils/getEnvVal.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseOrderParams(req.query);
  const { type, isFavourite } = parseFilterParams(req.query);
  const userId = req.user._id;

  const data = await getAllContacts({
    userId,
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
  const userId = req.user._id;

  const data = await getContactById(contactId, userId);
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
  let photo = null;

  if (getEnvVal('UPLOAD_TO_CLOUDINARY') === 'true') {
    photo = await uploadToCloudinary(req.file.path);
  } else {
    await fs.rename(req.file.path, path.resolve(UPLOAD_DIR, req.file.filename));
    photo = `http://localhost:8080/photos/${req.file.filename}`;
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: contact,
  });
};

export const pathcContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  let photo = null;

  if (getEnvVal('UPLOAD_TO_CLOUDINARY') === 'true') {
    photo = await uploadToCloudinary(req.file.path);
  } else {
    await fs.rename(req.file.path, path.resolve(UPLOAD_DIR, req.file.filename));
    photo = `http://localhost:8080/photos/${req.file.filename}`;
  }

  const contact = await updateContact(contactId, userId, {
    ...req.body,
    photo,
  });

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
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
