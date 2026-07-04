import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgClass } from "../../../node_modules/@angular/common/index";

@Component({
  selector: 'app-receiver',
  templateUrl: './receiver.component.html',
  styleUrls: ['./receiver.component.css'],
})
export class ReceiverComponent {

  constructor(public sharedService : SharedService  ) { }



receivedMessage: string = "";
receivedMessageArray: string[] = [];
ngOnInit() {

   this.receivedMessage = this.sharedService.getMessage();

  this.sharedService.message$.subscribe((message) => {
    this.receivedMessageArray.push(message);
  });
}



receive() {
  this.receivedMessage = this.sharedService.getMessage();
}


}

