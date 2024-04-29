import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGetAllUser, IGroupChat } from '../../../response/user.response';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { IEmplyeeOptions } from '../../../model/option.model';
import { IResponseG, ResponseIterableI } from '../../../response/responseG.response';
import { APIRoutes } from '../../../shared/constants/apiRoutes.constant';
import { UtilService } from '../../../../services/util.service';
import { FormControl, Validators } from '@angular/forms';
import { ICreateGroup } from '../../../model/group-chat.model';

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
  public groupName: FormControl<string | null> = new FormControl('', Validators.required);
  public searchedWord: string = '';

  modalRef?: BsModalRef;
  resolve: any;

  constructor(private modalService: BsModalService, private _utilService: UtilService) {
    super();
  }

  ngOnInit(): void {
  }

  private getAllUsers() {
    this.postAPICallPromise<IEmplyeeOptions, ResponseIterableI<IGetAllUser[]>>(APIRoutes.getAllEmployee, this.options, this.headerOption).then(
      (res) => {
        res.iterableData.map((chat) => {
          if (chat.id != this._utilService.loggedInUserId) {
            const object: IGroupChat = { ...chat, isSelected: false }
            this.allUserList.push(object);
          }
        })
        this.searchedUserList = this.allUserList;
      }
    )
  }



  public createGroup() {

    this.groupName.markAsTouched();
    if (this.selectedUserList.length == 0) {
      this._toastreService.info("Please select atleast one user");
    }
    else
      if (this.groupName.valid) {
        let employeeIds: Array<number> = [];
        let admins: Array<number> = [];

        this.selectedUserList.forEach(
          (selUser) => {
            employeeIds.push(selUser.id);
          }
        );

        employeeIds.push(this._utilService.loggedInUserId);

        admins.push(this._utilService.loggedInUserId);

        const newGroup: ICreateGroup = {
          groupName: (this.groupName.value as string).trim(),
          employeeIds: employeeIds,
          admins: admins
        }

        this.postAPICallPromise<ICreateGroup, IResponseG<null>>(APIRoutes.createGroup, newGroup, this.headerOption).then(
          (res) => {
            this._toastreService.success(res.message);
            this.modalRef?.hide();
            this.resolve(true);
          }
        )
      }
  }

  public decline() {
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal() {
    this.allUserList = [];
    this.selectedUserList = [];
    this.groupName.reset();
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });
    this.getAllUsers();
    return new Promise<boolean>((resolve) => {
      this.resolve = resolve;
    })
  }

  public onTyping() {
    console.log(this.searchedWord);
    // this.searchedUserLis
    if (this.searchedWord == "") {
      // this.searchedUserList=this.allUserList;
      this.allUserList.map(
        (allUser) => {
          if (!this.selectedUserList.includes(allUser)) {
            this.searchedUserList.push(allUser);
          }
        }
      )
      return;
    }
    this.searchedUserList = this.searchedUserList.filter((user) => user.employeeName.toLowerCase().includes(this.searchedWord.toLowerCase()))
  }

  public selectUser(index: number) {
    this.selectedUserList.push(this.allUserList[index]);
    this.allUserList.splice(index, 1);
  }

  public unSelectUser(index: number) {
    this.allUserList.push(this.selectedUserList[index]);
    this.selectedUserList.splice(index, 1);
  }


}
