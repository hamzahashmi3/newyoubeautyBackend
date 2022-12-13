import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IPrivacyPolicyDocument extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const PrivacyPolicySchema = new mongoose.Schema<IPrivacyPolicyDocument>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: { type: Date, default: new Date(Date.now()) },
    deletedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export { PrivacyPolicySchema };
