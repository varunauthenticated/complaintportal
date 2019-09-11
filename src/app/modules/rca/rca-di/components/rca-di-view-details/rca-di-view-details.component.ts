import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { RCADIConfigModel } from '../../models/rca-di-config.model';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
import { MsgConfigModel } from '../../../../../modules/shared/models/msg-model';
@Component({
  selector: 'ispl-rca-di-view-details',
  templateUrl: 'rca-di-view-details.component.html',
  styleUrls: ['rca-di-view-details.component.css']

})
export class RCADIViewDetailsComponent implements OnInit {

  // public fileList: FileList;
  public title: string = "RCA";//to show titlee on html page
  public rcaDIAddEditFormGroup: FormGroup;
  public rejectLabelJson: any = {};//to store all reject label
  public rcaRejectReason: string = "";//to store rca reject label
  public routeParam: any = {
    complaintReferenceNo: '',//to get complaint reference no from route param
    complaintStatus: ''//to fetch complaint status from route
  };
  public rcaReportTable: any[] = [];//to store prev rca report
  public rcaDetails: any[] = [];//to store complain reference detailS
  public rcaIndex: number = 0;
  public fileDetails: any[] = [];//to store file details
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
    private complaintDIService: ComplaintDIService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
  ) {

  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of RCADIViewDetailsComponent..");
    this.initform();
    this.getRouteParam();//to get route param 
    this.rcaReportTable = new RCADIConfigModel().rcaReportHeader;//getting prev inv report details
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
    console.log("complaintReferenceNo for rca di view: ", this.routeParam.complaintReferenceNo);
    console.log("this.complaintStatus for pa di view::", this.routeParam.complaintStatus);
    this.rcaDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);
  }//end of method

  /**
   * @description initform data
   */
  initform() {
    this.rcaDIAddEditFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      rcaAddEditDate: new FormControl(''),
      rcaAddEditDetails: new FormControl(''),
      rcaARejectDetails: new FormControl('')
    });
  }//end of init form
  //method to get complain det by comp ref no
  private getviewComplainReferenceDetailsWSCall() {
    let pageCompStatus: number = 50;
    this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, pageCompStatus).
      subscribe(res => {
        console.log("res of ref det::::", res);
        if (res.msgType === 'Info') {
          let json: any = JSON.parse(res.mapDetails);
          console.log("json::::", json);
          this.rcaDetails = json;
          this.rcaIndex = this.rcaDetails ? this.rcaDetails.length - 1 : 0;
          this.setResValToForm();
          let complainDetailsAutoId: number = this.rcaDetails[this.rcaIndex].complaintDetailsAutoId;
          this.getFileWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
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
    let rcaFormData: any = this.rcaDetails[this.rcaIndex];
    this.rcaDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(rcaFormData.complaintReferenceNo);
    this.rcaDIAddEditFormGroup.controls['rcaAddEditDate'].setValue(this.datePipe.transform(rcaFormData.rootCauseAnanysisDate, 'dd-MMM-yyyy'));
    this.rcaDIAddEditFormGroup.controls['rcaAddEditDetails'].setValue(rcaFormData.rootCauseAnanysisRemarks);
    if (rcaFormData.rcaCancelRemarks) {
      this.rcaRejectReason = rcaFormData.rcaCancelRemarks;//set the reject reason
    } else {
      this.rcaRejectReason = "";
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
    let pageCompStatus: number = 50;
    this.busySpinner = true;
    this.rcaIndex = cmpIndex;
    this.setResValToForm();
    let complainDetailsAutoId: number = this.rcaDetails[this.rcaIndex].complaintDetailsAutoId;
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
    rejectHeaderJson.lastActivityId = 40;
    rejectHeaderJson.userId = this.localStorageService.user.userId;
    rejectHeaderJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
    rejectHeaderJson.rcaCancelFlag = "Y";
    let complainDetailsAutoId: string = this.rcaDetails[this.rcaIndex].complaintDetailsAutoId;//to get auto id
    rejectDetailJson.activityId = 50;
    rejectDetailJson.complaintReferenceNo = this.routeParam.complaintReferenceNo;
    rejectDetailJson.userId = this.localStorageService.user.userId;
    rejectDetailJson.rcaCancelRemarks = this.rcaDIAddEditFormGroup.value.rcaARejectDetails;
    rejectDetailJson.rcaCancelDate = currentDate;
    rejectDetailJson.complaintDetailsAutoId = parseInt(complainDetailsAutoId);

    console.log("rejectHeaderJson", rejectHeaderJson);
    console.log("rejectDetailJson", rejectDetailJson);
    this.complaintDIService.putHeader(rejectHeaderJson, plantType, action).
      subscribe(res => {
        console.log("res success msg", res.msg);
      }, err => {
        console.log(err);
      });
    action = "rca_cancel";
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