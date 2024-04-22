import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, viewChild } from '@angular/core';
import { IResponseG, GetMessageI } from '../../../response/responseG.response';
import { ChatBoxI, MessageI, MessageNewI } from '../../../model/chat.model';
import { GetMessagePaginationI } from '../../../model/pagination.model';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { FirebaseService } from '../../../../services/firebase.service';
import { CGetAllUser } from '../../../response/user.response';
import { ConfirmationComponent } from '../../../shared/component/confirmation/confirmation.component';
import { FormControl } from '@angular/forms';
import { ConvertToBase } from '../../../shared/class/ConvertoBase64.class';
import { PusherService } from '../../../../services/pusher.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent extends ComponentBase implements OnInit, AfterViewInit {
  @ViewChild(ConfirmationComponent) ConfirmationComponentObj !: ConfirmationComponent;
  @ViewChild('scrollframe', { static: false }) scrollFrame!: ElementRef;
  @ViewChildren('item') itemElements!: QueryList<any>;
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;

  private ConvertToBaseobj = new ConvertToBase();
  private scrollContainer: any;
  public isScrollToBottom: boolean = true;
  public isSendMsg: boolean = false
  public Name: string = "";
  public isSearchedUserChat: boolean = false;
  public searchedUserChat: CGetAllUser = new CGetAllUser();
  public preScrollH: number = 0;
  private options: GetMessagePaginationI = {
    isPagination: true,
    index: 0,
    take: 20,
    search: ""
  }
  // public messageList: MessageI[] = [];
  public messageList: MessageNewI[] = [];
  public recevierId: number = -1;
  public message: string = '';
  private receiverStystemToken: string = '';
  public userDetail: ChatBoxI = {
    lastMessage: '',
    lastMessageDate: '',
    isSeen: false,
    newMessages: 0,
    recieverId: 0,
    recieverName: '',
    lastActive: '',
  };

  // for media and document uplaod
  public documentFormControl: FormControl = new FormControl(null);
  public mediaFormControl: FormControl = new FormControl(null);
  public selectedDocument: string = "";
  public selectedMedia: string = "";
  public selectedFileName: string = "";
  public inputType: string = "text";
  public isShowFiletypeInput: boolean = false;

  public showChatMessages: boolean = false;
  public showEmojiPicker: boolean = false;
  public userBlockState: string = '';

  constructor(public _utilService: UtilService, private firebaseService: FirebaseService,
    private elementRef: ElementRef, private _pusherService: PusherService, private _datePipe: DatePipe) {
    super();
    this.isSearchedUserChat = false;
  }

  ngOnInit(): void {
    this.subcritpionF();
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  public onMediaSelect(event: any) {
    this.selectedDocument = "";
    this.ConvertToBaseobj.imageToBase64Promise(event).then(
      (res: string) => {
        this.selectedMedia = res;
        this.selectedFileName = event.target.files[0].name;
      }
    )
  }

  public onFileDropped(event: any) {
    this.selectedFileName = event.name;
  }

  public onDocumentSelect(event: any) {
    this.selectedMedia = "";
    this.ConvertToBaseobj.pdfToBase64Promise(event).then(
      (res: string) => {
        this.selectedDocument = res;
        this.selectedFileName = event.target.files[0].name;
      }
    )
  }


  public onEnterKeyDown(event: any, index: number) {
    event.preventDefault();
    this.sendMessage(index);
  }

  public sendMessage(index: number) {

    // this._pusherService.triggerUserChatChannel('active');
    this.showEmojiPicker = false;
    this.isScrollToBottom = true;
    this.isSendMsg = true;
    if (this.message.trim().length > 0) {
      const data: { message: string } = {
        message: this.message.trim()
      }


      const rMsg: MessageNewI = {
        id: -1,
        message: data.message,
        name: this._utilService.loggedInUserName,
        userType: "user",
        senderId: this._utilService.loggedInUserId,
        isSeen: false,
        status: "sending",
        messageDate: (this._datePipe.transform(new Date(), 'medium', 'UTC') as string)
      }
      this.messageList.push(rMsg);

      const hitUrl: string = `${environment.baseUrl}${APIRoutes.sendMessage(this.recevierId)}`
      this._httpClient.post<IResponseG<MessageI>>(hitUrl, data).subscribe({
        next: (res) => {
          this.messageList[index].status = "success";
          this.messageList[index].id = res.data.id;
          this.messageList[index].messageDate = res.data.messageDate;
          this.firebaseService.sendNotification({ receiverSystemToken: this.receiverStystemToken, title: "WhatsApp", body: data.message }, this._utilService.loggedInUserId);
        },
        error: (err) => {
          this.messageList[index].status = "failed";
          console.log(err);
        }
      })

      this.message = '';
    }
  }

  public onScrollUp(event: Event) {
    const scrolltop = this.scrollFrame.nativeElement.scrollTop;
    if (scrolltop == 0 && !this.isSearchedUserChat) {
      this.options.index++;
      this.getChatById();
    }
  }

  public deleteMessage(id: number, index: number) {
    this.ConfirmationComponentObj.openModal("Delete", "Do you want to delete it ?").then(
      (res: boolean) => {
        if (res) {
          const msgtoDlt: { ids: number[], recieverId: number } = {
            ids: [id],
            recieverId: this.recevierId
          }

          this.deleteAPICallPromise<{ ids: number[] }, IResponseG<null>>(APIRoutes.deleteMessage, msgtoDlt, this.headerOption).then(
            (res) => {
              this.messageList.splice(index, 1);
              this.isScrollToBottom = true;
              this._toastreService.success("Message deleted successfully");
            }
          )
        }
      }
    )
  }

  public blockUser() {
    if (this.userBlockState == "Block") {
      let message = "Blocked contacts will no longer be able to send you message";
      this.ConfirmationComponentObj.openModal(`${this.userBlockState}`, message).then(
        (res: boolean) => {
          if (res) {
            this.postAPICallPromise<number, IResponseG<null>>(APIRoutes.blockUser(this.recevierId), this.recevierId, this.headerOption).then(
              (res) => {
                if (res.status) {
                  this.userBlockState = 'Unblock';
                  this._toastreService.success(res.message);
                }
                else {
                  this._toastreService.error(res.message)
                }
              }
            )
          }
        }
      )
    }
    else {
      let message = "Are you sure you want to unblock user ?";
      this.ConfirmationComponentObj.openModal(`${this.userBlockState}`, message).then(
        (res: boolean) => {
          if (res) {
            this.postAPICallPromise<number, IResponseG<null>>(APIRoutes.unBlockUser(this.recevierId), this.recevierId, this.headerOption).then(
              (res) => {
                if (res.status) {
                  this.userBlockState = 'Block';
                  this._toastreService.success(res.message);
                }
                else {
                  this._toastreService.error(res.message)
                }
              }
            )
          }
        }
      )
    }
  }

  public toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  public addEmoji(event: any) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;
    this.message = text;
  }


  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const emojiIcon = this.elementRef.nativeElement.querySelector('.bx-smile');
    const emojiContainer = this.elementRef.nativeElement.querySelector('.emoji-container');
    if (!emojiIcon || (!emojiIcon.contains(clickedElement) && (!emojiContainer || !emojiContainer.contains(clickedElement)))) {
      this.showEmojiPicker = false;
    }
  }


  private subcritpionF() {
    this._utilService.chatClickedE.subscribe(
      (id: number) => {
        this.recevierId = id;


        // this._pusherService.subscribeUserChatChannel('active');

        this.getChatByIdListen(id);
        if (id > -1)
          this.showChatMessages = true;
        else
          this.showChatMessages = false;
      }
    )

    this.userChatEmitterSubcribedF();

    this._pusherService.messageReceivedE.subscribe((msg: MessageI) => {
      if (msg.senderId == this._utilService.currentOpenedChat) {
        this.isScrollToBottom = true;

        const rMsg: MessageNewI = {
          id: msg.id,
          message: msg.message,
          name: msg.name,
          userType: msg.userType,
          senderId: msg.senderId,
          isSeen: msg.isSeen,
          status: "",
          messageDate: msg.messageDate,
        }

        this.messageList.push(rMsg);
      }
      else {
        if (msg.senderId != this._utilService.loggedInUserId) {
          this._utilService.UserPresenceCheckInChatListE.emit(msg);
        }
      }
    })
  }




  private userChatEmitterSubcribedF() {
    this._utilService.userChatEmitter.subscribe((res) => {
      this.recevierId = res.id;
      this._utilService.currentOpenedChat = res.id;
      this.options.index = 0;
      this.Name = res.name;

      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(res.id), this.options, this.headerOption).then(
        (res) => {
          this.showChatMessages = true;
          res.data.data.forEach(
            (msg: MessageI) => {
              const rMsg: MessageNewI = {
                id: msg.id,
                message: msg.message,
                name: msg.name,
                userType: msg.userType,
                senderId: msg.senderId,
                isSeen: msg.isSeen,
                status: (msg.isSeen) ? 'seen' : 'success',
                messageDate: msg.messageDate,
              }

              this.messageList.push(rMsg);
            }
          )

          console.log(this.messageList);
          this.receiverStystemToken = res.data.systemToken;
          this.isScrollToBottom = true;
          if (res.data.isBlockedUser) {
            this.userBlockState = "Unblock"
          }
          else {
            this.userBlockState = "Block"
          }
        }
      )
    })
  }

  private getChatById() {
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(this._utilService.currentOpenedChat), this.options, this.headerOption).then(
        (res) => {
          if (this.isSendMsg) {
            this.messageList = [];
            this.isSendMsg = false;
          }
          for (let i = res.data.data.length - 1; i > -1; i--) {

            const rMsg: MessageNewI = {
              id: res.data.data[i].id,
              message: res.data.data[i].message,
              name: res.data.data[i].name,
              userType: res.data.data[i].userType,
              senderId: res.data.data[i].senderId,
              isSeen: res.data.data[i].isSeen,
              status: "",
              messageDate: res.data.data[i].messageDate,
            }
            this.messageList.unshift(rMsg);
          }
          this.receiverStystemToken = res.data.systemToken;
        }
      )
    }
  }

  private onItemElementsChanged(): void {
    if (this.isScrollToBottom) {
      this.scrollToBottom();
      this.isScrollToBottom = false;
    }
    else {
      this.scrollToHalf();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
    });
    this.preScrollH = this.scrollContainer.scrollHeight;
  }

  private scrollToHalf(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight - this.preScrollH,
      left: 0,
    });
    this.preScrollH = this.scrollContainer.scrollHeight;
  }

  private getChatByIdListen(id: number) {
    this.options.index = 0;
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(id), this.options, this.headerOption).then(
        (res) => {

          res.data.data.forEach(
            (msg: MessageI) => {
              const rMsg: MessageNewI = {
                id: msg.id,
                message: msg.message,
                name: msg.name,
                userType: msg.userType,
                senderId: msg.senderId,
                isSeen: msg.isSeen,
                status: (msg.isSeen) ? 'seen' : 'unseen',
                messageDate: msg.messageDate,
              }

              this.messageList.push(rMsg);
            }
          )

          this.receiverStystemToken = res.data.systemToken;
          this.isScrollToBottom = true;
          if (res.data.isBlockedUser) {
            this.userBlockState = "Unblock"
          }
          else {
            this.userBlockState = "Block"
          }
        }
      )
    }
  }
}



