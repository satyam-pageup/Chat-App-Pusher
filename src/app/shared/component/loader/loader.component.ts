import { Component } from '@angular/core';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  public showLoader: boolean = false;

  constructor(private _loader: LoaderService) {
    this._loader.isLoader$.subscribe(
      (res: boolean) => {
        this.showLoader = res;
      }
    )
  }
}
