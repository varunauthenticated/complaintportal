import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ComplaintDIRegisterComponent } from './components/complain-di-register/complaint-di-register.component';
import { ComplainDIViewDetailsComponent } from './components/complain-di-view-details/complain-di-view-details.component';
import { ComplainDIViewComponent } from "./components/complain-di-view/complain-di-view.component";
import { CommonModule } from "@angular/common";
import { ComplaintDIRegisterDataService } from "./services/complaint-di-register-data.service";
import { ViewComplaintDIDataService } from "./services/complaint-di-view-data.service";
import { BusySpinnerModule } from "../../widget/busy-spinner/busy-spinner.module";
import { DatePipe } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { NgbdComplaintDIRegisterModalComponent } from "./components/complain-di-register/complaint-di-register-modal/complaint-di-register-modal.component";
import { ComplaintDIRegisterEmitService } from "./services/complaint-di-register-emit.service"
import { ComplaintDIInvoiceDetailsService } from "./services/complaint-di-invoice-details.service"
//for di customer search
import { ComplaintDIInvoiceSearchComponent } from './components/complain-di-register/complain-di-invoice-search/complaint-di-invoice-search.component';
import { ComplaintDICustomerSearchComponent } from './components/complain-di-register/complain-di-customer-search/complaint-di-customer-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    ComplaintDIRegisterComponent,
    ComplainDIViewComponent,
    ComplainDIViewDetailsComponent,
    NgbdComplaintDIRegisterModalComponent,
    ComplaintDIInvoiceSearchComponent,
    ComplaintDICustomerSearchComponent
  ],
  entryComponents: [NgbdComplaintDIRegisterModalComponent],  
  exports: [
    ComplaintDIRegisterComponent,
    ComplainDIViewComponent,
    ComplainDIViewDetailsComponent,
    ComplaintDIInvoiceSearchComponent,
    ComplaintDICustomerSearchComponent
  ],
  providers : [
    ComplaintDIRegisterDataService,
    ViewComplaintDIDataService,
    DatePipe,
    ComplaintDIRegisterEmitService,
    ComplaintDIInvoiceDetailsService
  ]
})
export class ComplaintRegisterModule { }
