/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ComplaintDIConfigModel } from '../../models/complain-di-config.model';
import { ComplaintDIRegisterDataService } from "../../services/complaint-di-register-data.service";
import { SessionErrorService } from '../../../../shared/services/session-error.service';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';


@Component({
  selector: 'ispl-complain-di-view-details-form',
  templateUrl: 'complain-di-view-details.component.html',
  styleUrls: ['complain-di-view-details.component.css']
})
export class ComplainDIViewDetailsComponent implements OnInit {


  public title: string = "Complaint Register";
  //variable used for siteVisit radio button
  public siteVisitValue: string = "";
  //create a formgroup for complain reg
  complaintRegisterFormGroup: FormGroup;
  public routeParam: any = {
    complaintReferenceNo: '',//to get complaint reference no from route param
    complaintStatus: ''//to fetch complaint status from route
  };
  public prevComplainReportTable: any[] = [];//to store prev complain report
  public itemGridTable: any[] = [];//to store item grid
  public complainDetails: any[] = [];//to store complain reference detailS
  public fileDetails: any[] = [];//to store file details 
  public invItemDetails: any[] = [];// to store inv item deatils from response

  public complainIndex: number = 0;
  public busySpinner: boolean = true;
  //for error msg
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private datePipe: DatePipe,//for date
    private formBuilder: FormBuilder,
    private complaintDIService: ComplaintDIService,
    private complaintDIRegisterDataService: ComplaintDIRegisterDataService,
    private sessionErrorService: SessionErrorService
  ) {
    // this.buildForm();//to build form
  }

  ngOnInit(): void {
    // this.busySpinner = true;
    this.initform();
    this.getRouteParam();//to get route param 
    this.prevComplainReportTable = new ComplaintDIConfigModel().prevComplainHeader;//getting prev inv report details
    this.itemGridTable = new ComplaintDIConfigModel().itemGridHeader;
    this.getviewComplainReferenceDetailsWSCall();//service call
  }
  //end of on init

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    // console.log("complaintReferenceNo for view Complaint di: ", this.complaintReferenceNo);
  }//end of method
  /**
   * @description initform data
   */
  initform() {
    this.complaintRegisterFormGroup = new FormGroup({
      modeId: new FormControl(''),
      officialDocNo: new FormControl(''),
      complaintReferenceDt: new FormControl(''),
      custCode: new FormControl(''),
      custName: new FormControl(''),
      salesGroup: new FormControl(''),
      salesOffice: new FormControl(''),
      contactPersonName: new FormControl(''),
      contactPersonPhoneNo: new FormControl(''),
      contactPersonEmailId: new FormControl(''),
      loggedBy: new FormControl(''),
      loggedOnDt: new FormControl(''),
      complaintTypeId: new FormControl(''),
      natureOfComplaintId: new FormControl(''),
      complaintDetails: new FormControl(''),
      siteVisit: new FormControl({ value: 'N', disabled: true }),
      siteVisitByDepartmentName: new FormControl('')
    });
  }//end of method
  //method to get complain reference details by service 
  private getviewComplainReferenceDetailsWSCall() {
    let pageCompStatus: number = 10;
    this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, pageCompStatus).
      subscribe(res => {
        console.log("res of ref det::::", res);
        if (res.msgType === 'Info') {
          let json: any = JSON.parse(res.mapDetails);
          console.log("json::::", json);
          this.complainDetails = json;
          this.complainIndex = this.complainDetails ? this.complainDetails.length - 1 : 0;
          this.setResValToForm();
          let complainDetailsAutoId: number = this.complainDetails[this.complainIndex].complaintDetailsAutoId;
          this.getInvoiceItemDetailWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//inv item details
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
          this.busySpinner = false;
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = err.msg;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end of method

  //start method getInvoiceItemDetailWSCall to get item details
  private getInvoiceItemDetailWSCall(complaintReferenceNo: string, pageActivityId: number, complainDetailsAutoId: number) {
    this.busySpinner = true;
    this.complaintDIService.getInvoiceItemDetail(complaintReferenceNo, pageActivityId, complainDetailsAutoId).
      subscribe(res => {
        if (res.msgType === "Info") {
          let invItemDeatilsJson: any = JSON.parse(res.mapDetails);
          this.invItemDetails = invItemDeatilsJson;
          // this.busySpinner = false;
          console.log("item details =========.........>>>>>>>>>", this.invItemDetails);
        }//end of if
      },
        err => {
          console.log(err);
          // this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end method of getInvoiceItemDetailWSCall

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

  //method to set res value to form
  private setResValToForm() {
    let complainFormData: any = this.complainDetails[this.complainIndex];
    this.complaintRegisterFormGroup.controls['modeId'].setValue(complainFormData.modeDesc);
    this.complaintRegisterFormGroup.controls['complaintReferenceDt'].setValue(this.datePipe.transform(complainFormData.complaintReferenceDt, 'dd-MMM-yyyy'));
    this.complaintRegisterFormGroup.controls['custCode'].setValue(complainFormData.custCode);
    this.complaintRegisterFormGroup.controls['custName'].setValue(complainFormData.customerName);
    this.complaintRegisterFormGroup.controls['salesGroup'].setValue(complainFormData.salesGroup);
    this.complaintRegisterFormGroup.controls['salesOffice'].setValue(complainFormData.salesOffice);
    this.complaintRegisterFormGroup.controls['contactPersonName'].setValue(complainFormData.contactPersonName);
    this.complaintRegisterFormGroup.controls['contactPersonPhoneNo'].setValue(complainFormData.contactPersonPhoneNo);
    this.complaintRegisterFormGroup.controls['contactPersonEmailId'].setValue(complainFormData.contactPersonEmailId);
    this.complaintRegisterFormGroup.controls['loggedBy'].setValue(complainFormData.loggedByName);
    this.complaintRegisterFormGroup.controls['loggedOnDt'].setValue(this.datePipe.transform(complainFormData.loggedOnDt, 'dd-MMM-yyyy'));
    let categoryDesc: string = complainFormData.categoryDesc.trim() ? '('+complainFormData.categoryDesc+')': '';
    this.complaintRegisterFormGroup.controls['complaintTypeId'].setValue(complainFormData.complaintTypeDesc + categoryDesc);
    this.complaintRegisterFormGroup.controls['natureOfComplaintId'].setValue(complainFormData.natureOfComplaintDesc);
    this.complaintRegisterFormGroup.controls['complaintDetails'].setValue(complainFormData.complaintDetails);
    this.siteVisitValue = complainFormData.siteVisit;
    this.complaintRegisterFormGroup.controls['siteVisit'].setValue(complainFormData.siteVisit);
    this.complaintRegisterFormGroup.controls['siteVisitByDepartmentName'].setValue(complainFormData.siteVisitByDepartmentName);
    //console.log('got the value',this.complaintRegisterFormGroup.value.siteVisit);
  }//end of method 

  public selectData(cmpIndex: number) {
    let pageCompStatus: number = 10;
    this.busySpinner = true;
    this.complainIndex = cmpIndex;
    this.setResValToForm();
    let complainDetailsAutoId: number = this.complainDetails[this.complainIndex].complaintDetailsAutoId;
    this.getInvoiceItemDetailWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//inv item details
    this.getFileWSCall(this.routeParam.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
    // setTimeout(() => {
    //   this.busySpinner = false;
    // }, 500);
  }//end of method

  //method to delete error msg
  public deleteResErrorMsgOnClick() {
    this.errorMsgObj.errMsgShowFlag = false;
    this.errorMsgObj.errorMsg = "";
  }//end of method delete error msg

  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
  }// end of onCancel method

}//end of class
