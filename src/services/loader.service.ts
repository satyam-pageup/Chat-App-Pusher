import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public showLoader$: Subject<void> = new Subject<void>();
  public apiCnt: number = 0;

  constructor() { }

  public showLoader(){
    this.apiCnt++;
    this.showLoader$.next();
  }

  public stopLoader(){
    this.apiCnt --;
    this.showLoader$.next();
  }

}
