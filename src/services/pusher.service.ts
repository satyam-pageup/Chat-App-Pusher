import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  messagesChannel: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor() {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;
    // this.initializePusher();
  }

  initializePusher(): void {
    this.pusher = new Pusher(environment.pusher.key, { cluster: 'ap2', });
    console.log(this.pusher);
  }

  public subscribeToChannel(channelName: string) {
    // this.messagesChannel = this.pusher.subscribe(channelName);
    // console.log(this.messagesChannel);
    return this.pusher.subscribe(channelName);
  }
}
