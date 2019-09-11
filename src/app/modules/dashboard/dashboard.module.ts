import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
// import { ComplaintRegisterModule } from "../complain/complain.module";
import { DashboardComponent } from "./components/dashboard.component";
import { TilesModule } from "../widget/Tiles/tiles.module";
import { TilesInteractionService } from "./services/tiles-interaction.service";
import { ChartReportModule } from '../widget/chart-report/chart-report.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    TilesModule,
    ChartReportModule//for chart report
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  providers: [
    TilesInteractionService
  ]
})
export class DashboardModule { }
