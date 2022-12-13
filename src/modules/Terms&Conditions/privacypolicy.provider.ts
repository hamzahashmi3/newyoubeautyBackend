import { Connection } from 'mongoose';
import { PRIVACYPOLICY, PRIVACYPOLICY_REPOSITORY } from 'src/constants';
import { PrivacyPolicySchema } from './privacyPolicy.schema';

export const privacyPolicyProviders = [
  {
    provide: PRIVACYPOLICY_REPOSITORY,
    useFactory: (connection: Connection) =>
      connection.model(PRIVACYPOLICY, PrivacyPolicySchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
