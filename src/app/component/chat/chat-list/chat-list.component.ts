import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatBoxI } from '../../../model/chat.model';
import { IResponseG, ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { NumberString } from '../../../model/util.model';
import { IGetAllUser } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PusherService } from '../../../../services/pusher.service';
import { ConfirmationComponent } from '../../../shared/component/confirmation/confirmation.component';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent extends ComponentBase implements OnInit, OnDestroy {

  @ViewChild(ConfirmationComponent) ConfirmationComponentObj!: ConfirmationComponent;

  public userChatList: ChatBoxI[] = [];
  public allUserList: IGetAllUser[] = [];
  public searchResult: IGetAllUser[] = [];
  public searchUser: string = "";
  public selectedIndex: number = -1;
  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();
  private options: IEmplyeeOptions = {
    isPagination: false,
    index: 0,
    take: 0,
    search: "",
    orders: 0,
    orderBy: ""
  }

  constructor(public _utilService: UtilService, private _pusherService: PusherService) {
    super();

    this._utilService.refreshChatListE.subscribe(
      (res) => {
        this.getChatBox();
      }
    )

    this._utilService.isListennotificationE.subscribe(
      (data: NumberString) => {
        this.updateOpenedChat(data);
      }
    )

    this._utilService.updateChatOnNotificationE.subscribe(
      (data: NumberString) => {
        this.increaseChatCountF(data);
      }
    )

    this._utilService.updateChatOnSendingMsgE.subscribe((msg: string) => {
      this.updateChatOnSendingMsgF(msg);
    })
  }

  ngOnInit(): void {
    this._utilService.getLoggedInUserDetialsF().then(
      (res) => {
        this._utilService.loggedInUserId = res.data.id;
        this._utilService.loggedInUserName = res.data.name;

        // for creating channel
        this.getAllUser();

        this.getChatBox();
      }
    )

    this.userSearchSubject.pipe(
      debounceTime(0),
    ).subscribe(
      (userName) => {
        this.onDestroy$.next();
        this.options.search = userName;
        this._utilService.search(this.options).pipe(
          takeUntil(this.onDestroy$),
        ).subscribe(
          (res) => {
            this.searchResult = res.iterableData.filter((user) => this._utilService.loggedInUserId != user.id);
          }
        )
      }
    )
  }


  public getChats(id: number, name: string, chat: ChatBoxI) {
    chat.newMessages = 0;
    const userChat: { id: number, name: string } = {
      id,
      name
    }
    this._utilService.isUserChatAlreadyExists = true;
    this._utilService.userChatEmitter.emit(userChat);
  }

  public deleteConversationById(event: MouseEvent, receiverId: number) {
    event.stopPropagation();

    this.ConfirmationComponentObj.openModal("Delete Chat", "Do you want to delete it permanently ?").then(
      (res: boolean) => {
        if (res) {
          this.deleteAPICallPromise<null, IResponseG<null>>(APIRoutes.deleteConversationById(receiverId), null, this.headerOption).then(
            (res) => {
              if(this._utilService.currentOpenedChat == receiverId){
                this._utilService.currentOpenedChat = -1;
                this._utilService.chatClickedE.emit(-1);
              }
              this.getChatBox();
              this._toastreService.success(res.message);
            }
          )
        }
      }
    )

  }

  public onArrowDown() {
    if (this.selectedIndex == this.searchResult.length - 1) {
      this.selectedIndex = 0;
    }
    else {
      this.selectedIndex++;
    }
  }

  public onArrowUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  public onEnterPress() {
    this.getSearchedUserChats(this.searchResult[this.selectedIndex].id, this.searchResult[this.selectedIndex].employeeName);
    this.searchResult = [];
    this.searchUser = "";
    this.selectedIndex = -1;
  }

  public getSearchedUserChats(id: number, name: string) {

    const obj: { id: number, name: string } = {
      id,
      name
    }

    for (let i = 0; i < this.userChatList.length; i++) {
      if (this.userChatList[i].recieverId == obj.id) {
        this._utilService.isUserChatAlreadyExists = true;
        break;
      }
      else {
        this._utilService.isUserChatAlreadyExists = false;
      }
    }

    this._utilService.userChatEmitter.emit(obj);
    this.searchResult = [];
    this.searchUser = "";
  }

  public onSearchUser() {
    this.userSearchSubject.next(this.searchUser);
  }

  private getChatBox() {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
      (res) => {
        this.userChatList = res.iterableData;
        // let channelList: string[] = [];
        // this.userChatList.forEach(
        //   (user) =>{
        //     let cName: string = '';
        //     if(user.recieverId < this._utilService.loggedInUserId){
        //       cName = `${user.recieverId}-${this._utilService.loggedInUserId}`;
        //     }
        //     else{
        //       cName = `${this._utilService.loggedInUserId}-${user.recieverId}`;
        //     }
        //     channelList.push(cName);
        //   }
        // );
        // this._pusherService.subcribeToChannelE.emit(channelList);
      }
    )
  }


  private updateChatOnSendingMsgF(msg: string) {
    this.updateChatG(this._utilService.currentOpenedChat, msg);

    // const currentDateUTC = new Date().toISOString();
    // this.userChatList.forEach(
    //   (userChat, i) => {
    //     if (userChat.recieverId == this._utilService.currentOpenedChat) {
    //       userChat.lastMessage = str;
    //       userChat.lastMessageDate = currentDateUTC;
    //       const newChat = userChat;
    //       this.userChatList.splice(i, 1);
    //       this.userChatList.unshift(newChat);
    //     }
    //   }
    // )
  }

  private updateOpenedChat(data: NumberString) {

    this.updateChatG(data.id, data.data);
    // const currentDateUTC = new Date().toISOString();
    // this.userChatList.forEach(
    //   (userChat, i) => {
    //     if (userChat.recieverId == data.id) {
    //       userChat.lastMessage = data.data;
    //       userChat.lastMessageDate = currentDateUTC;
    //       const newChat = userChat;
    //       this.userChatList.splice(i, 1);
    //       this.userChatList.unshift(newChat);
    //     }
    //   }
    // )
  }

  private updateChatG(id: number, data: string) {
    const currentDateUTC = new Date().toISOString();
    this.userChatList.forEach(
      (userChat, i) => {
        if (userChat.recieverId == id) {
          userChat.lastMessage = data;
          userChat.lastMessageDate = currentDateUTC;
          const newChat = userChat;
          this.userChatList.splice(i, 1);
          this.userChatList.unshift(newChat);
        }
      }
    )
  }

  private increaseChatCountF(data: NumberString) {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatBox, this.headerOption).then(
      (res) => {
        this.userChatList = res.iterableData;
      }
    )
  }


  private getAllUser() {
    this.options.isPagination = false;
    this.options.search = "";
    this.options.index = 0;

    this._utilService.search(this.options).subscribe(
      (res) => {
        let data: IGetAllUser[] = [];
        data = res.iterableData
        let channelList: string[] = [];
        data.forEach(
          (user) => {
            let cName: string = '';
            if (user.id < this._utilService.loggedInUserId) {
              cName = `${user.id}-${this._utilService.loggedInUserId}`;
            }
            else {
              cName = `${this._utilService.loggedInUserId}-${user.id}`;
            }
            channelList.push(cName);
          }
        );
        this._pusherService.subcribeToChannelE.emit(channelList);
      }
    )
  }


  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    this.searchResult = [];
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
