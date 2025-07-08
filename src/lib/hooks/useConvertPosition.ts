import { useState } from 'react';
import type { ConvertPositionRequest, ConvertPositionResponse } from '@/lib/types';

export function useConvertPosition() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const convertPosition = async (request: ConvertPositionRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/tradingapi/portfolio/convert-position', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data: ConvertPositionResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to convert position');
      }

      setSuccess(true);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert position';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    convertPosition,
    isLoading,
    error,
    success,
    reset,
  };
}
