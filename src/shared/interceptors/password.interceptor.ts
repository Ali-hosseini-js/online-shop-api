import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { response } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(() => {
        const newResponse = JSON.parse(JSON.stringify(response));

        delete newResponse.password;

        return newResponse;
      }),
    );
  }
}
