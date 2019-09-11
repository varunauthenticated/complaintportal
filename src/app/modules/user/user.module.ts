import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { AddUserComponent } from "./components/user-add/user-add.component";
import { ViewUserComponent } from "./components/user-view/user-view.component";
import { AddUserDataService } from "./services/add-user-data.service";
import { ViewUserDataService } from "./services/view-user-data.service";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    RouterModule, //for router
    BusySpinnerModule,//for busy Spinner
    SharedModule
  ],
  declarations: [
    AddUserComponent,
    ViewUserComponent
  ],
 
  exports: [
    AddUserComponent,
    ViewUserComponent
   
  ],
  providers : [
    AddUserDataService,//for add user
    ViewUserDataService//for view user
  ]
})
export class UserModule { }
