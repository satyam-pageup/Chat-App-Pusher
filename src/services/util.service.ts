import { EventEmitter, Injectable } from '@angular/core';
import { ChatBoxI } from '../app/model/chat.model';
import { NumberString } from '../app/model/util.model';
import { IGetAllUser, UserI } from '../app/response/user.response';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { GetLoggedInUserDetailI, ResponseIterableI } from '../app/response/responseG.response';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';

@Injectable({
  providedIn: 'root'
})
export class UtilService extends ComponentBase {

  public sendMessageE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isListennotificationE: EventEmitter<NumberString> = new EventEmitter<NumberString>();
  public getChatByIdE: EventEmitter<number> = new EventEmitter<number>();

  public chatClickedE: EventEmitter<number> = new EventEmitter<number>();
  public updateChatOnNotificationE: EventEmitter<NumberString> = new EventEmitter<NumberString>();
  public showUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  public refreshChatListE: EventEmitter<boolean> = new EventEmitter<boolean>();
  public updateChatOnSendingMsgE: EventEmitter<string> = new EventEmitter<string>();
  public userChatEmitter : EventEmitter<{id: number, name: string}> = new EventEmitter<{id: number, name: string}>();

  public isUserChatAlreadyExists: boolean = false;
  public loggedInUserId: number = -1;
  public loggedInUserName: string = "";
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;

  public getLoggedInUserDetialsF() {
    return this.getAPICallPromise<GetLoggedInUserDetailI<UserI>>('/userDetails', this.headerOption);
  }

  search(payload: any) {
   return this._httpClient.post<ResponseIterableI<IGetAllUser[]>>(`${this.baseUrl}${APIRoutes.getAllEmployee}`, payload);
  }

}
