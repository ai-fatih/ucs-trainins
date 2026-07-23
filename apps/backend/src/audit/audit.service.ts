import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditEvent {
  adminId?: string;
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuditService.name);
  }

  async log(event: AuditEvent): Promise<void> {
    this.logger.info({ ...event }, `${event.action} ${event.entity}`);

    await this.prisma.adminAuditLog.create({
      data: {
        adminId: event.adminId,
        action: event.action,
        entity: event.entity,
        entityId: event.entityId,
        detail: event.detail,
        ip: event.ip,
        userAgent: event.userAgent,
      },
    });
  }
}
