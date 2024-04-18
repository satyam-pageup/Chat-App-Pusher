import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  messagesChannel: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<MessageI> = new EventEmitter<MessageI>();

  constructor() {
    // Pusher.logToConsole = true;
    this.initializePusher();
  }

  initializePusher(): void {
    this.pusher = new Pusher(environment.pusher.key, { cluster: 'ap2', });
  }

  public subscribeToChannel(channelName: string) {
    return this.pusher.subscribe(channelName);
  }

  // public subscribeToUserChannel(channelname: string, eventName: string, callback: (data: any) => void): void {
  //   const channel = this.pusher.subscribe(channelname);
  //   channel.bind(eventName, callback);
  // }
}
