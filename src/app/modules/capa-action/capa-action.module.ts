import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { DatePipe } from '@angular/common';
import { HttpModule } from '@angular/http';  
import { CAPAActionComponent } from "./components/capa-action.component";
import { CAPAActionDIAddComponent } from "./components/capa-action-di-add/capa-action-di-add.component";
import { CAPAActionService } from "./services/capa-action.service";
import { SharedModule } from "../shared/shared.module";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";

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
    CAPAActionComponent,
    CAPAActionDIAddComponent
  ],  
  exports: [
   CAPAActionComponent
  ],
  providers : [
    DatePipe,
    CAPAActionService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class CAPAActionModule { }
