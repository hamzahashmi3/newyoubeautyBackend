import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { IUploadImage } from 'src/interfaces';

import { v4 as uuid } from 'uuid';
import { env } from 'process';

const AWS_S3_BUCKET = 'waffa-fe';
const s3 = new AWS.S3({
  accessKeyId: 'AKIA6D3LVYSFXP7BE7DF',
  secretAccessKey: '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',
  region: 'us-east-2',
});
@Injectable()
export class AwsService {
  async uploadFile(file: IUploadImage) {
    if (file && file.originalname) {
      const urlKey = `${uuid()}-${file.originalname}`;
      const params = {
        Body: file.buffer,
        Bucket: AWS_S3_BUCKET,
        Key: urlKey,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };
      const uploadResult: any = await s3.upload(params).promise();
      return uploadResult;
    }
    return null;
  }

  async uploadSyncFile(file: IUploadImage) {
    // if (file && file.originalname) {
    const urlKey = `${uuid()}-${file.originalname}`;
    const params = {
      Body: file.buffer,
      Bucket: AWS_S3_BUCKET,
      Key: urlKey,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    return s3.upload(params).promise();
  }

  async removeFile(urlKey: string) {
    const uploadResult: any = await s3
      .deleteObject({
        Bucket: AWS_S3_BUCKET,
        Key: urlKey,
      })
      .promise();
    // console.log(uploadResult);
    return uploadResult;
  }
  async getObjSignedUrl(urlKey: string) {
    const uploadResult: any = await s3.getSignedUrl('getObject', {
      Bucket: AWS_S3_BUCKET,
      Key: urlKey,
    });
    return uploadResult;
  }
}
