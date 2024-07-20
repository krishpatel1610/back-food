/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // eslint-disable-n ext-line prettier/prettier
    return 'Hello World!';
  }
}
