import { Connection } from 'mongoose';
import { VERIFICATIONS, VERIFICATION_REPOSITORY } from 'src/constants';
import { VerificationSchema } from './verification.schema';

export const verificationProviders = [
  {
    provide: VERIFICATION_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(VERIFICATIONS, VerificationSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
