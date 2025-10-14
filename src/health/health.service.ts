import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async getHealthStatus() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkProductsService(),
      this.checkRabbitMQ(),
    ]);

    const results = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: this.formatCheckResult(checks[0], 'Database'),
        productsService: this.formatCheckResult(checks[1], 'Products Service'),
        rabbitMQ: this.formatCheckResult(checks[2], 'RabbitMQ'),
      },
    };

    const hasUnhealthyChecks = Object.values(results.checks).some(
      (check: any) => check.status === 'unhealthy'
    );

    if (hasUnhealthyChecks) {
      results.status = 'unhealthy';
    }

    return results;
  }

  async getReadinessStatus() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRabbitMQ(),
    ]);

    const results = {
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: this.formatCheckResult(checks[0], 'Database'),
        rabbitMQ: this.formatCheckResult(checks[1], 'RabbitMQ'),
      },
    };

    const hasUnreadyChecks = Object.values(results.checks).some(
      (check: any) => check.status === 'unhealthy'
    );

    if (hasUnreadyChecks) {
      results.status = 'not ready';
    }

    return results;
  }

  async getLivenessStatus() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  private async checkDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'healthy', message: 'Database connection successful' };
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return { status: 'unhealthy', message: 'Database connection failed', error: error.message };
    }
  }

  private async checkProductsService() {
    try {
      const productsServiceUrl = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001';
      await firstValueFrom(
        this.httpService.get(`${productsServiceUrl}/health`, { timeout: 5000 })
      );
      return { status: 'healthy', message: 'Products service is reachable' };
    } catch (error) {
      this.logger.error('Products service health check failed:', error);
      return { status: 'unhealthy', message: 'Products service is unreachable', error: error.message };
    }
  }

  private async checkRabbitMQ() {
    try {
      const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672';
      const amqp = require('amqplib');
      const connection = await amqp.connect(rabbitmqUrl);
      await connection.close();
      return { status: 'healthy', message: 'RabbitMQ connection successful' };
    } catch (error) {
      this.logger.error('RabbitMQ health check failed:', error);
      return { status: 'unhealthy', message: 'RabbitMQ connection failed', error: error.message };
    }
  }

  private formatCheckResult(result: PromiseSettledResult<any>, serviceName: string) {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        status: 'unhealthy',
        message: `${serviceName} check failed`,
        error: result.reason?.message || 'Unknown error',
      };
    }
  }
}
