import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';
import { HttpClient } from '@angular/common/http';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
import { IResponseG } from '../app/response/responseG.response';
import { UtilService } from './util.service';
// import {} from "pusher"

@Injectable({
  providedIn: 'root'
})
export class PusherService extends ComponentBase{
  public pusher: Pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  public messagesChannel: any;
  public activeUserChannel: any;
  public activeUserChannelPusher: any;
  public typingChannelPusher: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<MessageI> = new EventEmitter<MessageI>();

  constructor(private _utilService: UtilService) {
    super();
    this.typingChannelPusher = this.pusher.subscribe('typing-channel');
  }

  
  public updateUserStatus(status: boolean){
    this.postAPICallPromise<null, IResponseG<null>>(APIRoutes.updateUserStatus(this._utilService.receiverId, status), null, this.headerOption).then(
      (res) =>{
        this._toastreService.success(res.message);
      }
    )
  }

  public onlineUserF(id: number){
    this.postAPICallPromise<null, IResponseG<null>>(APIRoutes.triggerUserOnline, null, this.headerOption).then(
      (res) =>{
        this._toastreService.success(res.message);
        console.log(res);
        
      }
    )
  }

  sendTypingStatus(userId: number,istyping:boolean) {
    return this.postAPICallPromise<number,string>(APIRoutes.isTyping(userId,istyping), userId ,this.headerOption);
  }

  getTypingChannel() {
    return this.typingChannelPusher;
  }

  // initializePusher(): void {



  //   this.pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  // }

  public subscribeToChannel(channelName: string) {
    return this.pusher.subscribe(channelName);
  }

  triggerEvent(channelName: string, eventName: string, eventData: any) {
    const channel = this.pusher.subscribe(channelName);
    channel.trigger(`client-${eventName}`, eventData); // Ensure event name starts with 'client-'
  }


}
