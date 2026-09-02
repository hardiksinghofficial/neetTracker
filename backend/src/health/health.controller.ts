import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health & Keep-Alive')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check & Keep-Alive ping endpoint for cron jobs' })
  @ApiResponse({ status: 200, description: 'Server is healthy, warm, and active' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'NEET 2027 Tracker Backend API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      curfewStatus: new Date().getHours() >= 22 || new Date().getHours() < 6 ? 'Curfew Active (Resting)' : 'Active Study Hours',
    };
  }
}
