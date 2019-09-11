import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SessionErrorService } from '../../../../shared/services/session-error.service';
import { CloseDIConfigModel } from '../../models/close-di-config.model';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';

@Component({
  selector: 'ispl-close-complain-di-view-details',
  templateUrl: 'close-complain-di-view-details.component.html',
  styleUrls: ['close-complain-di-view-details.component.css']

})
export class CloseComplainDIViewDetailsComponent {
  
  public title: string = 'Close Complaint';
  public closeComplainDIFormGroup: FormGroup;
  public routeParam: any ={
    complaintReferenceNo:'',//to get complaint reference no from route param
    complaintStatus:  ''//to fetch complaint status from route
  }; 
  public closeReportTable: any[] = [];//to store prev rca report
  public closeDetails: any[] = [];//to store complain reference detailS
  public fileDetails: any[] = [];//to store file details
  public closeIndex: number = 0;
  public busySpinner: boolean = true;//spinner
  //for error msg
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };
  public prevCompDetShowFlag: boolean = false;//a flag to show previous complain det

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,   
    private datePipe: DatePipe,//for date
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService
  ) { 

  }

  ngOnInit(): void {
    this.initform();
    this.getRouteParam();//to get route param 
    this.closeReportTable = new CloseDIConfigModel().closeReportHeader;//getting prev report details
    this.getviewComplainReferenceDetailsWSCall();//service call
  }//end of onInit

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : ''; 
    });
    console.log('complaintReferenceNo for complain close di view: ', this.routeParam.complaintReferenceNo);
  }//end of method
   
  /**
   * @description initform data
   */
  initform() {
    this.closeComplainDIFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      closeDate: new FormControl(''),
      acknoledgementReceived: new FormControl({value:'N',disabled: true}),
      remarks: new FormControl('')
    });
  }//end of init form
//method to get complain det by comp ref no
private getviewComplainReferenceDetailsWSCall() {
  let pageCompStatus: number = 80;
  this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, pageCompStatus).
    subscribe(res => {
      console.log("res of ref det::::", res);
      if (res.msgType === 'Info') {
        let json: any = JSON.parse(res.mapDetails);
        console.log("json::::", json);
        this.closeDetails = json;
        this.closeIndex = this.closeDetails ? this.closeDetails.length - 1 : 0;
        this.setResValToForm();
        let complainDetailsAutoId: number = this.closeDetails[this.closeIndex].complaintDetailsAutoId;
        this.getFileWSCall(this.routeParam.complaintReferenceNo, pageCompStatus ,complainDetailsAutoId);//to get file
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
  let closeFormData: any = this.closeDetails[this.closeIndex];
  this.closeComplainDIFormGroup.controls['complaintReferenceNo'].setValue(closeFormData.complaintReferenceNo);
  this.closeComplainDIFormGroup.controls['closeDate'].setValue(this.datePipe.transform(closeFormData.closeDate, 'dd-MMM-yyyy'));
  this.closeComplainDIFormGroup.controls['acknoledgementReceived'].setValue(closeFormData.acknoledgementReceived);
  this.closeComplainDIFormGroup.controls['remarks'].setValue(closeFormData.closeRemarks);
}//end of method 

//method to get file
private getFileWSCall(complaintReferenceNo: string, pageActivityId: number, complainDetailsAutoId: number) {
  this.complaintDIService.viewFile(complaintReferenceNo, pageActivityId,complainDetailsAutoId).
  subscribe(res => {
    console.log("res of file det::::", res);
    if (res.msgType === 'Info') {
      let json: any = JSON.parse(res.mapDetails);
      console.log("json::::", json);
      this.fileDetails = json;
      console.log("File details::::",this.fileDetails);
      this.busySpinner = false;
    }else{
      this.fileDetails = [];
      this.busySpinner = false;
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
  this.busySpinner = true;
  this.closeIndex = cmpIndex;
  this.setResValToForm();
  setTimeout(() => {
    this.busySpinner = false;
  }, 300);
}

//method to delete error msg
public deleteResErrorMsgOnClick() {
  this.errorMsgObj.errMsgShowFlag = false;
  this.errorMsgObj.errorMsg = "";
}//end of method delete error msg


}//end of class
