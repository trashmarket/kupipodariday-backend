import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { extractInterceptorCallback } from 'src/utils/general-utils';

@Injectable()
export class ExcludePassOwnerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => extractInterceptorCallback(data, 'owner')));
  }
}
