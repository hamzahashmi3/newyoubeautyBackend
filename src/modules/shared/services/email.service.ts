import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'process';
import { config as dotEnvConfig } from 'dotenv';
// import { forgotPassword } from 'src/modules/templates/forgot-password';
// import { confirmationEmail } from 'src/modules/templates/email-verification';

dotEnvConfig();
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 465,
  secure: false,
  auth: {
    user: '2047ebaba7caf7',
    pass: 'ade498b28d33ce',
  },
});
@Injectable()
export class EmailServices {
  async sendForgotPasswordEmail(to, code, name) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: env.FROM_EMAIL,
        to: to,
        subject: 'Forgot Password Email!',
        html: `Hello ${name},<br><br> Please use this code to reset your password: ${code}`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(
            `Hello ${name},<br><br> Please use this code to reset your password: ${code}`,
            info,
          );
          resolve(info);
        }
      });
    });
  }
  public async sendEmail(to, text) {
    return new Promise(async (resolve, reject) => {
      const mailOptions = {
        to: to, // list of receivers
        from: env.FROM_EMAIL, // sender address
        // subject: sub, // Subject line
        text: text, // plaintext body
        // html: html, // HTML body content

        // text, html = '', sub = 'One-Of-Mint'
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(info, '#####');
          resolve(info);
        }
      });
    });
  }
}
