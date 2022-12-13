import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  password: string;
  phoneNumber: string;
  roles: string;
  emailVerified: boolean;
  profileImage: string;
  isVerified: boolean;
  isActive: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

const UserSchema = new mongoose.Schema<IUserDocument>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: { type: String },
    description: {
      type: String,
    },
    profileImage: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    roles: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: { type: Date, default: new Date(Date.now()) },
    updatedAt: { type: Date, default: new Date(Date.now()) },
    deletedAt: Date,
  },
  {
    toJSON: {
      versionKey: false,
    },
  },
);
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return obj;
};

export { UserSchema };

export interface IForgetPasswordDocument extends Document {
  readonly userId: string;
  readonly email: string;
  readonly pin: number;
  // isVerified: boolean;
  // readonly createdAt: Date;
}
export const ForgetPasswordSchema = new mongoose.Schema(
  {
    userId: String,
    email: String,
    pin: Number,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);
ForgetPasswordSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    userId: this.userId,
    email: this.email,
    pin: this.pin,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    deletedAt: this.deletedAt,
  };
};
