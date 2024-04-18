import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ComponentBase } from './shared/class/ComponentBase.class';
import { GetLoggedInUserDetailI } from './response/responseG.response';
import { UserI } from './response/user.response';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';

import { PusherService } from '../services/pusher.service';

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
  public channel: any;
  public channelList: string[] = [
    'EmpId_7-RId_9',
    'EmpId_5-RId_9',
    'EmpId_1-RId_9',
    'EmpId_3-RId_9',
    'EmpId_14-RId_9'
  ]

  constructor(private firebaseService: FirebaseService,
    public _utilService: UtilService,
    private _route: Router,
    private _pusherService: PusherService
  ) {
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

    // _pusherService.subcribeToChannelE.subscribe(
    //   (cName: string[]) => {
    //     _pusherService.initializePusher();
    //     cName.forEach(
    //       (name: string) => {
    //         this.channel = this._pusherService.subscribeToChannel(name);
    //         this.channel.bind('new-message', (data: any) => {
    //           console.log("hello", data);
    //         })
    //       }
    //     )
    //   }
    // )

        _pusherService.initializePusher();
    this.channel = _pusherService.subscribeToChannel('7-9');
    this.channel.bind('my-event', (data: any) => {
      console.log("hello", data);
    })
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
