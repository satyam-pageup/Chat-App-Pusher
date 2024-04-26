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
import { Title } from '@angular/platform-browser';
import { LoaderService } from '../services/loader.service';

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
  public isShowLoader: boolean = false;
  private channel!: Channel;
  private activeUserChannel!: Channel;
  private onlineUsersChannel!: Channel;

  constructor(private firebaseService: FirebaseService,
    public _utilService: UtilService,
    private _route: Router,
    private _pusherService: PusherService,
    private _tokenDecodeService: TokenDecodeService,
    private _titleService: Title,
    private _loaderService: LoaderService
  ) {
    super();

    _loaderService.showLoader$.subscribe(
      ()=>{
        if(_loaderService.apiCnt > 0){
          this.isShowLoader = true;
        }
        
        if(_loaderService.apiCnt == 0){
          this.isShowLoader = false;
        }
      }
    )

    // redirecting to login, if token is not present
    if(!localStorage.getItem("jwtToken")){
      this._toastreService.info('Token removed! Please login again');
      this._router.navigate(['/']);
    }
    else{
      // token exists => checking validity of token
      const data = _tokenDecodeService.getDecodedAccessToken(localStorage.getItem("jwtToken") as string);
      if(data){
        this._router.navigate(['/chat']);
        this.showChatMessages = true;
      }
    }

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
    this.subscribeUserChannel();

    this.subscribeChatChannel("chat-channel");
    this.subscribeActiveUserChannel();
  }

  ngOnInit(): void {

    document.addEventListener('visibilitychange', () => {
      if (this._utilService.receiverId > -1) {
        this._pusherService.updateUserStatus(!document.hidden);
      }
    })
  }


  public logout() {
    this.showChatMessages = false;
    localStorage.clear();
    this._titleService.setTitle('Quick-Chat');
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
        console.log(data.triggeredId);
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

  private subscribeUserChannel() {
    this.onlineUsersChannel = this._pusherService.subscribeToChannel("online-user-channel");
    this.onlineUsersChannel.bind('online-user-event', (data: {userId:number}) => {
      if (data.userId != this._utilService.loggedInUserId){
        if(!this._utilService.onlineUserArray.includes(data.userId)){
          this._utilService.onlineUserArray.push(data.userId);
        }
      }
    });
  }
}
