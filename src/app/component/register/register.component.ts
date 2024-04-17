import { Component } from '@angular/core';
import { RegisterDataI, RegisterModelI } from '../../model/register.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResponseGI } from '../../response/responseG.response';
import { ComponentBase } from '../../shared/class/ComponentBase.class';
import { APPRoutes } from '../../shared/constants/appRoutes.contant';
import { APIRoutes } from '../../shared/constants/apiRoutes.constant';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends ComponentBase {

  public registerForm: FormGroup<RegisterModelI> = new FormGroup<RegisterModelI>({
    name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.pattern(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)]),
    password: new FormControl(null, Validators.required),
    employeeType: new FormControl(0),
    address: new FormControl(""),
    city: new FormControl(""),
    country: new FormControl(""),
    phone: new FormControl(""),
    departmentID: new FormControl(1),
  });

  public register(){
    this.registerForm.markAllAsTouched();

    if(this.registerForm.valid){
      this.isBtnLoaderActive = true;
      const registerData: RegisterDataI = this.registerForm.value as RegisterDataI;

      this.postAPICallPromise<RegisterDataI, ResponseGI<null, null>>(APIRoutes.register, registerData, this.headerOption).then(
        (res) =>{
          if(res.status == "success"){
            this._toastreService.success(res.message);
            this._router.navigate([APPRoutes.login]);
          }
        }
      );
    }
  }

}
