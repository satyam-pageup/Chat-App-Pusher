import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public pusher: any;
  public messagesChannel: any;
  public activeUserChannel: any;
  public activeUserChannelPusher: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<MessageI> = new EventEmitter<MessageI>();

  constructor() {
    Pusher.logToConsole = true;
    this.initializePusher();
    this.initializeUserPusher();
  }

  initializePusher(): void {
    this.pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  }

  public subscribeToChannel(channelName: string) {
    return this.pusher.subscribe(channelName);
  }



  public initializeUserPusher() {
    this.activeUserChannelPusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
    this.subscribeUserChatChannel('as');
  }


  public subscribeUserChatChannel(channelName: string) {
    return this.activeUserChannelPusher.subscribe('active-user-channel')
    // this.activeUserChannel = this.activeUserChannelPusher.subscribe('active')
    // this.activeUserChannel.bind('active-user', (data: any) => {
    //   console.log(data);
    // });
  }

  public triggerUserChatChannel(channelName: string) {
    this.activeUserChannelPusher.trigger('active-user-channel', { message: 'hello' });
  }
}
