import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ComponentBase } from './shared/class/ComponentBase.class';
import { GetLoggedInUserDetailI } from './response/responseG.response';
import { UserI } from './response/user.response';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends ComponentBase implements OnInit {

  title = 'QuickChat';
  public userDetail!: UserI;
  public username: string = '';
  public showChatMessages: boolean = false;

  constructor(private firebaseService: FirebaseService, public _utilService: UtilService, private _route: Router) {
    super();
    this.firebaseService.requestPermission();
    this.firebaseService.listen();

    this._utilService.showUser.subscribe(
      (val: boolean) => {
        if (val) {
          this.showChatMessages = true;
         }
        else
          this.showChatMessages = false;
      }
    )
  }

  ngOnInit(): void {
    if (localStorage.getItem("jwtToken")) {
      // this.getLoggedInUserId();
      this.showChatMessages = true;
    }
  }

  public logout() {
    this.showChatMessages = false;
    localStorage.clear();
    this._route.navigate(['/login']);
  }

  private getLoggedInUserId() {
    this.getAPICallPromise<GetLoggedInUserDetailI<UserI>>('/userDetails', this.headerOption).then(
      (res) => {
        this.username = res.data.name;
        this._utilService.loggedInUserId = res.data.id;
      }
    )
  }
}
