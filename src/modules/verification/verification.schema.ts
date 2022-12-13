import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { USERS } from 'src/constants';
import { IUserDocument } from '../user/user.schema';

export interface IVerificationDocument extends Document {
  userId: IUserDocument;
  code: number;
  isVerified: boolean;
  expiry: Date;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new mongoose.Schema<IVerificationDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USERS,
    },
    code: { type: Number },
    isVerified: { type: Boolean },
    expiry: { type: Date },
    type: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      versionKey: false,
    },
  },
);

VerificationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { VerificationSchema };
