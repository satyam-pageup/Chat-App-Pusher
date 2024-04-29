import { EventEmitter, Injectable, inject } from '@angular/core';
import { ChatBoxI, IGetMessage, MessageI } from '../app/model/chat.model';
import { IUpdateChatList, NumberString } from '../app/model/util.model';
import { IGetAllUser, UserI } from '../app/response/user.response';
import { ComponentBase } from '../app/shared/class/ComponentBase.class';
import { IResponseG, ResponseIterableI } from '../app/response/responseG.response';
import { APIRoutes } from '../app/shared/constants/apiRoutes.constant';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilService extends ComponentBase {

  public EChatClicked: EventEmitter<number> = new EventEmitter<number>();
  public EShowUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  public EUserChat: EventEmitter<{ id: number, name: string }> = new EventEmitter<{ id: number, name: string }>();
  public EGroupChat: EventEmitter<{ id: number, name: string }> = new EventEmitter<{ id: number, name: string }>();
  public EUserPresenceCheckInChatList: EventEmitter<IGetMessage> = new EventEmitter<IGetMessage>();
  public EUpdateChatList: EventEmitter<IUpdateChatList> = new EventEmitter<IUpdateChatList>();
  public EMarkMessageRead: EventEmitter<null> = new EventEmitter<null>();

  public isUserChatAlreadyExists: boolean = false;
  public loggedInUserId: number = -1;
  public loggedInUserName: string = "";
  public receiverId: number = -1;
  public currentOpenedChat: number = -1;
  public activeUserArray: string[] = [];
  public onlineUserArray: number[] = [];
  public isGroup: boolean = false;


  public getLoggedInUserDetialsF() {
    return this.getAPICallPromise<IResponseG<UserI>>('/userDetails', this.headerOption);
  }

  public search(payload: any) {
    let myNewHeader: HttpHeaders = new HttpHeaders({
      isSendNotification: 'true',
      isSilentCall: 'true'
  })
    return this._httpClient.post<ResponseIterableI<IGetAllUser[]>>(`${this.baseUrl}${APIRoutes.getAllEmployee}`, payload, { headers: myNewHeader });
  }



  public messageReachedF(){
    this.postAPICallPromise<null, IResponseG<null>>(APIRoutes.messageReached, null, this.headerOption).then(
      (res) =>{
        console.log(res);
      }
    )
  }

}
