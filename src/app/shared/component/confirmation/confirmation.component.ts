import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {

  constructor(private modalService: BsModalService){}
  public messageC: string = ""; 
  public title: string = ""; 

  modalRef?: BsModalRef;
  resolve: any;

  //getting access to html template
  @ViewChild('template') modalTemplate!: TemplateRef<void>;
  
  //if yes is clicked, we get 'true'
  public confirm(){
    this.modalRef?.hide();
    this.resolve(true);
  }

  //if no is clicked, we get 'false'
  public decline(){
    this.modalRef?.hide();
    this.resolve(false);
  }

  public openModal(Title:string,message:string){
    this.messageC=message;
    this.title=Title;
    this.modalRef = this.modalService.show(this.modalTemplate, { class: 'modal-md' });

    //creating promise to wait for result, untill user clicks yes or no
    return new Promise<boolean>((resolve) =>{
      this.resolve = resolve;
    })
  }
}
