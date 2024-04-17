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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends ComponentBase {

  constructor(private firebaseService: FirebaseService, private _utilService: UtilService) {
    super();
  }

  public loginForm: FormGroup<LoginModelI> = new FormGroup<LoginModelI>({
    email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]),
    password: new FormControl(null, Validators.required)
  });


  public login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const loginData: LoginDataI = this.loginForm.value as LoginDataI;

      this.postAPICallPromise<LoginDataI, ResponseDataI<UserI>>(APIRoutes.login, loginData, this.headerOption).then(
        (res) => {
          this._utilService.loggedInUserId = res.data.id;
          this._toastreService.success("Logged In success");
          this._router.navigate([APPRoutes.chat]);
          if (res.token) {
            localStorage.setItem("jwtToken", res.token);
            this._utilService.showUser.emit(true);
          }
        }
      )
    }
  }


}
