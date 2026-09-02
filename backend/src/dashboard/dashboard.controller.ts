import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard summary' })
  getSummary() {
    return this.dashboardService.getSummary();
  }
}
