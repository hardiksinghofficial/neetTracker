import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { UpdateSettingsDto } from './dto/settings.dto.js';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get settings' })
  get() {
    return this.settingsService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Update settings' })
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}
