import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e: any) {
      console.warn('⚠️ [PrismaService] Database connection not available on startup. API will attempt connection on query.');
    }
  }
}
