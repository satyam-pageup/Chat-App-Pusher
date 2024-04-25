import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';
import { HttpClient } from '@angular/common/http';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
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

  // public pusherNew = require('pusher');

  // public pusherser = new this.pusherNew({
  //   appId: `${environment.pusher.id}`,
  //   key: `${environment.pusher.key}`,
  //   secret: `${environment.pusher.secretKey}`,
  //   cluster: "ap2", 
  // })

  constructor() {
    super();
    this.typingChannelPusher = this.pusher.subscribe('typing-channel');



    // Pusher.logToConsole = true;
    // this.initializePusher();
  }

  sendTypingStatus(userId: number,istyping:boolean) {
    // return this.http.post('ChatTriggered/TriggeredByTyping', { userId, isTyping }).toPromise();
    return this.postAPICallPromise<number,string>(APIRoutes.isTyping(userId,istyping), userId ,this.headerOption);

    // this.typingChannelPusher.trigger('client-typing-event', { userId, isTyping });
    // this.pusherser.trigger("typing-channel", "client-typing-event", { message: "hello world" });
    // this.typingChannelPusher.trigger('client-typing-event',{userId,isTyping});

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


  // triggerEvent(channelName: string, eventName: string, eventData: any) {
  //   this.pusher.subscribe(channelName).trigger(eventName, eventData);
  // }

  triggerEvent(channelName: string, eventName: string, eventData: any) {
    const channel = this.pusher.subscribe(channelName);
    channel.trigger(`client-${eventName}`, eventData); // Ensure event name starts with 'client-'
  }

  // const channel = this.pusher.subscribe(channelName).trigger(`client-${eventName}`, eventData);
  // channel.trigger(`client-${eventName}`, eventData);



  // public initializeUserPusher() {
  // this.activeUserChannelPusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  // this.subscribeUserChatChannel('as');
  // }


  // public subscribeUserChatChannel(channelName: string) {
  //   return this.activeUserChannelPusher.subscribe('active-user-channel')
  //   // this.activeUserChannel.bind('active-user', (data: any) => {
  //   //   console.log(data);
  //   // });
  // }

  public triggerUserChatChannel(channelName: string) {
    // this._pusherObj.trigger(channelName, { message: 'hello' });
  }
}
