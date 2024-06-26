import { EventEmitter, Injectable } from '@angular/core';
import Pusher, { Channel } from 'pusher-js';
import { environment } from '../environments/environment';
import { IGetMessage, MessageI } from '../app/model/chat.model';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
import { IResponseG } from '../app/response/responseG.response';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class PusherService extends ComponentBase{
  public pusher: Pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  public messagesChannel: any;
  public activeUserChannel: any;
  public activeUserChannelPusher: any;
  public typingChannelPusher: any;
  public onlineUserChannel!:Channel;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<IGetMessage> = new EventEmitter<IGetMessage>();

  constructor(private _utilService: UtilService) {
    super();
    this.typingChannelPusher = this.pusher.subscribe('typing-channel');
    this.onlineUserChannel = this.subscribeToChannel("online-user-channel");
  }

  
  public updateUserStatus(status: boolean){
    this.postAPICallPromise<null, IResponseG<null>>(APIRoutes.updateUserStatus(this._utilService.receiverId, status), null, this.headerOption).then(
      (res) =>{
      }
    )
  }

  public onlineUserF(id: number, status:boolean){
    this.postAPICallPromise<null, IResponseG<null>>(APIRoutes.triggerUserOnline(id,status), null, this.headerOption).then(
      (res) =>{
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
