import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { BusySpinnerModule } from "../../widget/busy-spinner/busy-spinner.module";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { RCADIAddEditComponent } from "./components/rca-di-add-edit/rca-di-add-edit.component";
import { RCADIViewDetailsComponent } from "./components/rca-di-view-details/rca-di-view-details.component";

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    RCADIAddEditComponent,//add/edit
    RCADIViewDetailsComponent//view details
  ],
  
  exports: [
    RCADIAddEditComponent,//add/edit
    RCADIViewDetailsComponent//view details
  ],
  providers : [    
    DatePipe
  ]
})
export class RCADIModule { }