import { Model } from 'mongoose';
import {
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CommonServices } from '../shared/services/common.service';
import { IPrivacyPolicyDocument } from './privacyPolicy.schema';
import { PRIVACYPOLICY_REPOSITORY } from 'src/constants';
import { log } from 'console';

@Injectable()
export class PrivacyPolicyService extends CommonServices {
  constructor(
    @Inject(PRIVACYPOLICY_REPOSITORY)
    readonly privacyPolicyRepository: Model<IPrivacyPolicyDocument>,
  ) {
    super();
  }

  async createPrivacyPolicy(info: any, res: any): Promise<any> {
    const { title, description } = info;
    try {
      const privacyPolicy = await this.privacyPolicyRepository.create({
        title,
        description,
      });
      console.log(privacyPolicy);
      return this.sendResponse(
        'Privacy Policy',
        privacyPolicy,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return error;
    }
  }

  async updatePrivacyPolicy(body: any, docId: string): Promise<any> {
    try {
      const privacyPolicy = await this.privacyPolicyRepository.updateOne(
        {
          _id: docId,
        },
        {
          $set: {
            title: body.title,
            description: body.description,
          },
        },
      );
      console.log(privacyPolicy);
      return privacyPolicy;
    } catch (error) {
      return error;
    }
  }

  async getPrivacyPolicy(req: any, res: any): Promise<any> {
    try {
      const privacyPolicy = await this.privacyPolicyRepository.findOne({});
      console.log(privacyPolicy);
      return this.sendResponse(
        'Privacy Policy',
        privacyPolicy,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  async deletePrivacyPolicy(docId: string, res: any): Promise<any> {
    try {
      const privacyPolicy = await this.privacyPolicyRepository.deleteOne({
        _id: docId,
      });
      console.log(privacyPolicy);
      return this.sendResponse(
        'Privacy Policy',
        privacyPolicy,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
}
