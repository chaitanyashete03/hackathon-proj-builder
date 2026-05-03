// Exponential backoff self-healing utility
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Action failed, retrying in ${delayMs}ms... (${retries} left)`);
    await new Promise((res) => setTimeout(res, delayMs));
    return retry(fn, retries - 1, delayMs * 2);
  }
}
