import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { DatabaseModule } from './modules/database/database.module';
import { EmailServices } from './modules/shared/services/email.service';
import { UserService } from './modules/user/user.service';
import { VerificationService } from './modules/verification/verification.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    AppGateway,
    UserService,
    VerificationService,
    EmailServices,
  ],
  exports: [AppGateway, UserService],
})
export class SocketEventsModule {}
