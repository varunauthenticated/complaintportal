import { NgModule }            from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BusySpinnerModule } from '../../widget/busy-spinner/busy-spinner.module';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CADIAddEditComponent } from './components/ca-di-add-edit/ca-di-add-edit.component';
import { CADIViewDetailsComponent } from './components/ca-di-view-details/ca-di-view-details.component';
@NgModule({
  imports:      [
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BusySpinnerModule,
    SharedModule,
    
  ],
  declarations: [
    CADIAddEditComponent,//add/edit
    CADIViewDetailsComponent,//view
  ],
  
  exports: [
    CADIAddEditComponent,//add/edit
    CADIViewDetailsComponent//view
  ],
  providers : [    
    DatePipe  
  ],
})
export class CADIModule { }