import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ComponentBase } from './shared/class/ComponentBase.class';
import { IResponseG } from './response/responseG.response';
import { UserI } from './response/user.response';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';

import { PusherService } from '../services/pusher.service';
import { MessageI } from './model/chat.model';

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

  private channel: any;
  private userActiveChannel: any;

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

    this.subscribeChannelByName("chat-channel");
    // _pusherService.initializeUserPusher();
    this.subcribeUserActiveChannel();
  }

  ngOnInit(): void {
    if (localStorage.getItem("jwtToken")) {
      this.showChatMessages = true;
    }
  }

  public logout() {
    this.showChatMessages = false;
    localStorage.clear();
    this._route.navigate(['/login']);
  }

  private subscribeChannelByName(channelName: string) {
    // this._pusherService.initializePusher();
    this.channel = this._pusherService.subscribeToChannel(channelName);

    this.channel.bind('my-event', (data: MessageI) => {
      this._pusherService.messageReceivedE.emit(data);
    });
  }

  private subcribeUserActiveChannel(){
    this.userActiveChannel = this._pusherService.subscribeUserChatChannel('heas');

    this.userActiveChannel.bind('active-user-event', (data: any) => {
      console.log(data);
    });
  }
}
