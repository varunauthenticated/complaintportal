import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompStatusStructureComponent } from './components/comp-status-structure.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule,
    CompStatusStructureComponent
  ],
  declarations: [
    CompStatusStructureComponent
  ],
  providers: [

  ]
})
export class CompStatusStructureModule { }
