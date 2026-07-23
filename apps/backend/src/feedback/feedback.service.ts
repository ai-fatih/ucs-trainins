import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FeedbackService.name);
  }

  async findByToken(token: string) {
    const request = await this.prisma.request.findUnique({
      where: { feedbackToken: token },
      select: {
        number: true,
        organization: true,
        topic: true,
        status: true,
        serviceType: true,
        feedbackSubmittedAt: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Feedback link not found');
    }
    const { feedbackSubmittedAt, ...publicRequest } = request;
    return {
      ...publicRequest,
      feedbackSubmitted: feedbackSubmittedAt !== null,
    };
  }

  async submit(token: string, dto: SubmitFeedbackDto): Promise<{ success: true }> {
    const result = await this.prisma.request.updateMany({
      where: { feedbackToken: token, feedbackSubmittedAt: null },
      data: {
        feedbackRating: dto.rating,
        feedbackText: dto.text?.trim() || null,
        feedbackCustomerName: dto.customerName?.trim() || null,
        feedbackSubmittedAt: new Date(),
      },
    });

    if (result.count === 1) {
      this.logger.info({ token, rating: dto.rating }, 'feedback submitted');
      await this.audit.log({
        action: 'submit_feedback',
        entity: 'feedback',
        detail: `Feedback submitted for token ${token}, rating: ${dto.rating}`,
      });
      return { success: true };
    }

    const request = await this.prisma.request.findUnique({
      where: { feedbackToken: token },
      select: { feedbackSubmittedAt: true },
    });
    if (!request) {
      throw new NotFoundException('Feedback link not found');
    }
    this.logger.warn({ token }, 'duplicate feedback attempt');
    throw new ConflictException('Feedback has already been submitted');
  }
}
