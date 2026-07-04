import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  // maximum number of retry attempts when 429 received
  private maxRetries = 3;
  // base delay in ms
  private scalingDuration = 1000;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error: any, i: number) => {
            const attempt = i + 1;
            if (error && error.status === 429 && attempt <= this.maxRetries) {
              const backoffTime = Math.pow(2, i) * this.scalingDuration;
              // wait and retry
              return timer(backoffTime);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }
}
