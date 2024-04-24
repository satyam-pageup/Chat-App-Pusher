import { EventEmitter, Injectable, inject } from '@angular/core';
import { ChatBoxI, MessageI } from '../app/model/chat.model';
import { IUpdateChatList, NumberString } from '../app/model/util.model';
import { IGetAllUser, UserI } from '../app/response/user.response';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { IResponseG, ResponseIterableI } from '../app/response/responseG.response';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
import { PusherService } from './pusher.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService extends ComponentBase {

  private _pusherService = inject(PusherService);

  public chatClickedE: EventEmitter<number> = new EventEmitter<number>();
  public showUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  public userChatEmitter: EventEmitter<{ id: number, name: string }> = new EventEmitter<{ id: number, name: string }>();
  public UserPresenceCheckInChatListE: EventEmitter<MessageI> = new EventEmitter<MessageI>();
  public updateChatListE: EventEmitter<IUpdateChatList> = new EventEmitter<IUpdateChatList>();

  public isUserChatAlreadyExists: boolean = false;
  public loggedInUserId: number = -1;
  public loggedInUserName: string = "";
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;
  public activeUserArray: string[] = [];


  public getLoggedInUserDetialsF() {
    return this.getAPICallPromise<IResponseG<UserI>>('/userDetails', this.headerOption);
  }

  public search(payload: any) {
    return this._httpClient.post<ResponseIterableI<IGetAllUser[]>>(`${this.baseUrl}${APIRoutes.getAllEmployee}`, payload);
  }

}
