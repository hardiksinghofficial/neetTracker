import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateSettingsDto } from './dto/settings.dto.js';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await this.prisma.appSettings.create({
        data: { id: 1, familyAccessCodeHash: 'default' }
      });
    }
    return settings;
  }

  async update(data: UpdateSettingsDto) {
    return this.prisma.appSettings.update({
      where: { id: 1 },
      data
    });
  }
}
