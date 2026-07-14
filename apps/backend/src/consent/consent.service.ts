import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConsentLogDto } from './dto/create-consent-log.dto';

@Injectable()
export class ConsentService {
  constructor(private readonly prisma: PrismaService) {}

  async logConsent(
    dto: CreateConsentLogDto,
    ip?: string,
    userAgent?: string,
  ) {
    return this.prisma.consentLog.create({
      data: {
        consentType: dto.consentType,
        page: dto.page || null,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    });
  }
}
