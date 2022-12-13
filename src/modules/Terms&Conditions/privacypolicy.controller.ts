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
import { CommonServices } from '../shared/services/common.service';
import { PrivacyPolicyService } from './privacypolicy.service';

@Controller('privacyPolicy')
export class PrivacyPolicyController extends CommonServices {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {
    super();
  }

  @Get('/getPrivacyPolicy')
  async getPrivacyPolicy(@Req() req: any, @Res() res: any): Promise<any> {
    try {
      return this.privacyPolicyService.getPrivacyPolicy(req, res);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Post('/createPrivacyPolicy')
  async createPrivacyPolicy(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      return this.privacyPolicyService.createPrivacyPolicy(body, res);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Put('/updatePrivacyPolicy')
  async updatePrivacyPolicy(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      return this.privacyPolicyService.updatePrivacyPolicy(body, req.docId);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }

  @Delete('/deletePrivacyPolicy')
  async deletePrivacyPolicy(
    @Req() req: any,
    @Res() res: any,
    @Body() body: any,
  ): Promise<any> {
    try {
      return this.privacyPolicyService.deletePrivacyPolicy(req.docId, res);
    } catch (error) {
      return this.sendResponse(
        error.message,
        {},
        HttpStatus.INTERNAL_SERVER_ERROR,
        res,
      );
    }
  }
// ---------------------------- Terms & Conditions ----------------------------

// @Get('/termsAndConditions')
//   async getTermsAndConditions(@Req() req: any, @Res() res: any): Promise<any> {
//     try {
//       return this.privacyPolicyService.getTermsAndConditions(req, res);
//     } catch (error) {
//       return this.sendResponse(
//         error.message,
//         {},
//         HttpStatus.INTERNAL_SERVER_ERROR,
//         res,
//       );
//     }
//   }

//   @Post('/createtermsAndConditions')
//   async createTermsAndConditions(
//     @Req() req: any,
//     @Res() res: any,
//     @Body() body: any,
//   ): Promise<any> {
//     try {
//       return this.privacyPolicyService.createTermsAndConditions(body, res);
//     } catch (error) {
//       return this.sendResponse(
//         error.message,
//         {},
//         HttpStatus.INTERNAL_SERVER_ERROR,
//         res,
//       );
//     }
//   }

//   @Put('/updatetermsAndConditions')
//   async updateTermsAndConditions(
//     @Req() req: any,
//     @Res() res: any,
//     @Body() body: any,
//   ): Promise<any> {
//     try {
//       return this.privacyPolicyService.updateTermsAndConditions(body, req.docId);
//     } catch (error) {
//       return this.sendResponse(
//         error.message,
//         {},
//         HttpStatus.INTERNAL_SERVER_ERROR,
//         res,
//       );
//     }
//   }

//   @Delete('/deletetermsAndConditions')
//   async deleteTermsAndConditions(
//     @Req() req: any,
//     @Res() res: any,
//     @Body() body: any,
//   ): Promise<any> {
//     try {
//       return this.privacyPolicyService.deleteTermsAndConditions(req.docId, res);
//     } catch (error) {
//       return this.sendResponse(
//         error.message,
//         {},
//         HttpStatus.INTERNAL_SERVER_ERROR,
//         res,
//       );
//     }
//   }

}
