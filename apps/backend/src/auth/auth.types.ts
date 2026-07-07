import type { Request } from 'express';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  admin: AuthenticatedAdmin;
}
