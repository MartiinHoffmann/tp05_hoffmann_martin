import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  jwtToken: String = "";

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap(
      (evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
              let enteteAuthorization = evt.headers.get("Authorization");
              if (enteteAuthorization != null) {
                  let tab: Array<String> = enteteAuthorization.split(/Bearer\s+(.*)$/i);
                  if (tab.length > 1)
                      this.jwtToken = tab[1];
              }
          }
          else if (evt instanceof HttpRequest) {
              if (this.jwtToken != "")
              request = request.clone({ setHeaders: { Authorization: `Bearer ${this.jwtToken}` }});
          }
      },
      (error: HttpErrorResponse) => {
          switch (error.status) {
              case 400:
              case 401:
          }
          return of(null);
      }
  ));
  }
}
function req(req: any) {
  throw new Error('Function not implemented.');
}

