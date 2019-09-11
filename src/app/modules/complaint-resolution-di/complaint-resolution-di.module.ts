import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';  
import { DatePipe } from '@angular/common';
import { CommonModule, APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";
import { ComplaintResolutionDIService } from "./services/complaint-resolution-di.service";
import { ComplaintResolutionDIComponent } from "./components/complaint-resolution-di.component";
import { ComplaintResoluionDIAddComponent } from "./components/complaint-resolution-di-add/complaint-resolution-di-add.component";

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
    ComplaintResolutionDIComponent,
    ComplaintResoluionDIAddComponent
  ],  
  exports: [
    ComplaintResolutionDIComponent,
   ComplaintResoluionDIAddComponent
  ],
  providers : [
    DatePipe,
    ComplaintResolutionDIService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class ComplaintResolutionDIModule { }
