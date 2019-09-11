import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BusySpinnerModule } from '../../widget/busy-spinner/busy-spinner.module';
import { DatePipe } from '@angular/common';
import { CompStatusStructureModule } from '../../widget/comp-status-structure/comp-status-structure.module';
import { ActivityTrackingDIComponent } from '../activity-tracking-di/components/activity-tracking-di.component';
import { ActivityTrackingDIService } from '../activity-tracking-di/services/activity-tracking-di.services';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports:[
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        BusySpinnerModule,
        SharedModule,
        CompStatusStructureModule//for comp status structure 
    ],
    declarations:[
        ActivityTrackingDIComponent
    ],
    exports:[
        ActivityTrackingDIComponent
    ],
    providers:[
        ActivityTrackingDIService
    ]
})
export class ActivityTrackingDIModule {}