import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConsentService } from './consent.service';
import { CreateConsentLogDto } from './dto/create-consent-log.dto';

@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post()
  async logConsent(
    @Body() dto: CreateConsentLogDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] as string | undefined;
    const userAgent = req.headers['user-agent'];
    await this.consentService.logConsent(dto, ip, userAgent);
    return { success: true };
  }
}
