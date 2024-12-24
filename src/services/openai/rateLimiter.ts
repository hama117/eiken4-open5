class RateLimiter {
  private requests: number[] = [];
  private readonly windowMs = 60000; // 1分
  private readonly maxRequests = 20; // 1分あたりの最大リクエスト数

  canMakeRequest(): boolean {
    this.cleanOldRequests();
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  private cleanOldRequests(): void {
    const now = Date.now();
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.windowMs
    );
  }
}

export const rateLimiter = new RateLimiter();