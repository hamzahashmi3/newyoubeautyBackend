import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { query, response, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CommonServices } from '../shared/services/common.service';
import { AwsService } from '../shared/services/aws.service';
import { EmailServices } from '../shared/services/email.service';

@Controller('user')
export class UserController extends CommonServices {
  constructor(
    private readonly userService: UserService,
    private readonly awsService: AwsService,
    private readonly emailService: EmailServices,
  ) {
    super();
  }

  @Get('viewUserProfile')
  // @UseGuards(JwtAuthGuard)
  async userProfile(@Body() body, @Req() req, @Query() query, @Res() res: any) {
    try {
      var addresses = [];
      const viewProfile = await this.userService.sharedFinById(query.userId);
      if (!viewProfile) {
        this.sendResponse(
          this.messages.userNotFound,
          viewProfile,
          HttpStatus.OK,
          res,
        );
      }
      this.sendResponse(this.messages.Success, viewProfile, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('getUserInfo')
  // @UseGuards(JwtAuthGuard)
  async userInfo(@Req() req, @Res() res: any) {
    try {
      const userInformation = await this.userService
        .sharedFind({
          _id: req.user.userId,
        })
        .populate('settings');
      return this.sendResponse(
        this.messages.Success,
        userInformation[0],
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Put('updateUserProfile')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profileImage' }, { name: 'coverImage' }]),
  )
  @UseGuards(JwtAuthGuard)
  async updateCollection(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param() param,
    @Req() req,
    @Res() res: any,
    @UploadedFiles() files: { profileImage; coverImage },
  ) {
    try {
      const obj: any = { ...updateProfileDto };
      if (files.profileImage) {
        const response = await this.awsService.uploadFile(
          files.profileImage[0],
        );
        response ? (obj['profileImage'] = response.Location) : null;
      }
      if (files.coverImage) {
        const response = await this.awsService.uploadFile(files.coverImage[0]);
        response ? (obj['coverImage'] = response.Location) : null;
      }
      if (updateProfileDto.email) {
        const checkUserWithEmail = await this.userService.findByEmail(
          updateProfileDto.email,
        );
        if (checkUserWithEmail && checkUserWithEmail._id != req.user.userId) {
          return this.sendResponse(
            'Email already registered',
            {},
            HttpStatus.CONFLICT,
            res,
          );
        }
      }
      const response = await this.userService.updateUserPofile(
        req.user.userId,
        obj,
      );
      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        console.log(error),
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('admin-dashboard-data')
  // @UseGuards(JwtAuthGuard)
  async adminDashboard(@Body() body, @Req() req, @Res() res: any) {
    try {
      const totalUsers = await this.userService.totalUsers();
      // .sharedFind({
      //   roles: { $in: ['creator'] },
      //   isDeleteUser: false,
      // })
      // .count();
      // const totalBuyers = await this.userService
      //   .sharedFind({
      //     roles: { $in: ['buyer'] },
      //     isDeleteUser: false,
      //   })
      //   .count();
      // const totalNfts = await this.marketPlaceService.listRepository
      //   .find({})
      //   .count();
      return this.sendResponse(
        this.messages.Success,
        {
          totalUsers,
          // totalCreators: totalSellers,
          // totalBuyers,
          // totalNfts
        },
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('get-user-list')
  // @UseGuards(JwtAuthGuard)
  async getUserList(@Body() body, @Req() req, @Res() res: any) {
    try {
      const userList = await this.userService.paginateUsers(
        req.query.page,
        req.query.limit,
      );
      return this.sendResponse(
        this.messages.Success,
        userList,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Get('admin-chart-data')
  // @UseGuards(JwtAuthGuard)
  async getAdminChartData(
    @Req() req,
    @Body() body,
    @Res() res: any,
    @Query() query,
  ) {
    try {
      let today: any = new Date();
      today.setHours(0, 0, 0, 0);
      let first = today.getDate() - today.getDay();
      let last = first + 6;
      let firstday = new Date(today.setDate(first)).toUTCString();
      let lastday = new Date(today.setDate(last)).toUTCString();
      let firstDayMonth = new Date(today.setDate(1));
      let lastDayMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      lastDayMonth.setHours(23, 59, 59, 0);
      today = new Date().setHours(0, 0, 0, 0);
      let resp = await Promise.all([
        this.userService.findAllChartData({
          soldTo: { $ne: '' },
          createdAt: {
            $gte: today,
          },
        }),
        this.userService.findAllChartData({
          soldTo: { $ne: '' },
          createdAt: {
            $gte: firstday,
            $lte: lastday,
          },
        }),
        this.userService.findAllChartData({
          soldTo: { $ne: '' },
          createdAt: {
            $gte: firstDayMonth,
            $lte: lastDayMonth,
          },
        }),
      ]);
      return this.sendResponse(this.messages.Success, resp, HttpStatus.OK, res);
    } catch (error) {
      console.log(error);
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  // @Put('blockUser')
  // // @UseGuards(JwtAuthGuard)
  // async blockUser(@Body() body, @Req() req, @Res() res: any) {
  //   try {
  //     const response = await this.userService.blockUser(body.userId);
  //     return this.sendResponse(
  //       this.messages.Success,
  //       response,
  //       HttpStatus.OK,
  //       res,
  //     );
  //   } catch (error) {
  //     return this.sendResponse(
  //       'Error',
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  // @Put('unblockUser')
  // // @UseGuards(JwtAuthGuard)
  // async unblockUser(@Body() body, @Req() req, @Res() res: any) {
  //   try {
  //     const response = await this.userService.unblockUser(body.userId);
  //     return this.sendResponse(
  //       this.messages.Success,
  //       response,
  //       HttpStatus.OK,
  //       res,
  //     );
  //   } catch (error) {
  //     return this.sendResponse(
  //       'Error',
  //       {},
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //       res,
  //     );
  //   }
  // }

  @Get('block/:id')
  // @UseGuards(AdminAuthGuard)
  async blockUser(@Req() req: any, @Res() res: any): Promise<any> {
    try {
      const resp = await this.userService.blockUser(req.params.id);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
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
  @Get('un-block/:id')
  // @UseGuards(AdminAuthGuard)
  async unBlock(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const resp = await this.userService.unBlockUser(req.params.id);
      return this.sendResponse(this.messages.Success, {}, HttpStatus.OK, res);
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

  @Get('deleteUser/:id')
  // @UseGuards(JwtAuthGuard)
  async deleteUser(@Body() body, @Req() req, @Res() res: any) {
    try {
      const response = await this.userService.deleteUser(req.params.id);
      return this.sendResponse(
        this.messages.Success,
        response,
        HttpStatus.OK,
        res,
      );
    } catch (error) {
      return this.sendResponse(
        'Error',
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
}
