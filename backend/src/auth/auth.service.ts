import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async verify(code: string) {
    const settings = await this.prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings || settings.familyAccessCodeHash !== code) {
      throw new UnauthorizedException('Invalid access code');
    }
    return { success: true };
  }

  async setup(code: string) {
    return this.prisma.appSettings.upsert({
      where: { id: 1 },
      update: { familyAccessCodeHash: code },
      create: { id: 1, familyAccessCodeHash: code }
    });
  }
}
