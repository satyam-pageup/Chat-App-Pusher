import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComponentBase } from '../../../shared/class/ComponentBase.class';
import { CGroupChat, IGroupChatResponse } from '../../../response/group-chat.response';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent extends ComponentBase implements OnInit {
  
  modalRef?: BsModalRef;
  resolve: any;

  @ViewChild('template') modalTemplate!: TemplateRef<void>;

  public groupChatList: IGroupChatResponse[] = [];
  public groupChatDetail: CGroupChat = new CGroupChat();
  
  constructor(private modalService: BsModalService){
    super();
  }

  
  ngOnInit(): void {
      
  }

  public confirm(){
    this.modalRef?.hide();
    this.resolve(true);
  }

  public decline(){
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal(){
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });

    return new Promise<boolean>((resolve) =>{
      this.resolve = resolve;
    })
  }


  private getGroupChat(){
    
  }

}
