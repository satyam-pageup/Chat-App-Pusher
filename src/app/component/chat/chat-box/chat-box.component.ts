import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, viewChild } from '@angular/core';
import { GetLoggedInUserDetailI, GetMessageI, ResponseGI } from '../../../response/responseG.response';
import { ChatBoxI, MessageI } from '../../../model/chat.model';
import { GetMessagePaginationI } from '../../../model/pagination.model';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { UtilService } from '../../../../services/util.service';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { FirebaseService } from '../../../../services/firebase.service';
import { CGetAllUser, IGetAllUser } from '../../../response/user.response';
import { HttpClient } from '@angular/common/http';
import { ConfirmationComponent } from '../../../shared/component/confirmation/confirmation.component';
import { FormControl } from '@angular/forms';
import { ConvertToBase } from '../../../shared/class/ConvertoBase64.class';
import { NumberString } from '../../../model/util.model';

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
  public messageList: MessageI[] = [];
  public recevierId: number = -1;
  public message: string = '';
  private receiverStystemToken: string = '';
  public userDetail: ChatBoxI = {
    // employeeId: 0,
    // employeeName: '',
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

  constructor(public _utilService: UtilService, private firebaseService: FirebaseService, private elementRef: ElementRef) {
    super();
    this.isSearchedUserChat = false;
    _utilService.chatClickedE.subscribe(
      (id: number) => {
        this.recevierId = id;
        this.getChatByIdListen(id);
        if (id > -1)
          this.showChatMessages = true;
        else
          this.showChatMessages = false;
      }
    )
  }

  ngOnInit(): void {
    this._utilService.getChatByIdE.subscribe(
      (receiverId: number) => {
        this._utilService.receiverId = receiverId;
        this.recevierId = receiverId;
        this.options.index = 0;
        this.getChatById();
      }
    )

    this._utilService.isListennotificationE.subscribe(
      (data: NumberString) => {
        this.getChatByIdListen(data.id);
      }
    )

    this._utilService.userChatEmitter.subscribe((res) => {
      this.recevierId = res.id;
      this._utilService.currentOpenedChat = res.id;
      this.options.index = 0;
      this.Name = res.name;
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(res.id), this.options, this.headerOption).then(
        (res) => {
          this.showChatMessages = true;
          this.messageList = res.data.data;
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

  
  public onEnterKeyDown(event: any) {
    event.preventDefault(); // Prevent default Enter key behavior
    this.sendMessage(); // Call your sendMessage function
  }

  public sendMessage() {
    this.showEmojiPicker = false;
    this.options.index = 0;
    this.isScrollToBottom = true;
    this.isSendMsg = true;
    if (this.message.trim().length > 0) {
      const data: { message: string } = {
        message: this.message.trim()
      }

      this.postAPICallPromise<{ message: string }, GetLoggedInUserDetailI<null>>(APIRoutes.sendMessage(this.recevierId), data, this.headerOption).then(
        () => {
          if (this._utilService.isUserChatAlreadyExists) {
            this._utilService.updateChatOnSendingMsgE.emit(data.message);
          }
          else {
            this._utilService.refreshChatListE.emit(true);
          }
          
          this.getChatByIdListen(this.recevierId);
          this.firebaseService.sendNotification({ receiverSystemToken: this.receiverStystemToken, title: "WhatsApp", body: data.message }, this._utilService.loggedInUserId);
        }
      )
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

          this.deleteAPICallPromise<{ ids: number[] }, GetLoggedInUserDetailI<null>>(APIRoutes.deleteMessage, msgtoDlt, this.headerOption).then(
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
            this.postAPICallPromise<number, GetLoggedInUserDetailI<null>>(APIRoutes.blockUser(this.recevierId), this.recevierId, this.headerOption).then(
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
            this.postAPICallPromise<number, GetLoggedInUserDetailI<null>>(APIRoutes.unBlockUser(this.recevierId), this.recevierId, this.headerOption).then(
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

  private getChatById() {
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(this._utilService.currentOpenedChat), this.options, this.headerOption).then(
        (res) => {
          if (this.isSendMsg) {
            this.messageList = [];
            this.isSendMsg = false;
          }
          for (let i = res.data.data.length - 1; i > -1; i--) {
            this.messageList.unshift(res.data.data[i]);
          }
          this.receiverStystemToken = res.data.systemToken;
        }
      )
    }
  }

  private getChatByIdListen(id: number) {
    this.options.index = 0;
    if (this._utilService.currentOpenedChat != -1) {
      this.postAPICallPromise<GetMessagePaginationI, GetMessageI<MessageI[]>>(APIRoutes.getMessageById(id), this.options, this.headerOption).then(
        (res) => {
          this.messageList = res.data.data;
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

}



