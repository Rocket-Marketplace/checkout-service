import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);

  async executeWithCircuitBreaker<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logger.error(`Circuit breaker opened for ${operationName}:`, error);
      if (fallback) {
        return await fallback();
      }
      throw error;
    }
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    operationName: string = 'operation'
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Attempt ${attempt}/${maxRetries} failed for ${operationName}:`, error);
        
        if (attempt < maxRetries) {
          await this.delay(delay * attempt);
        }
      }
    }
    
    this.logger.error(`All ${maxRetries} attempts failed for ${operationName}`);
    throw lastError || new Error(`Operation ${operationName} failed after ${maxRetries} attempts`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
