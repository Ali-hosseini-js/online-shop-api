import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class DuplicateFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code === 11000) {
      const duplicatedField = exception['keyValue']
        ? Object.keys(exception['keyValue'])[0]
        : 'unknown';
      response.status(409).send({
        message: `${duplicatedField} آیتم تکراری`,
        statusCode: 409,
      });
    }
  }
}
