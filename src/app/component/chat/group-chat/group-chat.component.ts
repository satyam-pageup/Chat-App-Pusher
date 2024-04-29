import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGetAllUser, IGroupChat } from '../../../response/user.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { IEmplyeeOptions } from '../../../model/option.model';
import { ResponseIterableI } from '../../../response/responseG.response';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent extends ComponentBase implements OnInit {

  private options: IEmplyeeOptions = {
    isPagination: false,
    index: 0,
    take: 0,
    search: "",
    orders: 0,
    orderBy: ""
  }
  public allUserList: IGroupChat[] = [];

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.postAPICallPromise<IEmplyeeOptions, ResponseIterableI<IGetAllUser[]>>(APIRoutes.getAllEmployee, this.options, this.headerOption).then(
      (res) => {
        res.iterableData.map((chat) => {
          const object: IGroupChat = { ...chat, isSelected: false }
          this.allUserList.push(object);
        })
      }
    )
  }

  modalRef?: BsModalRef;
  resolve: any;


  //getting access to html template
  @ViewChild('template') modalTemplate!: TemplateRef<void>;

  //if yes is clicked, we get 'true'
  public confirm() {
    this.modalRef?.hide();
    this.resolve(true);
  }

  //if no is clicked, we get 'false'
  public decline() {
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal() {
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });

    //creating promise to wait for result, untill user clicks yes or no
    return new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    })
  }

  // userList: {id:number,name:string}[] = [
  //   { id: 1, name: 'User 1' },
  //   { id: 2, name: 'User 2' },
  //   { id: 3, name: 'User 3' }
  // ];

  // selectedUsers: {id:number,name:string}[] = [];

  // isSelected(user: IGetAllUser): boolean {
  //   return this.allUserList.some(selectedUser => selectedUser.id === user.id);
  // }

  // toggleSelection(user: IGetAllUser): void {
  //   if (this.isSelected(user)) {
  //     this.allUserList = this.allUserList.filter(selectedUser => selectedUser.id !== user.id);
  //   } else {
  //     this.allUserList.push(user);
  //   }
  // }

}
