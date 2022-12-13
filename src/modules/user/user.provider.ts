import { Connection } from 'mongoose';
import {
  FORGET_PASSWORD_REPOSITORY,
  USERS,
  USER_REPOSITORY,
  WALLETS,
  WALLET_REPOSITORY,
  SETTINGS_REPOSITORY,
  SETTINGS
} from 'src/constants';
import { ForgetPasswordSchema, UserSchema } from './user.schema';

export const usersProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (connection: Connection) => connection.model(USERS, UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: FORGET_PASSWORD_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model('forget_passwords', ForgetPasswordSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
