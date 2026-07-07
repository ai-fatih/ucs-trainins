import { ServiceType } from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(254)
  contact: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  organization?: string;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  topic: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  description: string;
}
