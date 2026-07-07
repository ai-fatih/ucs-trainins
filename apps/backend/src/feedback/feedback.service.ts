import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

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
      return { success: true };
    }

    const request = await this.prisma.request.findUnique({
      where: { feedbackToken: token },
      select: { feedbackSubmittedAt: true },
    });
    if (!request) {
      throw new NotFoundException('Feedback link not found');
    }
    throw new ConflictException('Feedback has already been submitted');
  }
}
