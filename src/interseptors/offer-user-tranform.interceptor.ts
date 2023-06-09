import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludePassUserOfferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isArray(data)) {
          return data.map((offer) => {
            const { password, ...intercepterdData } = offer.user;
            return { ...offer, user: intercepterdData };
          });
        }
        const { password, ...intercepterdData } = data.user;
        return { ...data, user: intercepterdData };
      }),
    );
  }
}
