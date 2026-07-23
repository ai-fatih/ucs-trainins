import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: PinoLogger) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    this.$on('query' as never, (event: { query: string; params: string; duration: number }) => {
      this.logger.debug({ query: event.query, params: event.params, duration: event.duration }, 'prisma query');
    });
    this.$on('warn' as never, (event: { message: string }) => {
      this.logger.warn({ message: event.message }, 'prisma warning');
    });
    this.$on('error' as never, (event: { message: string }) => {
      this.logger.error({ message: event.message }, 'prisma error');
    });
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
