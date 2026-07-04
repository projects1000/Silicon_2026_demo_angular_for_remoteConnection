import { Component } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent {

  constructor(public sharedService: SharedService) {
   }

    message: string = "";

    source: string = "";
    welcomeText: string = '';
    addressName: string = '';
    addressText: string = '';
    saveResponse: string = '';


  send() {
    //this.sharedService.setMessage(this.message);

    this.sharedService.captureMessage(this.message); //speaking into microphone
  }

  callWelcome() {
    this.sharedService.getWelcome().subscribe(
      res => this.welcomeText = res,
      err => this.welcomeText = 'Error: ' + (err.message || err.statusText || err)
    );
  }

  saveAddress() {
    const payload = { name: this.addressName, address: this.addressText };
    this.sharedService.saveAddress(payload).subscribe(
      res => this.saveResponse = res,
      err => this.saveResponse = 'Error: ' + (err.message || err.statusText || err)
    );
  }

}



