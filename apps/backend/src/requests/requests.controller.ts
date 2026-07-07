import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CookieAuthGuard } from '../auth/cookie-auth.guard';
import { CreateRequestCommentDto } from './dto/create-request-comment.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() body: CreateRequestDto) {
    return this.requestsService.create(body);
  }

  @Get()
  @UseGuards(CookieAuthGuard)
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  @UseGuards(CookieAuthGuard)
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(CookieAuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateRequestStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.updateStatus(id, body.status, request.admin.id);
  }

  @Post(':id/comments')
  @UseGuards(CookieAuthGuard)
  addComment(
    @Param('id') id: string,
    @Body() body: CreateRequestCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.addComment(id, request.admin.id, body);
  }

  @Post(':id/feedback-link')
  @UseGuards(CookieAuthGuard)
  createFeedbackLink(@Param('id') id: string) {
    return this.requestsService.createFeedbackLink(id);
  }
}
