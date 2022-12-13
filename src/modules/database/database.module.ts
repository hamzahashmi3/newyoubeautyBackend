import { Module } from '@nestjs/common';
import { usersProviders } from '../user/user.provider';
import { databaseProviders } from './database.provider';
import { verificationProviders } from '../verification/verification.provider';
import { AppGateway } from 'src/app.gateway';
import { privacyPolicyProviders } from '../Terms&Conditions/privacypolicy.provider';

@Module({
  providers: [
    ...databaseProviders,
    ...usersProviders,
    ...verificationProviders,
    ...privacyPolicyProviders,
    AppGateway,
  ],
  exports: [
    ...databaseProviders,
    ...usersProviders,
    ...verificationProviders,
    ...privacyPolicyProviders,
    AppGateway,
  ],
})
export class DatabaseModule {}
