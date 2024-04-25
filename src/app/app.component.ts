import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ComponentBase } from './shared/class/ComponentBase.class';
import { UserI } from './response/user.response';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';

import { PusherService } from '../services/pusher.service';
import { MessageI } from './model/chat.model';
import { Channel } from 'pusher-js';
import { TokenDecodeService } from '../services/token-decode.service';
import { IUserStatus } from './model/util.model';

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
  private channel!: Channel;
  private activeUserChannel!: Channel;

  constructor(private firebaseService: FirebaseService,
    public _utilService: UtilService,
    private _route: Router,
    private _pusherService: PusherService,
    private _tokenDecodeService: TokenDecodeService
  ) {
    super();
    this.firebaseService.requestPermission();
    this.firebaseService.listen();
    this._utilService.EShowUser.subscribe(
      (val: boolean) => {
        if (val) {
          this.showChatMessages = true;
        }
        else
          this.showChatMessages = false;
      }
    )
    this.subscribeChatChannel("chat-channel");
    this.subscribeActiveUserChannel();
  }

  ngOnInit(): void {

    document.addEventListener('visibilitychange', () => {
      if (this._utilService.receiverId > -1) {
        this._pusherService.updateUserStatus(!document.hidden);
      }
    })

    if (localStorage.getItem("jwtToken")) {
      let isTokenExist = this._tokenDecodeService.getDecodedAccessToken(localStorage.getItem("jwtToken")!);
      if (!isTokenExist) {
        this.showChatMessages = true;
        this._route.navigate(['/chat']);
      }
      else {
        this._route.navigate(['/login']);
      }
    }
  }

  public logout() {
    this.showChatMessages = false;
    localStorage.clear();
    this._route.navigate(['/login']);
  }

  private subscribeChatChannel(channelName: string) {
    this.channel = this._pusherService.subscribeToChannel(channelName);
    this.channel.bind('my-event', (data: MessageI) => {
      this._pusherService.messageReceivedE.emit(data);
    });
  }
  private subscribeActiveUserChannel() {
    this.activeUserChannel = this._pusherService.subscribeToChannel('active-user-channel');
    this.activeUserChannel.bind('active-user-event', (data: IUserStatus) => {

      if (!data.triggeredId.startsWith((this._utilService.loggedInUserId).toString())) {
        let i = 0;
        const id: string = data.triggeredId.split('-')[0];
        while (i < this._utilService.activeUserArray.length) {
          if (this._utilService.activeUserArray[i].startsWith(id)) {
            this._utilService.activeUserArray.splice(i, 1);
          }
          else {
            i++;
          }
        }

        const idToMarkMessageRead: string = `${this._utilService.currentOpenedChat}-${this._utilService.loggedInUserId}-active`;
        if (data.triggeredId == idToMarkMessageRead) {
          this._utilService.EMarkMessageRead.emit();
        }

        this._utilService.activeUserArray.push(data.triggeredId);
      }
    });
  }
}
