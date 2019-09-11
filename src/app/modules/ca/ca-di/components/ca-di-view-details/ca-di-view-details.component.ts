import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { CADIConfigModel } from '../../models/ca-di-config.model';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
import { MsgConfigModel } from '../../../../../modules/shared/models/msg-model';
@Component({
  selector: 'ispl-ca-di-view-details',
  templateUrl: 'ca-di-view-details.component.html',
  styleUrls: ['ca-di-view-details.component.css']

})
export class CADIViewDetailsComponent implements OnInit {

  public caDIAddEditFormGroup: FormGroup;
  public title: string = "CA";//to show titlee on html page
  public routeParam: any ={
    complaintReferenceNo:'',//to get complaint reference no from route param
    complaintStatus:  ''//to fetch complaint status from route
  }; 
  public rejectLabelJson: any = {};//to store all reject label
  public caRejectReason: string = "";//to store rca reject label
  public caReportTable: any[] = [];//to store prev rca report
  public caDetails: any[] = [];//to store complain reference detailS
  public caIndex: number = 0;
  public fileDetails: any[] = [];//to store file details
  public busySpinner: boolean = true;//spinner
  //for error msg
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };
  public rejectFlag: boolean = false;//reject flag

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private datePipe: DatePipe,//for date
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService,
    private localStorageService: LocalStorageService
  ) {
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of CADIViewDetailsComponent..");
    this.initform();
    this.getRouteParam();//to get route param 
    this.caReportTable = new CADIConfigModel().caReportHeader;//getting prev report details
    this.rejectLabelJson = new MsgConfigModel().rejectMsgJson;
    this.getviewComplainReferenceDetailsWSCall();//service call
  }//end of on init

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';    
    });
    console.log("complaintReferenceNo for ca di view: ", this.routeParam.complaintReferenceNo);
    console.log("this.complaintStatus for ca di view::",this.routeParam.complaintStatus);
    this.caDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);
  }//end of method
  
  /**
   * @description initform data
   */
  initform() {
    this.caDIAddEditFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      caAddEditDate: new FormControl(''),
      caAddEditDetails: new FormControl(''),
      caARejectDetails: new FormControl('')
    });
  }//end of init form
//method to get complain det by comp ref no
private getviewComplainReferenceDetailsWSCall() {
  let pageCompStatus: number = 60;
  this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, pageCompStatus).
    subscribe(res => {
      console.log("res of ref det::::", res);
      if (res.msgType === 'Info') {
        let json: any = JSON.parse(res.mapDetails);
        console.log("json::::", json);
        this.caDetails = json;
        this.caIndex = this.caDetails ? this.caDetails.length - 1 : 0;
        this.setResValToForm();
        let complainDetailsAutoId: number = this.caDetails[this.caIndex].complaintDetailsAutoId;
        this.getFileWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
        // this.busySpinner = false;
      } else {
        this.errorMsgObj.errMsgShowFlag = true;
        this.errorMsgObj.errorMsg = res.msg;
        this.busySpinner = false;
      }
    },
      err => {
        console.log(err);
        this.errorMsgObj.errMsgShowFlag = true;
        this.errorMsgObj.errorMsg = err.msg;
        this.busySpinner = false;
        this.sessionErrorService.routeToLogin(err._body);
      });
}//end of method

//method to set res value to form
private setResValToForm() {
  let caFormData: any = this.caDetails[this.caIndex];
  this.caDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(caFormData.complaintReferenceNo);
  this.caDIAddEditFormGroup.controls['caAddEditDate'].setValue(this.datePipe.transform(caFormData.correctiveActionDate, 'dd-MMM-yyyy'));
  this.caDIAddEditFormGroup.controls['caAddEditDetails'].setValue(caFormData.correctiveAction);
  if (caFormData.caCancelRemarks) {
    this.caRejectReason = caFormData.caCancelRemarks;//set the reject reason
  } else {
    this.caRejectReason = "";
  }
}//end of method 

 //method to get file
 private getFileWSCall(complaintReferenceNo: string, pageActivityId: number, complainDetailsAutoId: number) {
  this.complaintDIService.viewFile(complaintReferenceNo, pageActivityId, complainDetailsAutoId).
    subscribe(res => {
      console.log("res of file det::::", res);
      if (res.msgType === 'Info') {
        let json: any = JSON.parse(res.mapDetails);
        console.log("json::::", json);
        this.fileDetails = json;
        console.log("File details::::", this.fileDetails);
        this.busySpinner = false;
      } else {
        this.busySpinner = false;
        this.fileDetails = [];
      }
    },
      err => {
        console.log(err);
        this.fileDetails = [];
        this.busySpinner = false;
        this.sessionErrorService.routeToLogin(err._body);
      });
}//end of method to get file


//for clicking cancel button this method will be invoked
public onCancel(): void {
  this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
}// end of onCancel method

public selectData(cmpIndex: number) {
  let pageCompStatus: number = 60;
  this.busySpinner = true;
  this.caIndex = cmpIndex;
  this.setResValToForm();
  let complainDetailsAutoId: number = this.caDetails[this.caIndex].complaintDetailsAutoId;
  this.getFileWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
  // setTimeout(() => {
  //   this.busySpinner = false;
  // }, 300);
}

//method to delete error msg
public deleteResErrorMsgOnClick() {
  this.errorMsgObj.errMsgShowFlag = false;
  this.errorMsgObj.errorMsg = "";
}//end of method delete error msg

//reject click
public onClickRejectBtn() {
  this.rejectFlag = true;
}//end of method


//methhod to submit reject reason
public onRejectSubmit() {
  this.busySpinner = true;//load spinner
  let date = new Date();
  let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
  let rejectHeaderJson: any = {};
  let rejectDetailJson: any = {};
  let plantType: string = this.localStorageService.user.plantType;
  let action: string = "";
  rejectHeaderJson.lastActivityId = 50;
  rejectHeaderJson.userId = this.localStorageService.user.userId;
  rejectHeaderJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
  rejectHeaderJson.caCancelFlag = "Y";
  let complainDetailsAutoId: string = this.caDetails[this.caIndex].complaintDetailsAutoId;//to get auto id
  rejectDetailJson.activityId = 60;
  rejectDetailJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
  rejectDetailJson.userId = this.localStorageService.user.userId;
  rejectDetailJson.caCancelRemarks = this.caDIAddEditFormGroup.value.caARejectDetails;
  rejectDetailJson.caCancelDate = currentDate;
  rejectDetailJson.complaintDetailsAutoId = parseInt(complainDetailsAutoId);

  console.log("rejectHeaderJson", rejectHeaderJson);
  console.log("rejectDetailJson", rejectDetailJson);
  this.complaintDIService.putHeader(rejectHeaderJson, plantType, action).
    subscribe(res => {
      console.log("res success msg", res.msg);
    }, err => {
      console.log(err);
    });
  action = "ca_cancel";
  this.complaintDIService.postDetail(rejectDetailJson, plantType, action).
    subscribe(res => {
      console.log("res success msg", res.msg);
      this.busySpinner = false;
      this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
    }, err => {
      console.log(err);
      this.busySpinner = false;
    });
}//end of method


}//end of class