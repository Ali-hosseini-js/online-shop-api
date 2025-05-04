import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log(request?.headers?.authorization);

    try {
      const token = request?.headers?.authorization;
      if (token) {
        const payload = await this.jwtService.verifyAsync(token);
        request['user'] = payload?._id;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
