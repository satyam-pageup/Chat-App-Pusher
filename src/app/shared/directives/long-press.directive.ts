import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appLongPress]'
})
export class LongPressDirective {

  @Output() longPress = new EventEmitter();

  private timeoutHandler: any;

  constructor() { }

  @HostListener('mousedown') onMouseDown() {
    this.timeoutHandler = setTimeout(() => {
      this.longPress.emit();
    }, 1000); // Adjust the time as needed
  }

  @HostListener('mouseup') onMouseUp() {
    clearTimeout(this.timeoutHandler);
  }

  @HostListener('mouseleave') onMouseLeave() {
    clearTimeout(this.timeoutHandler);
  }

}
