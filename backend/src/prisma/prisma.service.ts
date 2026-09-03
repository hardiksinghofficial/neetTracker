import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const FALLBACK_DATABASE_URL = 'postgresql://neondb_owner:npg_XF8rY4vMkgqG@ep-bitter-wave-ayo258p8.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const isValidPostgresUrl = (url?: string): boolean => {
  return Boolean(url && url.startsWith('postgresql://') && !url.includes('localhost') && !url.includes('127.0.0.1'));
};

const activeDatabaseUrl = isValidPostgresUrl(process.env.DATABASE_URL) 
  ? process.env.DATABASE_URL! 
  : FALLBACK_DATABASE_URL;

process.env.DATABASE_URL = activeDatabaseUrl;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: activeDatabaseUrl,
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
