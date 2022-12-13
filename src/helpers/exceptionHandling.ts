import { BadRequestException } from '@nestjs/common';

/**
 * throw new bad request exception
 * @param msg
 * @constructor
 */
export const BadRequest = (msg: string) => {
  throw new BadRequestException(msg);
};

/**
 * generate random alphanumeric code up to given digit
 * @param digit
 */
export const generateRandomCode = (digit: number = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, digit + 2);
};
