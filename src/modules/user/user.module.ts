import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AwsService } from '../shared/services/aws.service';
import { VerificationService } from '../verification/verification.service';
import { EmailServices } from '../shared/services/email.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, AwsService, VerificationService, EmailServices],
  exports: [UserService, AwsService,],
})
export class UserModule {}
