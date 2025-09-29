import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionValidationService } from '../session-validation.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessionValidationService: SessionValidationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionToken = this.extractTokenFromHeader(request);

    if (!sessionToken) {
      throw new UnauthorizedException('Session token not provided');
    }

    try {
      const sessionData = await this.sessionValidationService.validateSession(sessionToken);
      request.user = sessionData.user;
      request.session = sessionData.session;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
