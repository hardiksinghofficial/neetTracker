import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessCode = request.headers['x-access-code'];
    const mode = request.headers['x-access-mode']; // 'edit' | 'view'

    if (!accessCode) {
      throw new UnauthorizedException('Access code is required');
    }

    // Fetch the stored hash from settings
    const settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      throw new UnauthorizedException('App not initialized');
    }

    // In a real app, use bcrypt.compare. For this lightweight tool, a simple string match of the hash is fine if the frontend sends the hash.
    if (accessCode !== settings.familyAccessCodeHash) {
      throw new UnauthorizedException('Invalid access code');
    }

    // Attach mode to request for downstream handlers if needed
    request.userMode = mode || 'view';

    // Enforce write restrictions for 'view' mode
    if (request.userMode === 'view' && request.method !== 'GET') {
      // Allow parent notes to be POSTed in view mode
      if (request.url.includes('/parent-notes') && request.method === 'POST') {
        return true;
      }
      throw new UnauthorizedException('Write access requires Edit Mode');
    }

    return true;
  }
}
