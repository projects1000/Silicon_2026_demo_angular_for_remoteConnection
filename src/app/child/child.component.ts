import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent {

    constructor(public sharedService: SharedService) { 

     }
     mytotalBill : number = 0;

     ngOnInit() {
      this.mytotalBill = this.sharedService.totalBill;
      console.log(this.sharedService.totalBill);

      alert(this.sharedService.getMessage());
    }

  @Input()  childData: string = "";

  @Output()  childEvent = new EventEmitter<string>();
  childInput: string = "";




// This method will send data to parent component using event emitter
  sendToParent() { 
    
    this.childEvent.emit(this.childInput);
  }
callService() {
  alert(this.sharedService.getMessage());

}
}
