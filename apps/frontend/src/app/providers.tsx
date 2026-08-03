'use client';
import { Component } from 'react';
import { logger } from '@/lib/logger';
import { RouteTracker } from '@/components/layout/RouteTracker';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children?: React.ReactNode }, ErrorBoundaryState> {
  declare refs: Record<string, never>;

  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    logger.error(`uncaught: ${error.message}`, { name: error.name, stack: error.stack });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <RouteTracker />
      {children}
    </ErrorBoundary>
  );
}
