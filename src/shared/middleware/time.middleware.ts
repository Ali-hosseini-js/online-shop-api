import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class TimeMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
