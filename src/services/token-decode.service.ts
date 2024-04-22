import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TokenDecodeService {


  public helper = new JwtHelperService();

  constructor(private _toasterService:ToastrService) { }

  public getDecodedAccessToken(token: string): boolean {
    const decodedToken = this.helper.decodeToken(token);

    const currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);

    // TOKEN EXPIRED
    if(decodedToken.exp < currentUnixTimestamp){
      // this._authService.onLoginChange.emit(true);
      this._toasterService.error("Token expired, Please login again")
      return true;
    }


    // TOKEN NOT EXPIRED
    return false;
  }
}
