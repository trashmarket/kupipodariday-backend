import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludePassOwnerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isArray(data)) {
          return data.map((wish) => {
            const { password, ...interceptedData } = wish.owner;
            return { ...wish, owner: interceptedData };
          });
        }
        const { password, ...interceptedData } = data.owner;
        return { ...data, owner: interceptedData };
      }),
    );
  }
}
