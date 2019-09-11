import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import 'rxjs/add/observable/forkJoin';//new add for forkjoin
import { Subscription } from 'rxjs/Subscription';//to get route param
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { DatePipe } from '@angular/common';
import { SessionErrorService } from "../../../shared/services/session-error.service";
import { InvestigationReportDIConfigModel } from '../../models/investigation-report-di-config.model';
import { ComplaintDIService } from '../../../shared/services/complaint-di.service';
import { InvestigationDataModel } from '../../models/investigation-data-model';

@Component({
  selector: 'ispl-investigation-report-di-view-details-form',
  templateUrl: 'investigation-report-di-view-details.component.html',
  // templateUrl: 'test.html',
  styleUrls: ['investigation-report-di-view-details.component.css']
})
export class InvestigationReportDiViewDetailsComponent implements OnInit {

  public title: string = 'Investigation Report';
  //creating a FormGroup for Investigation Report
  public invReportFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint ref no from html and send it as a parameter
  //variable used for radio button
  public invReportVar: any = { siteVisitMadeValue: '', sampleCollectedValue: '' };
  public invReportTable: any[] = [];//to store prev inv report
  public itemGridTable: any[] = [];//to store item grid
  public complaintStatus: number;//to fetch complaint status from route
  public invReportDetails: any[] = [];// to store invReport deatils from response
  public invReportIndex: number = 0;
  public invItemDetails: any[] = [];// to store inv item deatils from response
  public fileDetails: any[] = [];//to store file details 
  public selectedIvtReportDataList: any = { unloadingEquipment: [], lubricantUsedDesc: [], layingPositionDesc: [], jointingTypeDesc: [] };
  public ivtReportDataList: any = { unloadingEquipmentList: '', lubricantUsedList: '', layingPositionList: '', jointingTypeList: '' };
  //busySpinner 
  public busySpinner: boolean = true;
  //for error msg
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };
  public rejectFlag: boolean = false;//reject flag
  public invRejectReason: string = '';//taking a var to show reject reason

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService,
    private localstorageService: LocalStorageService,
    private datePipe: DatePipe//for date
  ) {
    // this.buildForm();
  }

  ngOnInit(): void {
    // this.busySpinner = true;
    this.initform();
    this.getRouteParam();
    this.invReportTable = new InvestigationReportDIConfigModel().prevInvReportHeader;
    this.itemGridTable = new InvestigationReportDIConfigModel().invItemGridHeader;
    this.ivtReportDataList.unloadingEquipmentList = new InvestigationDataModel().unloadingEquipmentList;
    this.ivtReportDataList.lubricantUsedList = new InvestigationDataModel().lubricantUsedList;
    this.ivtReportDataList.layingPositionList = new InvestigationDataModel().layingPositionList;
    this.ivtReportDataList.jointingTypeList = new InvestigationDataModel().jointingTypeList;
    this.getInvestigationViewDetailsWSCall();
  }//end of onInit

  //start method getRouteParam to get route parameter
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    console.log("complaintReferenceNo for view in preliminary-investigation-di-add-component: ", this.complaintReferenceNo);
  }//end of the method

  /**
  * @description initform data
  */
  initform() {
    this.invReportFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      siteVisitMade: new FormControl({ value: 'N', disabled: true }),
      siteVisitDate: new FormControl(''),
      sampleCollected: new FormControl({ value: 'N', disabled: true }),
      sampleCollectedDate: new FormControl(''),
      investigationReportFromDate: new FormControl(''),
      investigationReportToDate: new FormControl(''),
      complaintAccepted: new FormControl({ value: 'N', disabled: true }),
      invReportRemarks: new FormControl('')
    });
  }//end of initform

  //method to get investigation report details by service call
  private getInvestigationViewDetailsWSCall() {
    let pageCompStatus: number = 40;
    this.complaintDIService.getComplainViewDetails(this.complaintReferenceNo, pageCompStatus).
      subscribe(res => {
        //console.log("res of ref det::::",res);
        if (res.msgType === "Info") {
          let invReportDetailsJson: any = JSON.parse(res.mapDetails);
          this.invReportDetails = invReportDetailsJson;
          console.log("res of inv Report Deatils::::", this.invReportDetails);
          this.invReportIndex = this.invReportDetails ? this.invReportDetails.length - 1 : 0;
          this.setFormValue();
          let complainDetailsAutoId: number = this.invReportDetails[this.invReportIndex].complaintDetailsAutoId;
          this.getInvoiceItemDetailWSCall(this.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//inv item details
          this.getFileWSCall(this.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
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

  //start method setFormValue to set the value in invreport form
  private setFormValue() {
    let formData: any = this.invReportDetails[this.invReportIndex];
    this.invReportFormGroup.controls['complaintReferenceNo'].setValue(formData.complaintReferenceNo);
    this.invReportVar.siteVisitMadeValue = formData.siteVisitMade;
    this.invReportFormGroup.controls['siteVisitMade'].setValue(formData.siteVisitMade);
    this.invReportFormGroup.controls['siteVisitDate'].setValue(this.datePipe.transform(formData.siteVisitMadeDate, 'dd-MMM-yyyy'));
    this.invReportVar.sampleCollectedValue = formData.sampleCollected;
    this.invReportFormGroup.controls['sampleCollected'].setValue(formData.sampleCollected);
    this.invReportFormGroup.controls['sampleCollectedDate'].setValue(this.datePipe.transform(formData.sampleCollectedDate, 'dd-MMM-yyyy'));
    this.invReportFormGroup.controls['investigationReportFromDate'].setValue(this.datePipe.transform(formData.investigationReportFromDate, 'dd-MMM-yyyy'));
    this.invReportFormGroup.controls['investigationReportToDate'].setValue(this.datePipe.transform(formData.investigationReportDate, 'dd-MMM-yyyy'));
    this.invReportFormGroup.controls['invReportRemarks'].setValue(formData.investigationReportRemarks);
    let unloadingEquipment: string = "[" + formData.unloadingEquipement + "]";
    let unloadingEquipmentKey: any[] = JSON.parse(unloadingEquipment);
    this.selectedIvtReportDataList.unloadingEquipmentDesc = this.getSelectedCheckedItemVal(this.ivtReportDataList.unloadingEquipmentList, unloadingEquipmentKey);

    let lubricantUsed: string = "[" + formData.lubricantUsed + "]";
    let lubricantUsedKey: any[] = JSON.parse(lubricantUsed);
    this.selectedIvtReportDataList.lubricantUsedDesc = this.getSelectedCheckedItemVal(this.ivtReportDataList.lubricantUsedList, lubricantUsedKey);

    let layingPosition: string = "[" + formData.layingPosition + "]";
    let layingPositionKey: any[] = JSON.parse(layingPosition);
    this.selectedIvtReportDataList.layingPositionDesc = this.getSelectedCheckedItemVal(this.ivtReportDataList.layingPositionList, layingPositionKey);

    let jointingType: string = "[" + formData.jointingType + "]";
    let jointingTypeKey: any[] = JSON.parse(jointingType);
    this.selectedIvtReportDataList.jointingTypeDesc = this.getSelectedCheckedItemVal(this.ivtReportDataList.jointingTypeList, jointingTypeKey);
    this.invReportFormGroup.controls['complaintAccepted'].setValue(formData.complaintAccepted);
    if (formData.investigationReportCancelRemarks) {
      this.invRejectReason = formData.investigationReportCancelRemarks;//set the reject reason
    } else {
      this.invRejectReason = "";
    }
  }//end method setFormValue

  //start method to rearrange selected checkbox desc
  private getSelectedCheckedItemVal(keyValueArr: any[], selectedKeyArr: any[]): any[] {
    let selectedValueArr: any[] = [];
    keyValueArr.forEach(kVEl => {
      selectedKeyArr.forEach(selKeyEl => {
        if (selKeyEl == kVEl.id) {
          selectedValueArr.push(kVEl.desc);
        }//end of if
      });
    });
    return selectedValueArr;
  }//end of the method of getSelectedCheckedItemVal

  //start method selectData
  public selectData(invRepIndex: number) {
    let pageCompStatus: number = 40;
    this.busySpinner = true;
    this.invReportIndex = invRepIndex;
    this.setFormValue();
    let complainDetailsAutoId: number = this.invReportDetails[this.invReportIndex].complaintDetailsAutoId;
    this.getInvoiceItemDetailWSCall(this.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//inv item details
    this.getFileWSCall(this.complaintReferenceNo, pageCompStatus, complainDetailsAutoId);//to get file
  }//end method of selectDatas

  //reject click
  public onClickRejectBtn() {
    this.rejectFlag = true;
  }//end of method
  //methhod to submit reject reason
  public onRejectSubmit(rejectReasonVal) {
    this.busySpinner = true;//load spinner
    let date = new Date();
    let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    let rejectHeaderJson: any = {};
    let rejectDetailJson: any = {};
    let plantType: string = this.localstorageService.user.plantType;
    let action: string = "";
    rejectHeaderJson.lastActivityId = 10;
    rejectHeaderJson.userId = this.localstorageService.user.userId;
    rejectHeaderJson.complaintReferenceNo = this.complaintReferenceNo;
    // rejectHeaderJson.investigationReportCancelFlag" : "Y"
    let complainDetailsAutoId: string = this.invReportDetails[this.invReportIndex].complaintDetailsAutoId;//to get auto id
    rejectDetailJson.activityId = 40;
    rejectDetailJson.complaintReferenceNo = this.complaintReferenceNo;
    rejectDetailJson.userId = this.localstorageService.user.userId;
    rejectDetailJson.investigationReportCancelRemarks = rejectReasonVal;
    rejectDetailJson.investigationReportCancelDate = currentDate;
    rejectDetailJson.complaintDetailsAutoId = parseInt(complainDetailsAutoId);

    console.log("rejectHeaderJson", rejectHeaderJson);
    console.log("rejectDetailJson", rejectDetailJson);
    this.complaintDIService.putHeader(rejectHeaderJson, plantType, action).
      subscribe(res => {
        console.log("res success msg", res.msg);
      }, err => {
        console.log(err);
      });
    action = "inv_cancel";
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

  //cancel method
  public onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
  }//end of cancel method


}//end of class