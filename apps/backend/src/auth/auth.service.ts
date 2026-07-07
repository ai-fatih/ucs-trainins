import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_COOKIE_MAX_AGE } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<{
    token: string;
    maxAge: number;
    admin: { id: string; email: string };
  }> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!admin || !(await compare(password, admin.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.jwtService.signAsync(
      { sub: admin.id, email: admin.email },
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      token,
      maxAge: AUTH_COOKIE_MAX_AGE,
      admin: { id: admin.id, email: admin.email },
    };
  }
}
