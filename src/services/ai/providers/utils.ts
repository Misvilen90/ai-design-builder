/**
 * Helper to call a function with retry logic and timeout.
 * - Retries up to `maxRetries` times (default 3)
 * - Waits `delayMs` between retries (default 2000ms)
 * - Timeout after `timeoutMs` (default 15000ms)
 */
export async function callWithRetryAndTimeout<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 2000,
  timeoutMs: number = 15000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Race the function call against a timeout promise
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out after 15s')), timeoutMs)
        )
      ]);
      return result;
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI Provider] Attempt ${attempt} failed: ${err?.message || String(err)}`);
      
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}
