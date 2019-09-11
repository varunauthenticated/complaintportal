import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';  
import { DatePipe } from '@angular/common';
import { CommonModule, APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ComplaintResolutionPIComponent } from "./components/complaint-resolution-pi.component";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";
import { ComplaintResolutionPIService } from "./services/complaint-resolution-pi.service";
import { ComplaintResoluionPIAddComponent } from  "./components/complaint-resolution-pi-add/complaint-resolution-pi-add.component";
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
    ComplaintResolutionPIComponent,
    ComplaintResoluionPIAddComponent//modify
  ],  
 
  exports: [
   ComplaintResolutionPIComponent,
   ComplaintResoluionPIAddComponent
  ],
  providers : [
    DatePipe,
    ComplaintResolutionPIService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class ComplaintResolutionPIModule { }
