import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    accessToken: { type: String, reqiured: true },
    refreshToken: { type: String, reqiured: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const sessionsCollection = model('sessions', sessionSchema);
