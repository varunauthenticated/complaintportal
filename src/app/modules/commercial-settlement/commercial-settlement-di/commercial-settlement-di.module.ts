import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BusySpinnerModule } from '../../widget/busy-spinner/busy-spinner.module';
import { CommercialSettlementDIComponent } from '../commercial-settlement-di/components/commercial-settlement-di.component';
import { CommercialSettlementDIDataService } from '../commercial-settlement-di/services/commercial-settlement-di-data.service';

@NgModule({
    imports:[
        ReactiveFormsModule,
        BrowserModule,
        CommonModule,
        BusySpinnerModule
    ],
    declarations:[
        CommercialSettlementDIComponent
    ],
    exports:[
        CommercialSettlementDIComponent
    ], 
    providers:[
        CommercialSettlementDIDataService
    ]
})

export class CommercialSettlementDIModule {}