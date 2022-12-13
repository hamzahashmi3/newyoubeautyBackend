// import { PrivacyPolicyService } from './modules/Terms&Conditions/privacypolicy.service';
import { PrivacyPolicyController } from './modules/Terms&Conditions/privacypolicy.controller';
import { PrivacyPolicyModule } from './modules/Terms&Conditions/privacypolicy.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { VerificationModule } from './modules/verification/verification.module';
import { SocketEventsModule } from './socket-event.module';

@Module({
  imports: [
    PrivacyPolicyModule,
    SocketEventsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    DatabaseModule,
    AuthModule,
    VerificationModule,
  ],
  controllers: [PrivacyPolicyController, AppController],
  providers: [AppService],
})
export class AppModule {}
