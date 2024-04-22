import { EventEmitter, Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import { environment } from '../environments/environment';
import { MessageI } from '../app/model/chat.model';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  public pusher!: Pusher;
  public messagesChannel: any;
  public activeUserChannel: any;
  public activeUserChannelPusher: any;

  public subcribeToChannelE: EventEmitter<string[]> = new EventEmitter<string[]>();
  public messageReceivedE: EventEmitter<MessageI> = new EventEmitter<MessageI>();

  constructor() {
    Pusher.logToConsole = true;
    this.initializePusher();
  }

  initializePusher(): void {
    this.pusher = new Pusher(environment.pusher.key, { cluster: 'ap2' });
  }

  public subscribeToChannel(channelName: string) {
    return this.pusher.subscribe(channelName);
  }

  public sendMessage(){
    // this.pusher.trigger("chat-channel", "my-event", 'hello');
    // console.log(this.pusher.send_event('new-evnet', 'hello', 'chat-channel'));

  }
}
