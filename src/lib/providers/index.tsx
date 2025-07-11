/**
 * Main providers wrapper
 */

'use client';

import React from 'react';
import { ReactQueryProvider } from './react-query';
import { ToastProvider } from '@/lib/components/ui/ToastProvider';
import ChunkErrorBoundary from '@/components/ui/ChunkErrorBoundary';
import { ChunkLoadErrorHandler } from '@/lib/hooks/useChunkLoadErrorHandler';
import { ServiceWorkerRegistration } from '@/lib/hooks/useServiceWorker';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChunkErrorBoundary>
      <ReactQueryProvider>
        <ToastProvider>
          <ChunkLoadErrorHandler />
          <ServiceWorkerRegistration />
          {children}
        </ToastProvider>
      </ReactQueryProvider>
    </ChunkErrorBoundary>
  );
}
