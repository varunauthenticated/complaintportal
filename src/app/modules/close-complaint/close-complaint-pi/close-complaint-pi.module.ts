import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { CloseComplaintPIComponent } from "./components/close-complaint-pi.component";
import { CloseComplaintPIService } from "./services/close-complaint-pi.service";
import { BusySpinnerModule } from "../../widget/busy-spinner/busy-spinner.module";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { CloseComplaintPIAddComponent } from './components/close-complaint-pi-add/close-complaint-pi-add.component';

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    CloseComplaintPIComponent,
    CloseComplaintPIAddComponent
  ],  
  
  exports: [
    CloseComplaintPIComponent,
    CloseComplaintPIAddComponent
  ]
  ,
  providers : [
    CloseComplaintPIService
  ]
})
export class CloseComplaintPIModule { }
