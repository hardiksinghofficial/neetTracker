import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTimetableDto, UpdateTimetableDto } from './dto/timetable.dto.js';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.timetableSlot.findMany({ include: { subject: true } });
  }

  findToday() {
    const days: DayOfWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = days[new Date().getDay()];
    return this.prisma.timetableSlot.findMany({
      where: { dayOfWeek: today },
      include: { subject: true }
    });
  }

  create(data: CreateTimetableDto) {
    return this.prisma.timetableSlot.create({ data });
  }

  update(id: number, data: UpdateTimetableDto) {
    return this.prisma.timetableSlot.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.timetableSlot.delete({ where: { id } });
  }
}
