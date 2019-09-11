import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { BusySpinnerModule } from "../../widget/busy-spinner/busy-spinner.module";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { ReportsDIViewComponent } from "./components/report-di-view/report-di-view.component";
import { ReportsDIDataService } from "./services/report-di-view-data.service";
import { ReportDIViewDetailsComponent } from "./components/report-di-view-details/report-di-view-details.component";
@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    ReportsDIViewComponent,
    ReportDIViewDetailsComponent
  ],
  
  exports: [
    ReportsDIViewComponent,
    ReportDIViewDetailsComponent
  ],
  providers : [    
    DatePipe,
    ReportsDIDataService    
  ]
})
export class ReportDIModule { }
