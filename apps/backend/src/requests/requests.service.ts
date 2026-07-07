import { randomBytes, randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { CreateRequestDto } from './dto/create-request.dto';

const requestDetailsInclude = {
  comments: {
    orderBy: { createdAt: 'asc' as const },
    include: { adminUser: { select: { id: true, email: true } } },
  },
  history: {
    orderBy: { createdAt: 'asc' as const },
    include: { adminUser: { select: { id: true, email: true } } },
  },
};

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateRequestDto) {
    const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const number = `REQ-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;

    return this.prisma.request.create({
      data: {
        number,
        name: dto.name.trim(),
        contact: dto.contact.trim(),
        organization: dto.organization?.trim() || null,
        serviceType: dto.serviceType,
        topic: dto.topic.trim(),
        description: dto.description.trim(),
        history: { create: { toStatus: RequestStatus.new } },
      },
    });
  }

  findAll() {
    return this.prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        number: true,
        name: true,
        contact: true,
        organization: true,
        serviceType: true,
        topic: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: requestDetailsInclude,
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  async updateStatus(id: string, status: RequestStatus, adminUserId: string) {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Request not found');
    }

    if (existing.status === status) {
      return this.findOne(id);
    }

    await this.prisma.$transaction([
      this.prisma.request.update({ where: { id }, data: { status } }),
      this.prisma.requestHistory.create({
        data: {
          requestId: id,
          adminUserId,
          fromStatus: existing.status,
          toStatus: status,
        },
      }),
    ]);
    return this.findOne(id);
  }

  async addComment(
    id: string,
    adminUserId: string,
    dto: CreateRequestCommentDto,
  ) {
    await this.ensureExists(id);
    return this.prisma.requestComment.create({
      data: { requestId: id, adminUserId, text: dto.text.trim() },
      include: { adminUser: { select: { id: true, email: true } } },
    });
  }

  async createFeedbackLink(id: string): Promise<{ url: string; token: string }> {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Request not found');
    }

    if (!existing.feedbackToken) {
      const generatedToken = randomBytes(32).toString('hex');
      await this.prisma.request.updateMany({
        where: { id, feedbackToken: null },
        data: { feedbackToken: generatedToken },
      });
    }

    const requestWithToken = await this.prisma.request.findUnique({
      where: { id },
      select: { feedbackToken: true },
    });
    const token = requestWithToken?.feedbackToken;
    if (!token) {
      throw new NotFoundException('Feedback token was not created');
    }

    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL').replace(/\/$/, '');
    return { token, url: `${frontendUrl}/feedback/${token}` };
  }

  private async ensureExists(id: string): Promise<void> {
    const request = await this.prisma.request.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
  }
}
