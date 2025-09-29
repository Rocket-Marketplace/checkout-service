import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface SessionValidationResponse {
  valid: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
  };
  session: {
    id: string;
    expiresAt: string;
    createdAt: string;
  };
}

@Injectable()
export class SessionValidationService {
  private readonly logger = new Logger(SessionValidationService.name);
  private readonly usersServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL', 'http://localhost:3002');
  }

  async validateSession(sessionToken: string): Promise<SessionValidationResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/sessions/validate/${sessionToken}`)
      );

      if (!response.data.valid) {
        throw new UnauthorizedException('Invalid session');
      }

      return response.data;
    } catch (error) {
      this.logger.error('Session validation failed:', error);
      throw new UnauthorizedException('Session validation failed');
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/users/${userId}`)
      );

      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user:', error);
      throw new UnauthorizedException('User not found');
    }
  }
}
