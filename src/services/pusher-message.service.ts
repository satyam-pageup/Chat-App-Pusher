import { Injectable } from '@angular/core';
import { PusherService } from './pusher.service';
import { ReplaySubject } from 'rxjs';

export interface Message {
  text: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class PusherMessageService {
  messagesStream = new ReplaySubject<Message>(1);

  constructor(
    private pusherService: PusherService
  ) {
    this.initialize();
  }

  initialize() {
    this.pusherService.messagesChannel.bind('my-event', (message: Message) => {
      this.emitNewMessage(message);
    });
  }

  send(message: Message) {
    this.pusherService.messagesChannel.trigger('my-event', message);
    this.emitNewMessage(message);
  }

  emitNewMessage(message: Message) {
    this.messagesStream.next(message);
  }

}
