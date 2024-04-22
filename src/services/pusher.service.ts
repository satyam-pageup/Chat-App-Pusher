import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public pusher: Pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  public messagesChannel: any;
  public activeUserChannel: any;
  public activeUserChannelPusher: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<MessageI> = new EventEmitter<MessageI>();

  constructor() {
    Pusher.logToConsole = true;
    // this.initializePusher();
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
