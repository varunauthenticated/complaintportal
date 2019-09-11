import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { LoginModel } from '../models/login-model';
import { UserValidators } from '../models/user-validator';
import { LoginService } from '../services/login.service';
import { ROUTE_PATHS } from '../../router/router-paths';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { UserModel } from "../../shared/models/user-model";
import { AppSettingsModel } from "../../shared/models/app-settings-model";
import { DBSettingsModel } from '../../shared/models/db-Settings-model';

@Component({
  selector: 'ispl-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  public title: string = "Complaint Management System";
  public loginForm: FormGroup;
  public loginError: string = '';

  public tstJson: any[] = [];
  public busySpinner: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private localStorageService: LocalStorageService) {

      this.buildForm();
  }

  ngOnInit(): void {
    console.log("Login component..");
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      'username': [''
        , [
          Validators.required,
        ]
      ],
      'password': [''
        , [
          Validators.required,
        ]
      ]
    });

  }

  public loginSubmit(): void {
    this.busySpinner = true;//to load the spinner
    console.log("login click");
    let user: any = {};

    user.userId = this.loginForm.value.username;
    user.password = this.loginForm.value.password;
    this.loginService.authenticate(user).
        subscribe(res => {
          console.log("Login Success Response: ",res);
          // this.setLoginDetailsToLocalstorageService(res);  
          if(res.msgType == "Info"){    
            this.setLoginDetailsToLocalstorageService(res);       
            this.router.navigate([ROUTE_PATHS.RouteHome]);               
          }else{
            this.busySpinner = false;//to stop the spinner
            this.loginError = res.msg;
            // "Netowrk/Server Problem";
          }
        },
        err => {
          this.busySpinner = false;//to stop the spinner
          if (err.status == 401) {
            this.loginError = "Invalid User Credentials";
          } else {
            this.loginError = "Netowrk/Server Problem";
          }
        });       
  }//end of method login service

  //new add to add login details in localstorage services
  public setLoginDetailsToLocalstorageService(resDetails: any){
    console.log("in setLoginDetailsToLocalstorageService method...");
    let userModel: UserModel  = new UserModel();
    userModel.accessToken = resDetails.accessToken;
    userModel.userId = this.loginForm.value.username;
    userModel.userDisplayName = resDetails.userDetails.employeeName;
    userModel.employeeId = resDetails.userDetails.employeeId;
    userModel.roleId = resDetails.userDetails.roleId;
    userModel.roleName = resDetails.userDetails.roleName;
    userModel.plantType = resDetails.userDetails.plantType; 
    userModel.plantTypeForBoth = resDetails.userDetails.plantType; 
    //new add for dashboard date features- 11.10.18   
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
    
  }

}//end of class
