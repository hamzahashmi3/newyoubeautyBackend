import { Injectable } from '@nestjs/common';
import { en } from 'src/locales/en';
import { I18nResolver } from 'i18n-ts';

const i18n = {
  en: en,
  default: en,
};
@Injectable()
export class sharedCrudService {
  private service;
  public messages = new I18nResolver(i18n, 'en').translation;
  constructor(private serviceObj) {
    // super();
    this.service = serviceObj;
  }
  sharedCreate = (body) => {
    return this.service.create(body);
  };
  sharedUpdate = (clause, body) => {
    return this.service.updateOne(clause, body);
  };
  sharedUpdateMany = (clause) => {
    return this.service.updateMany(clause);
  };
  sharedFindOne = (clause) => {
    return this.service.findOne(clause);
  };
  sharedFinById = (clause) => {
    return this.service.findById(clause);
  };
  sharedFind = (clause) => {
    return this.service.find(clause);
  };
  sharedDelete = (clause) => {
    return this.service.deleteOne(clause);
  };
  sharedFindOneAndUpdate = (clause, body, options) => {
    return this.service.findOneAndUpdate(clause, body, options);
  };
  sharedFindByIdAndUpdate = (clause, body, options) => {
    return this.service.updateMany(clause, body, options);
  };
}
