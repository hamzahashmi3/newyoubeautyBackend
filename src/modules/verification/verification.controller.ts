import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommonServices } from '../shared/services/common.service';

@Controller('verification')
export class VerificationController extends CommonServices {
  constructor(private readonly verificationService: VerificationService) {
    super();
  }
}
