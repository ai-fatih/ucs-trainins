import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AUTH_COOKIE_NAME } from './auth.constants';
import type { AuthenticatedRequest } from './auth.types';
import { CookieAuthGuard } from './cookie-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('admin/login')
  @HttpCode(200)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ admin: { id: string; email: string } }> {
    const result = await this.authService.login(body.email, body.password);
    response.cookie(AUTH_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      maxAge: result.maxAge,
      path: '/',
    });
    return { admin: result.admin };
  }

  @Post('admin/logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      path: '/',
    });
  }

  @Get('me')
  @UseGuards(CookieAuthGuard)
  getMe(@Req() request: AuthenticatedRequest): { admin: { id: string; email: string } } {
    return { admin: request.admin };
  }
}
