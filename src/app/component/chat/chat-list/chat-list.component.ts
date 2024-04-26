import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatBoxI, MessageI } from '../../../model/chat.model';
import { IResponseG, ResponseIterableI } from '../../../response/responseG.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { IUpdateChatList, NumberString } from '../../../model/util.model';
import { IGetAllUser } from '../../../response/user.response';
import { IEmplyeeOptions } from '../../../model/option.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PusherService } from '../../../../services/pusher.service';
import { ConfirmationComponent } from '../../../shared/component/confirmation/confirmation.component';
import { Title } from '@angular/platform-browser';

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
  private tabNotificationCount$: Subject<void> = new Subject<void>();
  private options: IEmplyeeOptions = {
    isPagination: false,
    index: 0,
    take: 0,
    search: "",
    orders: 0,
    orderBy: ""
  }

  constructor(public _utilService: UtilService, private _pusherService: PusherService,
    private _titleService: Title
  ) {
    super();

    _utilService.EUpdateChatList.subscribe(
      (res: IUpdateChatList) => {
        console.log(res);
        for (let i = 0; i < this.userChatList.length; i++) {
          if (this.userChatList[i].recieverId == res.receiverId) {
            this.userChatList[i].lastMessage = res.message;
            this.userChatList[i].lastMessageDate = res.dateTime;

            const chat: ChatBoxI = this.userChatList[i];
            this.bringChatToTop(chat, i);
            break;
          }
        }
      }
    )

    _utilService.EUserPresenceCheckInChatList.subscribe((msg: MessageI) => {
      let isUserChatAlreadyExists: boolean = false;
      let isCall: boolean = false;


      for (let i = 0; i < this.userChatList.length; i++) {
        if (this.userChatList[i].recieverId == msg.senderId) {
          isUserChatAlreadyExists = true;
          this.userChatList[i].lastMessage = msg.message;
          this.userChatList[i].lastMessageDate = msg.messageDate;

          if(this.userChatList[i].newMessages==0){
            isCall = true;
          }
          this.userChatList[i].newMessages++;
          this.bringChatToTop(this.userChatList[i], i);
          break;
        }
      }


      if(isCall)
        this.tabNotificationCount$.next();

      if (!isUserChatAlreadyExists) {
        this.getChatList();
      }
    })

    this.tabNotificationCount$.subscribe(() => {
      let newMessage: number = 0;
      this.userChatList.forEach(
        (msg) => {
          if (msg.newMessages > 0) newMessage++;
        }
      )
      this._titleService.setTitle((newMessage>0)?`(${newMessage})QuickChat`: `QuickChat`);
    })
  }

  ngOnInit(): void {
    this._utilService.getLoggedInUserDetialsF().then(
      (res) => {
        this._utilService.loggedInUserId = res.data.id;
        this._utilService.loggedInUserName = res.data.name;
        this._pusherService.onlineUserF(res.data.id,true);
        // this._pusherService.onlineUserF(res.data.id);

        this._utilService.EShowUser.emit(true);

        this.headerOption.isSilentCall = false;
        this.getChatList();
        this.headerOption.isSilentCall = true;
      }
    )

    this.userSearchSubject.pipe(
      debounceTime(0),
    ).subscribe(
      (userName) => {
        this.onDestroy$.next();
        if (userName == "") {
          this.searchResult = [];
          return;
        }
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


  private bringChatToTop(chat: ChatBoxI, index: number) {
    this.userChatList.splice(index, 1);
    this.userChatList.unshift(chat);
  }


  public getChats(id: number, name: string, chat: ChatBoxI) {
    console.log(id);
    
    this._utilService.receiverId = id;
    this._pusherService.updateUserStatus(true);
    this._pusherService.onlineUserF(id,false);
    chat.newMessages = 0;
    const userChat: { id: number, name: string } = {
      id,
      name
    }

    this.tabNotificationCount$.next();
    this._utilService.isUserChatAlreadyExists = true;
    this._utilService.EUserChat.emit(userChat);
  }

  public deleteConversationById(event: MouseEvent, receiverId: number) {
    event.stopPropagation();

    this.ConfirmationComponentObj.openModal("Delete Chat", "Do you want to delete it permanently ?").then(
      (res: boolean) => {
        if (res) {
          this.deleteAPICallPromise<null, IResponseG<null>>(APIRoutes.deleteConversationById(receiverId), null, this.headerOption).then(
            (res) => {
              if (this._utilService.currentOpenedChat == receiverId) {
                this._utilService.currentOpenedChat = -1;
                this._utilService.EChatClicked.emit(-1);
              }
              this.getChatList();
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

    this._utilService.EUserChat.emit(obj);
    this.searchResult = [];
    this.searchUser = "";

    for (let i = 0; i < this.userChatList.length; i++) {
      if (this.userChatList[i].recieverId == obj.id) {
        this._utilService.isUserChatAlreadyExists = true;
        break;
      }
      else {
        this._utilService.isUserChatAlreadyExists = false;
      }
    }

  }

  public onSearchUser() {
    this.userSearchSubject.next(this.searchUser);
  }

  private getChatList() {
    this.getAPICallPromise<ResponseIterableI<ChatBoxI[]>>(APIRoutes.getChatList, this.headerOption).then(
      (res) => {
        this.userChatList = res.iterableData;
        this.tabNotificationCount$.next();
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
