import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { USER_REPOSITORY } from 'src/constants';
import { IUserDocument } from '../user/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

@Injectable()
export class Jwt2FAGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(USER_REPOSITORY) readonly userRepository: Model<IUserDocument>,
  ) {
    super();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handleRequest(err, user, info): Promise<any> {
    if (user && user.userId) {
      const getUser = await this.userRepository.findById(user.userId);
      if (getUser.isBlocked === true) {
        throw (
          err ||
          new UnauthorizedException('User is blocked please contact admin.')
        );
      }
    }
    if (user.isActive === false) {
      throw err || new UnauthorizedException();
    }

    if (err || !user) {
      console.log('ERROR', err);
      if (info === 'jwt expired') {
        throw new Error('Session expired kindly login again.');
      }
      throw err || new UnauthorizedException();
    }
    const bdUser = await this.userRepository.findById(user.userId);
    if (!bdUser) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
