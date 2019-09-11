import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { LoginModule } from './modules/login/login.module';
import { ROUTER_MODULE } from './modules/router/router.module';

import { AppComponent } from './app.component';
import { HomeModule } from "./modules/home/home.module";
import { LocalStorageService } from "./modules/shared/services/local-storage.service";
//for modal
import { ModalModule } from './modules/widget/modal/modal.module';
import { SessionErrorService } from "./modules/shared/services/session-error.service";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    CommonModule,
    HttpModule,
    RouterModule,
    HomeModule,
    LoginModule,
    ROUTER_MODULE,
    ModalModule
  ],
  declarations: [
    AppComponent,
  //  NgbdModalComponent,
   
  ],
  //new add for modal
  // entryComponents:[
  //   NgbdModalComponent,
    
  // ],
  
  providers: [
    LocalStorageService,
    SessionErrorService
  ],

 
  bootstrap: [AppComponent]
})
export class AppModule { }
