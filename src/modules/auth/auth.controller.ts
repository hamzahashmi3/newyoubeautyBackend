import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CommonServices } from '../shared/services/common.service';
import {
  contactUsDto,
  landingSignupDto,
  LoginDto,
  SignupDto,
  forgetPasswordDto,
  adminSignupDTO,
} from './auth.dto';
import { UserService } from '../user/user.service';
import { jwtConstants } from 'src/constants';
import { Jwt2FAGuard, JwtAuthGuard } from './jwt-auth.guard';
import { EmailServices } from '../shared/services/email.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController extends CommonServices {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private mailService: EmailServices,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  @Post('/sendPasswordResetEmail')
  // async sendPasswordResetEmail(
  //   @Req() req: any,
  //   @Res() res: any,
  //   @Body() body: any,
  // ): Promise<any> {
  //   try {
  //     const { email } = req.body;
  //     const data = await this.authService.sendPasswordResetEmail(email);
  //     return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
  //   } catch (error) {
  //     return this.sendResponse(
  //       error.message,
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  @Get('/refetch')
  @UseGuards(JwtAuthGuard)
  async Refecth(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      const { user } = req;
      const userData = await this.userService.userRepository
        .findById(user.userId)
        .populate('settings');
      const response = await this.authService.login(userData, body);
      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/login')
  async login(
    @Req() req: any,
    @Res() res: any,
    @Body() body: LoginDto,
  ): Promise<any> {
    try {
      const email = body.email.toLowerCase().trim();
      const user = await this.userService.validateUserEmail(
        email,
        body.password,
      );
      if (!user) {
        return this.sendResponse(
          this.messages.InvalidCrdentials,
          {},
          HttpStatus.UNAUTHORIZED,
          res,
        );
      }
      if (user?.roles?.includes('admin')) {
        const adminLogin = await this.authService.login(user, body);
        console.log(adminLogin);
        return this.sendResponse(
          this.messages.adminloggedIn,
          adminLogin,
          HttpStatus.OK,
          res,
        );
      }
      if (user?.roles?.includes('user')) {
        const response = await this.authService.login(user, body);
        console.log(response);
        return this.sendResponse(
          this.messages.loggedIn,
          response,
          HttpStatus.OK,
          res,
        );
      }
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        this.messages.Error,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
  /**
   *  user sign up controller
   * @param req
   * @param data
   * @param res
   */

  //signup
  @Post('signup')
  async signup(
    @Req() req: Request,
    @Body() data: SignupDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const email = data.email.toLowerCase().trim();
      data.email = data.email.toLowerCase();
      const [body, errors] = await this.authService.checkSignUpValidation(data);

      if (errors.length > 0) {
        return this.sendResponse(
          errors[0].message,
          null,
          HttpStatus.BAD_REQUEST,
          res,
        );
      }
      const bcryptPass = bcrypt.hashSync(body.password, jwtConstants.salt);
      body.password = bcryptPass;
      const createUser = await this.userService.create({
        ...body,
      });
      const response = await this.authService.login(createUser, body);

      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.error(this.messages.Error, error);
      return this.sendResponse(
        this.messages.Error,
        null,
        HttpStatus.BAD_REQUEST,
        res,
      );
    }
  }

  //forgot password
  @Post('forgotPassword')
  async forgotPassword(
    @Req() req: Request,
    @Body() body: forgetPasswordDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const email = body.email.toLowerCase().trim();
      body.email = body.email.toLowerCase();
      const data = await this.authService.forgotPassword(email);
      return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
    } catch (error) {
      console.error(this.messages.Error, error);
      return this.sendResponse(
        this.messages.Error,
        null,
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('reset-password')
  async resetUserPassword(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      const data = await this.authService.resetUserPassword(body);
      return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('verifyOTP')
  async verifyOTP(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      const data = await this.authService.verifyOTP(body);
      return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: any,
    @Res() res: any,
    @Body() body,
  ): Promise<any> {
    try {
      const user = await this.userService.userRepository
        .findOne({ _id: req.user.userId })
        .select('+password');

      if (user && bcrypt.compareSync(body.currentPass, user.password)) {
        user.password = bcrypt.hashSync(body.newPass, jwtConstants.salt);
        await this.userService.userRepository.findByIdAndUpdate(
          user._id,
          { ...user },
          { new: true },
        );
        return this.sendResponse(
          this.messages.passwordChanged,
          {},
          HttpStatus.OK,
          res,
        );
      }

      return this.sendResponse(
        this.messages.passwordNotMatched,
        {},
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Internal server Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  // for google.strategy file
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return this.sendResponse('ok', {}, HttpStatus.INTERNAL_SERVER_ERROR, null);
  }

  // @Get('goolge/redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   return this.authService.googleLogin(req);
  // }

  // google login controller khizar
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: any) {
    const { user } = req;
    user.email = user.email.toLocaleLowerCase();
    let checkUser = await this.userService.findByEmail(user.email);
    if (!checkUser) {
      const data = {
        email: user.email,
        avatar: user.picture || '',
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.firstName.toLocaleLowerCase() + Date.now(),
        // uuid: uuidv4(),
        roles: ['user'],
        password: bcrypt.hashSync(
          `${new Date().getTime()}-ALS`,
          jwtConstants.salt,
        ),
      };
      checkUser = await this.userService.sharedCreate(data);
      await this.mailService.sendEmail(
        checkUser.email,
        '',
        // userRegistrationTemplate(`${env.FRONT_END}`),
        // 'Welcome to Vaffa',
      );
    }
    if (checkUser && !checkUser.firstName) {
      const data = {
        email: user.email,
        avatar: user.picture || '',
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.firstName.toLocaleLowerCase() + Date.now(),
        // uuid: uuidv4(),
        roles: ['user'],
        password: bcrypt.hashSync(
          `${new Date().getTime()}-ALS`,
          jwtConstants.salt,
        ),
      };
      checkUser = await this.userService.sharedFindOneAndUpdate(
        { _id: checkUser._id },
        data,
        { new: true },
      );
    }
    const loggedInUser = await this.authService.login(checkUser);
    res.redirect(`${process.env.FRONT_END}?token=${loggedInUser.access_token}`);
    // res.send(loggedInUser);
  }

  //gogle login controller waqar

  // @Post('/google') async loginByGoogle(
  //   @Req() req: any,
  //   @Res() res: Response,
  //   @Body() body: { token: string; role: any },
  // ): Promise<any> {
  //   try {
  //     const { token, roles } = req.body;
  //     const data = await this.authService.googleLogin(token, roles);
  //     // if (
  //     //   data?.user?.roles == 'buyer' &&
  //     //   data?.user?.asBuyerVerified == 'pending'
  //     // ) {
  //     //   const sendMail = await this.mailService.sendSignupMailBuyer(
  //     //     data.user.email,
  //     //     data.user._id,
  //     //     data.access_token,
  //     //   );
  //     // }

  //     // if (data?.user?.isBlocked === true) {
  //     //   return this.sendResponse(
  //     //     this.messages.userIsBlocked,
  //     //     {},
  //     //     HttpStatus.FORBIDDEN,
  //     //     res,
  //     //   );
  //     // }
  //     return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
  //   } catch (error) {
  //     return this.sendResponse(
  //       this.messages.Error,
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  //facebook login controller
  // @Post('/facebook') async loginByFacebook(
  //   @Req() req: any,
  //   @Res() res: Response,
  //   @Body() body: { token: string; role: any },
  // ): Promise<any> {
  //   try {
  //     const { token, roles } = req.body;
  //     const data = await this.authService.facebookLogin(token, roles);
  //     if (
  //       data?.user?.roles == 'buyer' &&
  //       data?.user?.asBuyerVerified == 'pending'
  //     ) {
  //       const sendMail = await this.mailService.sendSignupMailBuyer(
  //         data.user.email,
  //         data.user._id,
  //         data.access_token,
  //       );
  //     }
  //     if (data?.user?.isBlocked === true) {
  //       return this.sendResponse(
  //         this.messages.userIsBlocked,
  //         {},
  //         HttpStatus.FORBIDDEN,
  //         res,
  //       );
  //     }
  //     return this.sendResponse(this.messages.Success, data, HttpStatus.OK, res);
  //   } catch (error) {
  //     return this.sendResponse(
  //       this.messages.Error,
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  // @Get('/facebook')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLogin(): Promise<any> {
  //   return HttpStatus.OK;
  // }
  // @Get('/facebook/redirect')
  // @UseGuards(AuthGuard('facebook'))
  // async facebookLoginRedirect(
  //   @Req()
  //   req,
  //   @Res() res: Response,
  // ): Promise<any> {
  //   const {
  //     user: { user },
  //   } = req;
  //   user.email = user.email.toLocaleLowerCase();
  //   let checkUser = await this.userService.findByEmail(user.email);
  //   if (!checkUser) {
  //     const data = {
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       // uuid: uuidv4(),
  //       roles: ['buyer'],
  //       // username: user.firstName.toLocaleLowerCase() + Date.now(),
  //       password: bcrypt.hashSync(
  //         `${new Date().getTime()}-ALS`,
  //         jwtConstants.salt,
  //       ),
  //     };
  //     checkUser = await this.userService.sharedCreate(data);
  //     // await this.mailService.sendEmail(
  //     //   checkUser.email,
  //     //   '',
  //     //   userRegistrationTemplate(`${process.env.FRONT_END}`),
  //     //   'Welcome to oneofamint',
  //     // );
  //   }
  //   if (checkUser && !checkUser.firstName) {
  //     const data = {
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       // username: user.firstName.toLocaleLowerCase() + Date.now(),
  //       // uuid: uuidv4(),
  //       roles: ['buyer'],
  //       password: bcrypt.hashSync(
  //         `${new Date().getTime()}-ALS`,
  //         jwtConstants.salt,
  //       ),
  //     };
  //     checkUser = await this.userService.sharedFindOneAndUpdate(
  //       { _id: checkUser._id },
  //       data,
  //       { new: true },
  //     );
  //   }
  //   const loggedInUser = await this.authService.login(true, checkUser);
  //   res.redirect(`${process.env.FRONT_END}?token=${loggedInUser.access_token}`);
  // }

  // ----------------------------------------------ADMIN AUTH CONTROLLER----------------------------------------------
}
