import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrivacyPolicyController } from './privacypolicy.controller';
import { PrivacyPolicyService } from './privacypolicy.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
  exports: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
