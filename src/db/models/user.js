import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, reqiured: true },
    email: { type: String, reqiured: true, unique: true },
    password: { type: String, reqiured: true },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const usersCollection = model('users', userSchema);
