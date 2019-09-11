import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ComplaintRegisterModule } from '../complain/complain-di/complain-di.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { TilesModule } from '../widget/Tiles/tiles.module';
import { LogoutModule } from '../logout/logout.module';
import { AuthenticationGuardService } from '../router/services/route-guard.service';
import { UserModule } from '../user/user.module';
import { ManageProfileModule } from '../manage-profile/manage-profile.module';
//importing ComplaintPIRegisterModule 09.08.17
import { ComplaintPIRegisterModule } from '../complain/complain-pi/complain-pi.module';
//allocate realllocate complaint
import { AllocateReallocateModule } from '../allocate-reallocate-complaint/allocate-reallocate.module';
import { ComplaintResolutionDIModule } from '../complaint-resolution-di/complaint-resolution-di.module';
import { CAPAActionModule } from '../capa-action/capa-action.module';
import { CAPAActionPIModule } from '../capa-action-pi/capa-action-pi.module'
import { ComplaintResolutionPIModule } from '../complaint-resolution-pi/complaint-resolution-pi.module'
import { CloseComplaintPIModule } from '../close-complaint/close-complaint-pi/close-complaint-pi.module';
import { CloseComplaintDIModule } from '../close-complaint/close-complaint-di/close-complaint-di.module';
import { DashboardBothModule } from '../dashboard-both/dashboard-both.module';  
import { RoleModule } from '../role/role.module';//role module 
import { HomeDataService } from './services/home.services'; 
import { ReportDIModule } from '../report/report-di/report-di.module';
import { InvestigationReportDiModule } from '../investigation-report-di/investigavtion-report-di.module';
import { RCADIModule } from '../rca/rca-di/rca-di.module';
import { CADIModule } from '../ca/ca-di/ca-di.module';
import { PADIModule } from '../pa/pa-di/pa-di.module';
import { CloseComplainDIModule } from '../close-complain/close-complain-di/close-complain-di.module';
import { ActivityTrackingDIModule } from '../../modules/activity-tracking/activity-tracking-di/activity-tracking-di.module';
import { CommercialSettlementDIModule } from '../commercial-settlement/commercial-settlement-di/commercial-settlement-di.module';
import { CommercialSettlementPIModule } from '../commercial-settlement/commercial-settlement-pi/commercial-settlement-pi.module';
//for report
import { ChartReportModule } from '../widget/chart-report/chart-report.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    ComplaintRegisterModule,
    DashboardModule,
    DashboardBothModule,//dashboard both
    TilesModule,
    LogoutModule,
    UserModule,
    ManageProfileModule,//manage profile 
    InvestigationReportDiModule,
    ComplaintPIRegisterModule, // new add for ComplaintPIRegisterModule 09.08.17
    AllocateReallocateModule,//new add for allocate reallocate complaint
    ComplaintResolutionDIModule,// ComplaintResolutionDIModule
    CAPAActionModule,//di
    ComplaintResolutionPIModule, // new add for ComplaintResolutionPIModule
    CAPAActionPIModule, // new add for CAPAActionPIModule
    CloseComplaintDIModule,//for close complaint di
    CloseComplaintPIModule, //for close complaint pi
    RoleModule,// roleModule
    ReportDIModule,//report di module
    RCADIModule,//rca di module
    CADIModule,//for ca di module
    PADIModule,//for pa di module
    CloseComplainDIModule,//close complain di
    ActivityTrackingDIModule,//comp status module
    CommercialSettlementDIModule,//commercial settlement di
    CommercialSettlementPIModule,//comm sett pi
    ChartReportModule//for report module
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  
  providers: [
    HomeDataService,
    AuthenticationGuardService
  ]
})
export class HomeModule { }
