import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getIndianDateString, getIndianHour, isIndianCurfewActive } from '../common/time.helper.js';

@Injectable()
export class CronService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CronService.name);
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private curfewInterval: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.logger.log(`⏰ Native IST Cron Engine initialized for NEET 2027 (Asia/Kolkata)`);

    // 1. Keep-Alive Heartbeat every 10 minutes
    this.heartbeatInterval = setInterval(() => {
      this.handleKeepAliveHeartbeat();
    }, 10 * 60 * 1000);

    // 2. Curfew & Day Change Check every 60 seconds
    this.curfewInterval = setInterval(() => {
      this.handlePeriodicCheck();
    }, 60 * 1000);

    // Immediate initial check
    this.handleKeepAliveHeartbeat();
  }

  onModuleDestroy() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.curfewInterval) clearInterval(this.curfewInterval);
  }

  private handleKeepAliveHeartbeat() {
    const memoryMB = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
    const isCurfew = isIndianCurfewActive();
    this.logger.log(
      `💓 [IST HEARTBEAT] ${getIndianDateString()} • Memory: ${memoryMB} MB • Uptime: ${Math.round(process.uptime())}s • Curfew: ${isCurfew ? 'ACTIVE (Night)' : 'DAYTIME'}`
    );
  }

  private lastCurfewLoggedHour: number | null = null;
  private handlePeriodicCheck() {
    const currentHour = getIndianHour();
    if (currentHour === 22 && this.lastCurfewLoggedHour !== 22) {
      this.lastCurfewLoggedHour = 22;
      this.logger.warn(`🌙 [10:00 PM IST CURFEW] Akarsh Singh Night Curfew Activated! Sleep & Recovery mode.`);
    } else if (currentHour !== 22) {
      this.lastCurfewLoggedHour = null;
    }
  }
}
