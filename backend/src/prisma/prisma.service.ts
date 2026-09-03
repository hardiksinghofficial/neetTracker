import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const FALLBACK_DATABASE_URL = 'postgresql://neondb_owner:npg_XF8rY4vMkgqG@ep-bitter-wave-ayo258p8.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || FALLBACK_DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ [PrismaService] Successfully connected to PostgreSQL database.');
    } catch (e: any) {
      console.warn('⚠️ [PrismaService] Initial DB connect warning:', e?.message || e);
    }
  }
}
