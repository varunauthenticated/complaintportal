import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BusySpinnerModule } from '../../widget/busy-spinner/busy-spinner.module';
import { CommercialSettlementPIComponent } from '../commercial-settlement-pi/components/commercial-settlement-pi.component';
import { CommercialSettlementPIDataService } from '../commercial-settlement-pi/services/commercial-settlement-pi-data.service';

@NgModule({
    imports:[
        ReactiveFormsModule,
        BrowserModule,
        CommonModule,
        BusySpinnerModule
    ],
    declarations:[
        CommercialSettlementPIComponent
    ],
    exports:[
        CommercialSettlementPIComponent
    ],
    providers:[
        CommercialSettlementPIDataService
    ]
})

export class CommercialSettlementPIModule {}