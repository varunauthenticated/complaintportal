import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';  
import { CommonModule, APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { CAPAActionPIComponent } from "./components/capa-action-pi.component";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { CAPAActionPIService } from "./services/capa-action-pi.service";
import { CAPAActionPIAddComponent } from "./components/capa-action-pi-add/capa-action-pi-add.component";

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    HttpModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    CAPAActionPIComponent,
    CAPAActionPIAddComponent
   
  ],  
  exports: [
   CAPAActionPIComponent,
   CAPAActionPIAddComponent
  ],
  providers : [
    DatePipe,
    CAPAActionPIService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class CAPAActionPIModule { }
