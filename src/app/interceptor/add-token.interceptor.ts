import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class addTokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // let modifiedReq = req.clone({
    //   headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
    // });

    const firebaseToken: string = "key=AAAAh5ZqmGI:APA91bFMcoceSX6HSScLVnHNQ7_SZd8J6YjuodbWHhojE-1ahiPltH_FW6osLWYWEepH_pqkyuQBQKDEEjr3VBlPxKDQkckY68BQ3JTATu_p2hmbB8GQoFhG6oCB4_6V1Cmf51Sjw0NO"
    let modifiedReq;


    if (req.headers.get('isSendNotification') == 'true') {
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', firebaseToken)
      })
      // modifiedReq.headers.set('Authorization', firebaseToken);

    }
    else {
      let jwtToken: string = '';

      if (localStorage.getItem("jwtToken")) {
        jwtToken = localStorage.getItem("jwtToken") as string;
      }
      // console.log(req.headers.get('isSendNotification'));
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
      });
    }

    return next.handle(modifiedReq);
  }
}

