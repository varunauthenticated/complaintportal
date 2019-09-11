import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { InvestigationReportDiComponent } from "./components/investigation-report-di-add/investigation-report-di-add.component";
import { InvestigationReportDiViewDetailsComponent } from "./components/investigation-report-di-view-details/investigation-report-di-view-details.component";
import { InvestigationReportDIDataService } from "./services/investigation-report-di.service";
import { InvestigationReportDIViewDataService } from "./services/investigation-report-di-view.service";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { SharedModule } from "../shared/shared.module";
@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,//for busy Spinner
    SharedModule
  ],
  declarations: [
    InvestigationReportDiComponent,//preli add
    InvestigationReportDiViewDetailsComponent//preli view details
   
  ],
  exports: [
    InvestigationReportDiComponent,//preli add
    InvestigationReportDiViewDetailsComponent//preli view details
  ],
  providers: [
    InvestigationReportDIDataService,//preli add
    InvestigationReportDIViewDataService//preli view
  ]
  
  
})
export class InvestigationReportDiModule { }
