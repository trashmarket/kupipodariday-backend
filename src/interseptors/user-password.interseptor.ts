import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludePassUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isArray(data)) {
          return data.map((user) => {
            const { password, ...interceptedData } = user;
            return interceptedData;
          });
        }
        const { password, ...interceptedData } = data;
        return interceptedData;
      }),
    );
  }
}
