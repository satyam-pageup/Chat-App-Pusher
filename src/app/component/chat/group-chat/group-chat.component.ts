import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGetAllUser, IGroupChat } from '../../../response/user.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { IEmplyeeOptions } from '../../../model/option.model';
import { ResponseIterableI } from '../../../response/responseG.response';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent extends ComponentBase implements OnInit {
  @ViewChild('template') modalTemplate!: TemplateRef<void>;

  private options: IEmplyeeOptions = {
    isPagination: false,
    index: 0,
    take: 0,
    search: "",
    orders: 0,
    orderBy: ""
  }
  public allUserList: IGroupChat[] = [];
  public searchedUserList: IGroupChat[] = [];
  public selectedUserList: IGroupChat[] = [];
  public searchedWord: string = '';

  modalRef?: BsModalRef;
  resolve: any;

  public userSearchSubject: Subject<string> = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    // this.getAllUsers();
    
  }

  private getAllUsers() {
    this.postAPICallPromise<IEmplyeeOptions, ResponseIterableI<IGetAllUser[]>>(APIRoutes.getAllEmployee, this.options, this.headerOption).then(
      (res) => {
        res.iterableData.map((chat) => {
          const object: IGroupChat = { ...chat, isSelected: false }
          this.allUserList.push(object);
        })
        this.searchedUserList=this.allUserList;
      }
    )
  }

  public confirm() {
    this.modalRef?.hide();
    this.resolve(true);
  }

  public decline() {
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal() {
    this.allUserList = [];
    this.selectedUserList = [];
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });
    this.getAllUsers();
    return new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    })
  }

  public onTyping() {
    console.log(this.searchedWord);
    // this.searchedUserLis
    if(this.searchedWord==""){
      this.searchedUserList=this.allUserList;
      return;
    }
    this.searchedUserList = this.searchedUserList.filter((user)=>user.employeeName.toLowerCase().includes(this.searchedWord.toLowerCase()))
  }

  public selectUser(index: number){
    this.selectedUserList.push(this.allUserList[index]);
    this.searchedUserList.splice(index, 1);
  }

  public unSelectUser(index: number){
    this.searchedUserList.push(this.selectedUserList[index]);
    this.selectedUserList.splice(index, 1);
  }


}
