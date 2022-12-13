import { Inject, Injectable } from '@nestjs/common';
import { I18nResolver } from 'i18n-ts';
import * as constants from '../../../constants'
import { en } from 'src/locales/en';
import { AppGateway } from 'src/app.gateway';

const i18n = {
  en: en,
  default: en,
};

@Injectable()
export class CommonServices{
  public messages = new I18nResolver(i18n, 'en').translation;
  public constants = constants;
  @Inject(AppGateway)
  public webSocketService: AppGateway
  constructor() {
  }

  /**
   * name
   */
  public sendResponse = (mesage, data, status, res) => {
    return res.status(status).json({
      message: mesage,
      data: data,
    });
  };

  public socketMessage = ({ to, data, type }: any) => {
    const payload = {
      to: to,
      data: data,
      type: type,
    };
    this.webSocketService.triggerCommentCreated(payload);
  };
}