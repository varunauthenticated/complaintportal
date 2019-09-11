import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { DatePipe } from '@angular/common';
import { BusySpinnerModule } from "../../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../../shared/shared.module";
import { CloseComplaintDIService } from "./services/close-complaint-di.service";
import { CloseComplaintDIComponent } from "./components/close-complaint-di.component";
import { CloseComplaintDIAddComponent } from './components/close-complaint-di-add/close-complaint-di-add.component';

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    CloseComplaintDIComponent,
    CloseComplaintDIAddComponent
  ],  
  exports: [
    CloseComplaintDIComponent,
    CloseComplaintDIAddComponent
  ]
  ,
  providers : [
    CloseComplaintDIService,
  ]
})
export class CloseComplaintDIModule { }
