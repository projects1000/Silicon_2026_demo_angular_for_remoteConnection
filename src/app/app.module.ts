import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SenderComponent } from './sender/sender.component';
import { ReceiverComponent } from './receiver/receiver.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RetryInterceptor } from './interceptors/retry.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SenderComponent,
    ReceiverComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
    ,HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
