import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { inject } from '@angular/core';

export class loaderInterceptor implements HttpInterceptor{

  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isSilentCall: boolean = (req.headers.get('issilentcall') == 'true')? true: false;
    const _loaderService: LoaderService = inject(LoaderService);

    if(!isSilentCall){
      _loaderService.showLoader();
    }

    return next.handle(req).pipe(
      finalize(
        () =>{
          if(!isSilentCall){
            _loaderService.hideLoader();
          }
        }
      )
    )
  }
}