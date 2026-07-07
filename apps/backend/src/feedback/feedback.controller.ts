import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get(':token')
  findByToken(@Param('token') token: string) {
    return this.feedbackService.findByToken(token);
  }

  @Post(':token')
  submit(@Param('token') token: string, @Body() body: SubmitFeedbackDto) {
    return this.feedbackService.submit(token, body);
  }
}
