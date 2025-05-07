import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    isFavourite: {
      type: Boolean,
      dafault: false,
      required: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'hom', 'personal'],
      default: 'personal',
    },
  },
  { timestamps: true },
);

export const contactCollection = model('contacts', contactsSchema);
