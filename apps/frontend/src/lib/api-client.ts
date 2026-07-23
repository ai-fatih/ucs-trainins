export type ServiceType = 'training' | 'consultation' | 'other';
export type RequestStatus = 'new' | 'in_progress' | 'done' | 'rejected';

export interface CreateRequestInput {
  name: string;
  contact: string;
  organization?: string;
  serviceType: ServiceType;
  topic: string;
  description: string;
}

export interface ServiceRequest extends Omit<CreateRequestInput, 'organization'> {
  id: string;
  number: string;
  organization: string | null;
  status: RequestStatus;
  feedbackToken: string | null;
  feedbackRating: number | null;
  feedbackText: string | null;
  feedbackCustomerName: string | null;
  feedbackSubmittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: RequestComment[];
  history?: RequestHistory[];
}

export interface RequestComment {
  id: string;
  text: string;
  createdAt: string;
  adminUser: { id: string; email: string };
}

export interface RequestHistory {
  id: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  createdAt: string;
  adminUser: { id: string; email: string } | null;
}

export interface FeedbackRequestSummary {
  number: string;
  organization: string | null;
  topic: string;
  status: RequestStatus;
  serviceType: ServiceType;
  feedbackSubmitted: boolean;
}

import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET';
  logger.info(`API ${method} ${path}`);

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { message?: string | string[] }
        | null;
      const message = Array.isArray(body?.message)
        ? body.message.join(', ')
        : body?.message ?? 'Ошибка запроса к серверу';
      logger.error(`API ${method} ${path} ${response.status} — ${message}`);
      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      logger.info(`API ${method} ${path} 204`);
      return undefined as T;
    }

    logger.info(`API ${method} ${path} ${response.status}`);
    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error(`API ${method} ${path} — ${(error as Error).message}`);
    throw error;
  }
}

export const apiClient = {
  auth: {
    login: (email: string, password: string) =>
      request<{ admin: { id: string; email: string } }>('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<void>('/auth/admin/logout', { method: 'POST' }),
    me: () => request<{ admin: { id: string; email: string } }>('/auth/me'),
  },
  requests: {
    create: (input: CreateRequestInput) =>
      request<ServiceRequest>('/requests', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    list: () => request<ServiceRequest[]>('/requests'),
    get: (id: string) => request<ServiceRequest>(`/requests/${id}`),
    updateStatus: (id: string, status: RequestStatus) =>
      request<ServiceRequest>(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    addComment: (id: string, text: string) =>
      request<RequestComment>(`/requests/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
    createFeedbackLink: (id: string) =>
      request<{ url: string; token: string }>(`/requests/${id}/feedback-link`, {
        method: 'POST',
      }),
  },
  consent: {
    log: (data: { consentType: string; page?: string }) =>
      request<{ success: true }>('/consent', {
        method: 'POST',
        body: JSON.stringify(data),
      }).catch(() => ({ success: false })),
  },
  feedback: {
    get: (token: string) => request<FeedbackRequestSummary>(`/feedback/${token}`),
    submit: (
      token: string,
      input: { rating: number; text?: string; customerName?: string },
    ) =>
      request<{ success: true }>(`/feedback/${token}`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },
};
