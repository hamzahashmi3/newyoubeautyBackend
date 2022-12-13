import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { USER_REPOSITORY, VERIFICATION_REPOSITORY } from 'src/constants';
import { sharedCrudService } from '../shared/services/sharedCrud.services';
import { IUserDocument } from './user.schema';
import { verificationTypes } from 'src/constants/auth';
import { VerificationService } from '../verification/verification.service';
import { IVerificationDocument } from '../verification/verification.schema';
import { generateRandomNumber } from 'src/helpers/commmon.helper';
import { EmailServices } from '../shared/services/email.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable()
export class UserService extends sharedCrudService {
  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    readonly verificatoinRepository: Model<IVerificationDocument>,
    @Inject(USER_REPOSITORY) readonly userRepository: Model<IUserDocument >,
    private readonly verificationService: VerificationService,
    private mailService: EmailServices,
  ) {
    super(userRepository);
  }

  async create(info: any): Promise<any> {
    const user = await this.userRepository.create(info);
    return user;
  }
  async findOne(clause: {
    [key: string]: any;
  }): Promise<any | undefined> {
    return await this.userRepository.findOne(clause);
  }
  async validateUserEmail(email: string, pass: string): Promise<any> {
    const user: any = await this.userRepository.findOne({
      email: email,
    });
    if (!user) {
      throw new HttpException('Incorrect Credentials', HttpStatus.NOT_FOUND);
    }
    if (user && bcrypt.compareSync(pass, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }
  async findByEmail(email: string): Promise<IUserDocument | undefined | any> {
    return this.userRepository.findOne({ email: email });
  }
  async updateProfile(body: any, userId: string) {
    return await this.userRepository.findByIdAndUpdate(
      userId,
      {
        ...body,
      },
      {
        new: true,
      },
    );
  }
  async updateUserPofile(_id: IUserDocument, data: IUserDocument) {
    return await this.userRepository.findByIdAndUpdate(_id, data, {
      new: true,
    });
  }
  async findOneAndUpdate(
    email: string,
    data,
  ): Promise<IUserDocument | undefined > {
    const results = await this.userRepository.findOneAndUpdate(
      { email: email },
      data,
    );
    return results;
  }

  async totalUsers() {
    return await this.userRepository.countDocuments();
  }

  async getUserList() {
    return await this.userRepository.find();
  }

  async paginateUsers(page: number, limit: number) {
    return await this.userRepository
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findAllChartData(query: any): Promise<any> {
    return await this.userRepository.find(query);
  }

  // async blockUser(userId: string) {
  //   return await this.userRepository.findByIdAndUpdate(userId, {
  //     isActive: false,
  //     isBlocked: true,
  //   });
  // }

  // async unblockUser(userId: string) {
  //   return await this.userRepository.findByIdAndUpdate(userId, {
  //     isActive: true,
  //     isBlocked: false,
  //   });
  // }


    async blockUser(userId: string) {
      return await this.userRepository.findByIdAndUpdate(userId, { 
        isActive: false,
      isBlocked: true,
    });
    }

    async unBlockUser(userId: string) {
      return await this.userRepository.findByIdAndUpdate(userId, { 
        isActive: true,
      isBlocked: false,
    });
    }

  async deleteUser(userId: string): Promise<any> {
    return await this.userRepository.deleteOne({ _id: userId });
  }


}
