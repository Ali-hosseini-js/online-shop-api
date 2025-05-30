import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log(request?.cookies?.access_token);

    try {
      const token = request?.cookies?.access_token;
      if (token) {
        const payload = await this.jwtService.verifyAsync(token);
        request['user'] = { _id: payload?._id, role: payload?.role };
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
