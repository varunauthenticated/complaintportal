import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { AllocateComplaintComponent } from "./components/allocate-complaints/allocate-complaint.component";
import { BusySpinnerModule } from "../widget/busy-spinner/busy-spinner.module";
import { AllocateComplaintDIDataService } from './services/allocate-complaint-data.services';
import { AllocateComplaintAddComponent } from './components/allocate-complaint-add/allocate-complaint-add.component';
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
    AllocateComplaintComponent,//allocate complaint
    AllocateComplaintAddComponent//for allocate complaint add in modal
  ],
  exports: [
    AllocateComplaintComponent,//allocate complaint
    AllocateComplaintAddComponent//for allocate complaint add in modal
  ],
  
  providers: [
      AllocateComplaintDIDataService
   ]
  
})
export class AllocateReallocateModule { }
