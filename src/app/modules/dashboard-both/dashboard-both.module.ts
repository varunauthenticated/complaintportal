import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardBothComponent } from "./components/dashboard-both.component";
import { TilesModule } from "../widget/Tiles/tiles.module";
import { DashboardBothModalComponent } from './components/dashboard-both-modal/dashboard-both-modal.component';
import { DashboardBothService } from './services/dashboard-both.services';

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    TilesModule
  ],
  declarations: [
    DashboardBothComponent,
    DashboardBothModalComponent//modal
  ],
  exports: [
    DashboardBothComponent
  ],
  entryComponents: [
    DashboardBothModalComponent//modal
  ],
  providers: [
    DashboardBothService
  ]
})
export class DashboardBothModule { }
