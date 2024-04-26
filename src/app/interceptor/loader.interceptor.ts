import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

// export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };


export class loaderInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log("req.headers: ", req.headers);
    return next.handle(req);
  }
}