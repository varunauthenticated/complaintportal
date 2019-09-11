import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { PADIConfigModel } from '../../models/pa-di-config.model';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
import { MsgConfigModel } from '../../../../../modules/shared/models/msg-model';
import { DISABLED } from '@angular/forms/src/model';

@Component({
  selector: 'ispl-pa-di-view-details',
  templateUrl: 'pa-di-view-details.component.html',
  styleUrls: ['pa-di-view-details.component.css']

})
export class PADIViewDetailsComponent implements OnInit {

  // public fileList: FileList;
  public title: string = "PA";//to show titlee on html page
  public paDIAddEditFormGroup: FormGroup;
  public routeParam: any ={
    complaintReferenceNo:'',//to get complaint reference no from route param
    complaintStatus:  ''//to fetch complaint status from route
  }; 
  public rejectLabelJson: any = {};//to store all reject label
  public paRejectReason: string = "";//to store rca reject label
  public paReportTable: any[] = [];//to store prev rca report
  public paDetails: any[] = [];//to store complain reference detailS
  public paIndex: number = 0;
  public fileDetails: any[] = [];//to store file details
  //for busy spinner
  public busySpinner: boolean = true;
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
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService
  ) {
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of PADIViewDetailsComponent..");
    this.initform();
    this.getRouteParam();//to get route param 
    this.paReportTable = new PADIConfigModel().paReportHeader;//getting prev inv report details
    this.rejectLabelJson = new MsgConfigModel().rejectMsgJson;
    this.getviewComplainReferenceDetailsWSCall();//service call
  }//end of on init

   //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : 'DI000009';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : ''; 
    });
    console.log("complaintReferenceNo for pa di view: ", this.routeParam.complaintReferenceNo);
    console.log("this.complaintStatus for pa di view::",this.routeParam.complaintStatus);
    this.paDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);

  }//end of method

  /**
   * @description initform data
   */
  initform() {
    this.paDIAddEditFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      paAddEditDate: new FormControl(''),
      paAddEditDetails: new FormControl(''),
      techCloserDate: new FormControl(''),
      closerremarks: new FormControl(''),
      paARejectDetails: new FormControl('')
    });
  }//end of init form
//method to get complain det by comp ref no
private getviewComplainReferenceDetailsWSCall() {
  let pageCompStatus: number = 70;
  this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, pageCompStatus).
    subscribe(res => {
      console.log("res of ref det::::", res);
      if (res.msgType === 'Info') {
        let json: any = JSON.parse(res.mapDetails);
        console.log("json::::", json);
        this.paDetails = json;
        this.paIndex = this.paDetails ? this.paDetails.length - 1 : 0;
        this.setResValToForm();
        let complainDetailsAutoId: number = this.paDetails[this.paIndex].complaintDetailsAutoId;
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
  let paFormData: any = this.paDetails[this.paIndex];
  this.paDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(paFormData.complaintReferenceNo);
  this.paDIAddEditFormGroup.controls['paAddEditDate'].setValue(this.datePipe.transform(paFormData.preventiveActionDate, 'dd-MMM-yyyy'));
  this.paDIAddEditFormGroup.controls['paAddEditDetails'].setValue(paFormData.preventiveAction);
  this.paDIAddEditFormGroup.controls['techCloserDate'].setValue(this.datePipe.transform(paFormData.closeDateAtTmlEnd, 'dd-MMM-yyyy'));
  this.paDIAddEditFormGroup.controls['closerremarks'].setValue(paFormData.closeRemarksAtTmlEnd);
  
  if (paFormData.paCancelRemarks) {
    this.paRejectReason = paFormData.paCancelRemarks;//set the reject reason
  } else {
    this.paRejectReason = "";
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
  let pageCompStatus: number = 70;
  this.busySpinner = true;
  this.paIndex = cmpIndex;
  this.setResValToForm();
  let complainDetailsAutoId: number = this.paDetails[this.paIndex].complaintDetailsAutoId;
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
  rejectHeaderJson.lastActivityId = 60;
  rejectHeaderJson.userId = this.localStorageService.user.userId;
  rejectHeaderJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
  rejectHeaderJson.paCancelFlag = "Y";
  let complainDetailsAutoId: string = this.paDetails[this.paIndex].complaintDetailsAutoId;//to get auto id
  rejectDetailJson.activityId = 70;
  rejectDetailJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
  rejectDetailJson.userId = this.localStorageService.user.userId;
  rejectDetailJson.paCancelRemarks = this.paDIAddEditFormGroup.value.paARejectDetails;
  rejectDetailJson.paCancelDate = currentDate;
  rejectDetailJson.complaintDetailsAutoId = parseInt(complainDetailsAutoId);

  console.log("rejectHeaderJson", rejectHeaderJson);
  console.log("rejectDetailJson", rejectDetailJson);
  this.complaintDIService.putHeader(rejectHeaderJson, plantType, action).
    subscribe(res => {
      console.log("res success msg", res.msg);
    }, err => {
      console.log(err);
    });
  action = "pa_cancel";
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