import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDataI, LoginModelI } from '../../model/login.model';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilService } from '../../../services/util.service';
import { ComponentBase } from '../../shared/class/ComponentBase.class';
import { APPRoutes } from '../../shared/constants/appRoutes.contant';
import { APIRoutes } from '../../shared/constants/apiRoutes.constant';
import { ResponseDataI } from '../../response/responseG.response';
import { UserI } from '../../response/user.response';
import { TokenDecodeService } from '../../../services/token-decode.service';
import { PusherService } from '../../../services/pusher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends ComponentBase {

  constructor(private _utilService: UtilService, private _tokenDecodeService: TokenDecodeService,private _pusherService:PusherService) {
    super();
    if (localStorage.getItem("jwtToken")) {
      // token exists => checking validity of token
      const data = _tokenDecodeService.getDecodedAccessToken(localStorage.getItem("jwtToken") as string);
      if (!data) {
        this._router.navigate(['/chat']);
      }
    }

  }

  public loginForm: FormGroup<LoginModelI> = new FormGroup<LoginModelI>({
    email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]),
    password: new FormControl(null, Validators.required)
  });


  public login() {
    this.loginForm.markAllAsTouched();

    this.isBtnLoaderActive = true;
    if (this.loginForm.valid) {
      const loginData: LoginDataI = this.loginForm.value as LoginDataI;

      this.postAPICallPromise<LoginDataI, ResponseDataI<UserI>>(APIRoutes.login, loginData, this.headerOption).then(
        (res) => {
          this._utilService.loggedInUserId = res.data.id;
          this._toastreService.success("Logged In success");
          this._router.navigate([APPRoutes.chat]);
          if (res.token) {
            localStorage.setItem("jwtToken", res.token);
            this._utilService.EShowUser.emit(true);
            this._pusherService.onlineUserF(res.data.id,true);
          }
        }
      )
    }
  }


}
