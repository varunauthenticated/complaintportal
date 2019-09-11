import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GridSearchPipe } from "./components/pipe/datagrid-search.pipe";
import { FlowmangementComponent } from './components/flowmangement/flowmangement.component';
import { ComplaintDIService } from './services/complaint-di.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    GridSearchPipe,
    FlowmangementComponent
  ],
  exports:[
    GridSearchPipe,FlowmangementComponent
  ],
  providers: [
    ComplaintDIService
  ]
})
export class SharedModule { }
