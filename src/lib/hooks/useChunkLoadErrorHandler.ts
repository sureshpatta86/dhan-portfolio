/**
 * Client-side chunk loading error handler
 */

'use client';

import { useEffect } from 'react';

export function useChunkLoadErrorHandler() {
  useEffect(() => {
    // Handle chunk loading errors globally
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      
      if (error && (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk'))) {
        console.warn('Chunk loading error detected, reloading page...');
        // Reload the page to recover from chunk loading errors
        window.location.reload();
      }
    };

    // Handle unhandled promise rejections that might be chunk loading errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      if (error && (
        error.name === 'ChunkLoadError' || 
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk')
      )) {
        console.warn('Chunk loading error detected in promise rejection, reloading page...');
        event.preventDefault();
        window.location.reload();
      }
    };

    // Add event listeners
    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

// Component that uses the hook
export function ChunkLoadErrorHandler() {
  useChunkLoadErrorHandler();
  return null;
}
