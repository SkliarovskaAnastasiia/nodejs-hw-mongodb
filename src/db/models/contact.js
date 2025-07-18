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
    isFavorite: {
      type: Boolean,
      dafault: false,
      required: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'contacts' },
    photo: { type: String, required: false, default: null },
  },
  { timestamps: true },
);

export const contactCollection = model('contacts', contactsSchema);
