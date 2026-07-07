import { RequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsEnum(RequestStatus)
  status: RequestStatus;
}
