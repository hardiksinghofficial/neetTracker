import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.badge.findMany();
  }

  async checkAndAward() {
    const badges = await this.prisma.badge.findMany({ where: { earnedDate: null } });
    
    // Very simplified check loop
    for (const badge of badges) {
      let earned = false;
      if (badge.conditionType === 'TESTS_TAKEN') {
        const count = await this.prisma.test.count();
        if (count >= badge.conditionThreshold) earned = true;
      }
      // other conditions would be checked similarly
      if (earned) {
        await this.prisma.badge.update({
          where: { id: badge.id },
          data: { earnedDate: new Date() }
        });
      }
    }
  }
}
