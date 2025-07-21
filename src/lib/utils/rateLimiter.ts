/**
 * Rate limiter utility for API calls
 * Ensures minimum delay between API requests to respect rate limits
 */

class RateLimiter {
  private lastRequestTime: number = 0;
  private minInterval: number;

  constructor(minIntervalMs: number) {
    this.minInterval = minIntervalMs;
  }

  async waitForNextRequest(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      console.log(`Rate limiter: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }
}

// Create a global rate limiter for Dhan API (minimum 3 seconds between requests)
export const dhanApiRateLimiter = new RateLimiter(3000);

/**
 * Wrapper function to rate limit any async function
 */
export async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  await dhanApiRateLimiter.waitForNextRequest();
  return fn();
}
