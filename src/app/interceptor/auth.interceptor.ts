import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { APPRoutes } from '../shared/constants/appRoutes.contant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {


    // const modifiedReq = request.clone({
    //   headers: request.headers
    //     .set('Content-Type', 'application/json')
    // });
    const modifiedReq = request.clone();

    // unauthorized requests .

    if (request.headers.get('skip')) {
      return next.handle(modifiedReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');

            // this.sus.showToast('Some error occurred , Please retry.');

          } else {
            if (error.status == 500) {
              // this.sus.showToast('some error occurred ! , retry after some time.')
            } else if (error.status == 422 && error.error) {

            } else {

            }
          }
          return throwError(() => error);
        })
      );
    }

    // Authorized requests .

    const authorizedReq = modifiedReq.clone({
      headers: modifiedReq.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem(environment.tokenName)}`
      ),
    });

    return next.handle(authorizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.log('This is client side error');
          // this.sus.showToast('Some error occurred , Please retry.');
        } else {
          if (error.status == 401) {
            localStorage.removeItem(environment.tokenName);
            this.navigate(APPRoutes.login);
          } else if (error.status == 500) {
            // this.sus.showToast('some error occurred ! , retry after some time.')
          } else if (error.error) {

          } else {

          }
        }
        return throwError(error);
      })
    );
  }
  navigate(path: string) {
    // throw new Error('Method not implemented.');
  }
}


