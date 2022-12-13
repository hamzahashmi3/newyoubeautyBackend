import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CommonServices } from '../shared/services/common.service';
import { UserService } from '../user/user.service';
import { emailRegex, nameRegex } from 'src/constants/auth';
import { generateRandomNumber } from 'src/helpers/commmon.helper';
import { VerificationService } from '../verification/verification.service';
import { EmailServices } from '../shared/services/email.service';
import { Model } from 'mongoose';
import { jwtConstants, VERIFICATION_REPOSITORY } from 'src/constants';
import { IVerificationDocument } from '../verification/verification.schema';
import { generateRandomCode } from '../../helpers/exceptionHandling';
import { BadRequestException } from '@nestjs/common';
// import { OAuth2Client } from 'google-auth-library';
// import { GoogleStrategy } from 'passport-google-oauth2';

// const client = new OAuth2Client(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
// );

// var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

@Injectable()
export class AuthService extends CommonServices {
  constructor(
    @Inject(VERIFICATION_REPOSITORY)
    readonly verificatoinRepository: Model<IVerificationDocument>,
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly verificationService: VerificationService,
    private readonly emailService: EmailServices,
  ) {
    super();
  }

  async validateUser(identifier: string): Promise<any> {
    const user = await this.userService.userRepository.findOne({
      metamaskId: identifier,
    });
    if (user) {
      return user;
    }
    return null;
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.userService.findOne({ email: email });

    if (!user) {
      throw new Error('No user found with this email');
    }
    const { _id } = user;
    const code = generateRandomNumber();
    await this.verificationService.createCode(code, _id);
    const data = await this.emailService.sendForgotPasswordEmail(
      email,
      code,
      user.firstName,
    );
    console.log(data);
    return data;
    // const mailRes = await Mailer.sendForgotPasswordEmail(email, code);
  }

  async resetUserPassword(body: any) {
    const { email, password } = body;
    // const { email, code, password } = body;
    const user = await this.userService.findOne({ email: email });

    if (!user) {
      throw new Error('No user found with this email');
    }
    const verification: any = await this.verificationService.findByUserId(
      user._id,
    );
    if (verification.isVerified) {
      // if (verification.code === code) {
      //   verification.isVerified = true;
      //   verification.save();
      const bcryptPass = bcrypt.hashSync(password, jwtConstants.salt);
      user.password = bcryptPass;
      const data = await user.save();
      return data;
    } else {
      throw new Error('Incorrect pin code entered');
    }
  }

  async verifyOTP(body: any) {
    const { email, code } = body;
    const user = await this.userService.findOne({ email: email });

    if (!user) {
      throw new Error('No user found with this email');
    }
    const verification: any = await this.verificationService.findByUserId(
      user._id,
    );
    if (verification.code === code) {
      verification.isVerified = true;
      verification.save();
      return verification;
      // const bcryptPass = bcrypt.hashSync(password, jwtConstants.salt);
      // user.password = bcryptPass;
      // const data = await user.save();
      // return data;
    } else {
      throw new Error('Incorrect pin code entered');
    }
  }

  async login(user: any, body: any = {}) {
    const payload = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      roles: user.roles,
      location: user.location,
      privacy: user.privacy,
      isActive: user.isActive,
      isBlocked: user.isBlocked,
      emailVerified: user.emailVerified,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '60d' }),
      user: payload,
    };
  }

  async checkSignUpValidation(body: any) {
    try {
      const errors = [];
      const [checkUser] = await Promise.all([
        this.userService.findOne({
          email: body.email,
        }),
      ]);
      if (checkUser && checkUser.email) {
        errors.push({
          message: `${checkUser.email} already registered`,
        });
      } else if (checkUser && checkUser.email) {
        errors.push({ message: `${checkUser.email} already registered` });
      } else {
        const re = emailRegex;
        if (!re.test(String(body.email).toLowerCase())) {
          errors.push({ email: this.messages.invalidEmailFormat });
        }
      }
      return [body, errors];
    } catch (error) {
      throw error;
    }
  }

  /**
   * forgot password
   * get email id and check if user exists or not
   * if yes return unique code
   * @param emailId
   */
  async forgotPassword(emailId: string) {
    const userDetails = await this.userService.findOne({
      filter: { emailId: emailId },
    });

    if (!userDetails) {
      throw new BadRequestException('User not found');
    }
    try {
      await this.sendPasswordResetEmail(emailId);
      return 'Reset password code sent to your email address successfully';
    } catch (e) {
      throw e;
    }
  }

  // async googleLogin(req) {
  //   if (!req.user) {
  //     console.log('No user from google');
  //     return 'No user from google';
  //   }
  //   console.log(req.user);
  //   return {
  //     message: 'User information from google',
  //     user: req.user,
  //   };
  // }

  // async googleLogin(token: string, roles: any) {
  //   const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: process.env.CLIENT_ID,
  //   });
  //   const payload = ticket.getUserId();
  //   const { name, email, picture } = ticket.getPayload();
  //   const userId = payload;
  //   const firstName = name.split(' ')[0];
  //   const lastName = name.split(' ')[1];
  //   const userName =
  //     firstName.toLowerCase() + '' + lastName.toLocaleLowerCase();
  //   let user = await this.userService.findOneAndUpdate(email, {
  //     firstName,
  //     lastName,
  //     email,
  //     profileImage: picture,
  //     roles: 'buyer',
  //     googleId: userId,
  //   });
  //   if (!user) {
  //     user = await this.userService.create({
  //       firstName,
  //       lastName,
  //       email: email,
  //       profileImage: picture,
  //       roles: 'buyer',
  //       googleId: userId,
  //     });
  //   }
  //   const data = await this.login(true, user);
  //   return data;
  // }

  // ------------------------------------------------------------ADMIN AUTHENTICATION------------------------------------------------------------
}
