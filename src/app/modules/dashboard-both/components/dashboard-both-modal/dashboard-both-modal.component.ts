import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { AppUrlsConst, WebServiceConst } from '../../../app-config';
import { DashboardBothService } from '../../services/dashboard-both.services';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { AppSettingsModel } from '../../../shared/models/app-settings-model';
import { UserModel } from '../../../shared/models/user-model';
import { DBSettingsModel } from '../../../shared/models/db-Settings-model';

@Component({
  selector: 'dashboard-both-modal-component',
  templateUrl: 'dashboard-both-modal.component.html',
  styleUrls: ['dashboard-both-modal.component.css']
})
export class DashboardBothModalComponent implements OnInit {
  // @Input() modalTitle;
  public plantTypeRadioValue: string = '';//radio value
  public loginResByPlantType: any = {};
  //var to enable please wait msg
  public changePlantBusy: boolean = false;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private dashboardBothService: DashboardBothService
  ) {
  }
  ngOnInit(): void {
    console.log(" in dashboard both modal component");
  }//end of onInit 

  //method dashboardModalSubmit
  public dashboardModalSubmit() {
    this.changePlantBusy = true;
    if (this.plantTypeRadioValue) {
      this.dashboardBothService.getLoginDetailsByPlantType(this.plantTypeRadioValue)
        .subscribe(res => {
          console.log("res of login by plant type on dashboard both::::", res);
          this.loginResByPlantType = res;
          this.storeResDetToLocalstorage(this.loginResByPlantType);//calling the method to store res det..        
          this.activeModal.close('close of modal');
          //route to home
          this.router.navigate([ROUTE_PATHS.RouteHome]);
        },
          error => {
            console.log("error of dashboard both..", error);
            this.changePlantBusy = false;
          });

    } else {
      alert("Please Choose Any Option");
    }
  }//end of method dashboardModalSubmit



  //cross clock ....activeModal.dismiss('Cross click')
  // activeModal.close('Close click')
  public closeClick() {
    this.router.navigate([ROUTE_PATHS.RouteDashboard]);//route to dashboard
    this.activeModal.dismiss('cross click of dashboard modal');
  }
  //method storeResDetToLocalstorage
  public storeResDetToLocalstorage(resDetails: any) {
    console.log("in storeResDetToLocalstorage method in dashboard-both-modal...");
    let userModel: UserModel = new UserModel();
    userModel.accessToken = resDetails.accessToken;
    userModel.userId = resDetails.userDetails.userId;
    userModel.userDisplayName = resDetails.userDetails.employeeName;
    userModel.employeeId = resDetails.userDetails.employeeId;
    userModel.roleId = resDetails.userDetails.roleId;
    userModel.roleName = resDetails.userDetails.roleName;
    userModel.plantType = this.plantTypeRadioValue;//set the radiovalue to plant type(DI/PI)
    userModel.plantTypeForBoth = resDetails.userDetails.plantType;
    //new add for dashboard date features- 11.10.18   
    //  let date = new Date();
    //  let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    //  let fDateForShow: string = '2018-01-01';
    //  userModel.fromDate = fDateForShow;
    //  userModel.toDate = currentDate;
    userModel.fromDate = resDetails.userDetails.dashboardSelectedFromDate;
    userModel.toDate = resDetails.userDetails.dashboardSelectedToDate;
    //end of new add for dashboard date features- 11.10.18        
    // for commercial settlement access  
    userModel.commSetlmntLevel = resDetails.userDetails.commSetlementLevel;
    this.localStorageService.user = userModel;

    let appSettingsModel: AppSettingsModel = new AppSettingsModel();
    appSettingsModel.authExpireInSec = resDetails.appSettingsDetails.authExpireInSec;
    appSettingsModel.companyId = resDetails.appSettingsDetails.companyId;
    appSettingsModel.diffBetwnCmplntRefDtAndLoggedOnDt = resDetails.appSettingsDetails.diffBetwnCmplntRefDtAndLoggedOnDt;
    appSettingsModel.loginUserPassMaxLength = resDetails.appSettingsDetails.loginUserPassMaxLength;
    appSettingsModel.loginUserPassMinLength = resDetails.appSettingsDetails.loginUserPassMinLength;
    appSettingsModel.rolePrefix = resDetails.appSettingsDetails.rolePrefix;
    appSettingsModel.areaSalesOrZonalManagerDesignationId = resDetails.appSettingsDetails.areaSalesOrZonalManagerDesignationId;
    appSettingsModel.complaintRegistrationActivityId = resDetails.appSettingsDetails.complaintRegistrationActivityId;
    appSettingsModel.preliminaryInvestigationActivityId = resDetails.appSettingsDetails.preliminaryInvestigationActivityId;
    appSettingsModel.pendingComplaintActivityId = resDetails.appSettingsDetails.pendingComplaintActivityId;
    appSettingsModel.closeComplaintActivityId = resDetails.appSettingsDetails.closeComplaintActivityId;
    appSettingsModel.resolutionOfComplaintsAtCustomerPlaceActivityId = resDetails.appSettingsDetails.resolutionOfComplaintsAtCustomerPlaceActivityId;
    appSettingsModel.analyseCustomerComplaintsAndActionPlanActivityId = resDetails.appSettingsDetails.analyseCustomerComplaintsAndActionPlanActivityId;
    appSettingsModel.activityIdFieldName = resDetails.appSettingsDetails.activityIdFieldName;
    appSettingsModel.lastActivityIdFieldName = resDetails.appSettingsDetails.lastActivityIdFieldName;
    appSettingsModel.complaintDetailsAutoIdFieldName = resDetails.appSettingsDetails.complaintDetailsAutoIdFieldName;
    appSettingsModel.menuDetails = resDetails.userDetails.menuDetails;
    //new add for field name
    appSettingsModel.validComplaintFieldName = resDetails.appSettingsDetails.validComplaintFieldName;
    appSettingsModel.complaintLoggedByFieldName = resDetails.appSettingsDetails.complaintLoggedByFieldName;
    appSettingsModel.complaintReceivedByOther = resDetails.appSettingsDetails.complaintReceivedByOther;
    appSettingsModel.siteVisitActivityId = resDetails.appSettingsDetails.siteVisitActivityId;
    appSettingsModel.defaultActivityId = resDetails.appSettingsDetails.defaultActivityId;
    appSettingsModel.changeInQapOrwiOrisoProceedureActivityId = resDetails.appSettingsDetails.changeInQapOrwiOrisoProceedureActivityId;
    appSettingsModel.notificationInMilliSecond = resDetails.appSettingsDetails.notificationInMilliSecond;
    appSettingsModel.siteVisitByFieldName = resDetails.appSettingsDetails.siteVisitByFieldName;
    appSettingsModel.siteVisitRequiredFieldName = resDetails.appSettingsDetails.siteVisitRequiredFieldName;
    appSettingsModel.allocationOfComplaintReadFieldName = resDetails.appSettingsDetails.allocationOfComplaintReadFieldName;
    appSettingsModel.complaintReferenceNoFieldName =
      resDetails.appSettingsDetails.complaintReferenceNoFieldName;

    this.localStorageService.appSettings = appSettingsModel;

    //set the dbsettings details to dbsettings model
    let dbSettingsModel: DBSettingsModel = new DBSettingsModel();
    dbSettingsModel.actionRecomendedAfterSiteVisit = resDetails.dbSettingsDetails.actionRecomendedAfterSiteVisit;
    dbSettingsModel.actionTakenAtPlant = resDetails.dbSettingsDetails.actionTakenAtPlant;
    dbSettingsModel.actionTakenByASM = resDetails.dbSettingsDetails.actionTakenByASM;
    dbSettingsModel.batchNo = resDetails.dbSettingsDetails.batchNo;
    dbSettingsModel.capaAgreementReasonInClose = resDetails.dbSettingsDetails.capaAgreementReasonInClose;
    dbSettingsModel.closeRemarks = resDetails.dbSettingsDetails.closeRemarks;
    dbSettingsModel.complaintDescription = resDetails.dbSettingsDetails.complaintDescription;
    dbSettingsModel.complaintDetails = resDetails.dbSettingsDetails.complaintDetails;
    dbSettingsModel.complaintReceivedByName = resDetails.dbSettingsDetails.complaintReceivedByName;
    dbSettingsModel.complaintReceivedByPhoneNo = resDetails.dbSettingsDetails.complaintReceivedByPhoneNo;
    dbSettingsModel.complaintReferenceNo = resDetails.dbSettingsDetails.complaintReferenceNo;
    dbSettingsModel.contactPersonEmailId = resDetails.dbSettingsDetails.contactPersonEmailId;
    dbSettingsModel.contactPersonName = resDetails.dbSettingsDetails.contactPersonName;
    dbSettingsModel.contactPersonPhoneNo = resDetails.dbSettingsDetails.contactPersonPhoneNo;
    dbSettingsModel.creditNoteNo = resDetails.dbSettingsDetails.creditNoteNo;
    dbSettingsModel.departmentNameOther = resDetails.dbSettingsDetails.departmentNameOther;
    dbSettingsModel.employeeEmailId = resDetails.dbSettingsDetails.employeeEmailId;
    dbSettingsModel.employeeId = resDetails.dbSettingsDetails.employeeId;
    dbSettingsModel.employeeMobileNo = resDetails.dbSettingsDetails.employeeMobileNo;
    dbSettingsModel.employeeName = resDetails.dbSettingsDetails.employeeName;
    dbSettingsModel.expectationOfCustomer = resDetails.dbSettingsDetails.expectationOfCustomer;
    dbSettingsModel.ferulConnectionMethod = resDetails.dbSettingsDetails.ferulConnectionMethod;
    dbSettingsModel.inspectionMarking = resDetails.dbSettingsDetails.inspectionMarking;
    dbSettingsModel.invoiceNo = resDetails.dbSettingsDetails.invoiceNo;
    dbSettingsModel.isNew = resDetails.dbSettingsDetails.isNew;
    dbSettingsModel.marking = resDetails.dbSettingsDetails.marking;
    dbSettingsModel.modeReferenceNo = resDetails.dbSettingsDetails.modeReferenceNo;
    dbSettingsModel.observations = resDetails.dbSettingsDetails.observations;
    dbSettingsModel.outstandingWithCustomer = resDetails.dbSettingsDetails.outstandingWithCustomer;
    dbSettingsModel.ovality = resDetails.dbSettingsDetails.ovality;
    dbSettingsModel.password = resDetails.dbSettingsDetails.password;
    dbSettingsModel.pipeCuttingMethodApplied = resDetails.dbSettingsDetails.pipeCuttingMethodApplied;
    dbSettingsModel.pipeCuttingToolsUsed = resDetails.dbSettingsDetails.pipeCuttingToolsUsed;
    dbSettingsModel.pipeJointing = resDetails.dbSettingsDetails.pipeJointing;
    dbSettingsModel.presentStatus = resDetails.dbSettingsDetails.presentStatus;
    dbSettingsModel.previousComplaintReferenceNo = resDetails.dbSettingsDetails.previousComplaintReferenceNo;
    dbSettingsModel.requiredCommercialSettlementReasonInClose = resDetails.dbSettingsDetails.requiredCommercialSettlementReasonInClose;
    dbSettingsModel.resolutionRectificationAction = resDetails.dbSettingsDetails.resolutionRectificationAction;
    dbSettingsModel.roleName = resDetails.dbSettingsDetails.roleName;
    dbSettingsModel.rootCauseAnalysisAgreementReasonInClose = resDetails.dbSettingsDetails.rootCauseAnalysisAgreementReasonInClose;
    dbSettingsModel.rubberGasketBatchNo = resDetails.dbSettingsDetails.rubberGasketBatchNo;
    dbSettingsModel.rubberGasketBulb = resDetails.dbSettingsDetails.rubberGasketBulb;
    dbSettingsModel.rubberGasketHeal = resDetails.dbSettingsDetails.rubberGasketHeal;
    dbSettingsModel.rubberGasketMake = resDetails.dbSettingsDetails.rubberGasketMake;
    dbSettingsModel.rubberGasketTestCertificate = resDetails.dbSettingsDetails.rubberGasketTestCertificate;
    dbSettingsModel.securityAnswer = resDetails.dbSettingsDetails.securityAnswer;
    dbSettingsModel.straigtness = resDetails.dbSettingsDetails.straigtness;
    dbSettingsModel.testCertificate = resDetails.dbSettingsDetails.testCertificate;
    dbSettingsModel.thicknessWall = resDetails.dbSettingsDetails.thicknessWall;
    dbSettingsModel.unloadingRelatedMethodApplied = resDetails.dbSettingsDetails.unloadingRelatedMethodApplied;
    dbSettingsModel.unloadingRelatedToolsUsed = resDetails.dbSettingsDetails.unloadingRelatedToolsUsed;
    dbSettingsModel.userId = resDetails.dbSettingsDetails.userId;
    dbSettingsModel.validInvalidComplaintRemarks = resDetails.dbSettingsDetails.validInvalidComplaintRemarks;
    dbSettingsModel.batchNoInInvoiceDetails = resDetails.dbSettingsDetails.batchNoInInvoiceDetails;
    this.localStorageService.dbSettings = dbSettingsModel;
    console.log("Localstorage of dashboard-both::::", this.localStorageService);
  }
  //start method onPlantTypeRadioClick
  public onPlantTypeRadioClick(plantTypeRadioValue) {
    console.log("plantTypeRadioValue:: ", plantTypeRadioValue);
    this.plantTypeRadioValue = plantTypeRadioValue;
  }//end of method onPlantTypeRadioClick

}//end of class



