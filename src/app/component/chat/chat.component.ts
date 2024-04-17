import { Component } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  constructor(public _utilService: UtilService) {
   
  }

}
