import { Injectable } from '@nestjs/common';
import { getIndianDateString, getIndianTimeString } from './common/time.helper.js';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'online',
      service: 'NEET 2027 Prep Tracker API',
      version: '2.0.0',
      istDate: getIndianDateString(),
      istTime: getIndianTimeString(),
      docs: '/api/docs',
      health: '/health',
    };
  }
}
