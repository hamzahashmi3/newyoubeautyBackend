import mongoose, { Model } from 'mongoose';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { VERIFICATION_REPOSITORY } from 'src/constants';

import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { CommonServices } from '../shared/services/common.service';
import { IVerificationDocument } from './verification.schema';

@Injectable()
export class VerificationService extends sharedCrudService {
  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    readonly verificatoinRepository: Model<IVerificationDocument>,
  ) {
    super(verificatoinRepository);
  }

  async create(info: any): Promise<any> {
    const data = await this.verificatoinRepository.create(info);
    return data;
  }

  async createCode(code: number, userId: string, type?: string) {
    let verification = await this.verificatoinRepository.findOneAndUpdate({
      userId: userId,
      expiry: new Date().getTime() + 1000 * 60 * 30 /* 30 minutes */,
      isVerified: false,
      code: code,
      type,
    }); 
    if (!verification) {
      verification = await this.verificatoinRepository.create({
        userId: userId,
        expiry: new Date().getTime() + 1000 * 60 * 30 /* 30 minutes */,
        isVerified: false,
        code: code,
        type,
      });
    }
    return verification;
  }

  async findByUserId(userId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const verification = await this.verificatoinRepository.findOne({
          userId: userId,
        });
        if (!verification) {
          reject({
            message: `Session expired try again.`,
          });
        }
        resolve(verification);
      } catch (error) {
        reject(error);
      }
    });
  }
}
