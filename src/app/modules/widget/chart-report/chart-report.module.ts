import { NgModule,enableProdMode,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { FusionChartsModule } from 'angular-fusioncharts';

// Load FusionCharts
import * as FusionCharts from 'fusioncharts';
// Load Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';
// Load fusion theme
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { ChartReportComponent } from  './components/chart-report.component';

// Add dependencies to FusionChartsModule
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme)

import { ComplaintDIService } from '../../shared/services/complaint-di.service';
@NgModule({
    imports:[
        BrowserModule,
        FusionChartsModule
    ],
    exports: [
        ChartReportComponent
    ],
    declarations: [
        ChartReportComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [ComplaintDIService]
})

export class ChartReportModule { }