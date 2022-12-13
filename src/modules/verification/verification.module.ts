import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CommonServices } from '../shared/services/common.service';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [DatabaseModule],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
