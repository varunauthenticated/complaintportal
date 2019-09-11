import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BusySpinnerModule } from '../../widget/busy-spinner/busy-spinner.module';
import { SharedModule } from '../../shared/shared.module';
import { CloseComplainDIAddEditComponent } from './components/close-complain-di-add-edit/close-complain-di-add-edit.component';
import { CloseComplainDIViewDetailsComponent } from './components/close-complain-di-view-details/close-complain-di-view-details.component';

@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule
  ],
  declarations: [
    CloseComplainDIAddEditComponent,//close complain add/edit
    CloseComplainDIViewDetailsComponent//close complain view details
   
  ],  
  exports: [
    CloseComplainDIAddEditComponent,//close complain add/edit
    CloseComplainDIViewDetailsComponent//close complain view details
  ]
 
})
export class CloseComplainDIModule { }
