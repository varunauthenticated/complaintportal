import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ComplaintDIService } from '../../../shared/services/complaint-di.service';
import { NgbdModalComponent } from '../../../widget/modal/components/modal-component';
import { DatePipe } from '@angular/common';
import { SessionErrorService } from '../../../shared/services/session-error.service';
import { InvestigationReportDIConfigModel } from '../../models/investigation-report-di-config.model';
import { InvestigationDataModel } from '../../models/investigation-data-model';
import { InvestigationReportDIDataService } from "../../services/investigation-report-di.service";

@Component({
  selector: 'ispl-investigation-report-di-add-form',
  templateUrl: 'investigation-report-di-add.component.html',
  // templateUrl: 'test.html',
  styleUrls: ['investigation-report-di-add.component.css']
})
export class InvestigationReportDiComponent implements OnInit {
  @ViewChild('fileInput')
  fileInputVariable: any;
  // form data for file upload
  private totalFileSize: number = 0;//file upload
  private fileSizeLimit: number = 104857600;
  private formData: FormData = new FormData();
  private fileData: FormData;
  
  private unloadingEquipmentList: any[] = [];
  private lubricantUsedList: any[] = [];
  private layingPositionList: any[] = [];
  private jointingTypeList: any[] = [];
  //activity Id for complain register
  private plantType: string = this.localStorageService.user.plantType;
  private activityId: number = 40;
  private selectedInvItemDetailsObj: any = {};//selected inv item det object 
  public fileList: FileList;
  public title: string = 'Add Investigation Report';//set the title;
  public invReportTable: any[] = [];//to store prev inv report
  public itemGridTable: any[] = [];//to store item grid
  public complaintStatus: number;//to fetch complaint status from route
  public invReportDetails: any[] = [];// to store invReport deatils from response
  public invItemDetails: any[] = [];// to store inv item deatils from response
  public selectedInvItemDetails: any[] = [];// to store inv item deatils from response
  public invReportIndex: number = 0;
  public ivtReportDataList: any = { unloadingEquipmentList: '', lubricantUsedList: '', layingPositionList: '', jointingTypeList: '' };
  //new add
  public complaintTypeDropDownList: any[] = [];
  public natureOfComDropDownList: any = [];
  //end of new add
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };
   // for checking fromDate and toDate error
   public fromDateErr: boolean = false;
   public toDateErr: boolean = false;

  public fileArr: any[] = [];//to store file details from file upload response
  //creating a FormGroup for Investigation Report
  public invReportFormGroup: FormGroup;//form group of inv report di add
  public invItemEditFormGroup: FormGroup;//form group of inv item modal

  public complaintReferenceNo: string;//to get complaint ref no from html and send it as a parameter
  //busySpinner 
  public busySpinner: boolean = true;
  //variable used for radio button
  // public invReportVar: any = { siteVisitMadeValue: '', sampleCollectedValue: '' };
  public invRejectReason: string = '';//taking a var to show reject reason

  //new add for modal custoner arr
  public invDetailsItemsHeader: any = {};
  public allInvItemDetByCustomerCode: any[] = [];//array for showing all invoice items det
  public selectedInvDet: any[] = [];// array for showing selected invoice dets
  //end of new add for modal customer arr

  public editCompTypeModal: boolean = false;
  //for complaint qty error
  public complaintQtyInMtrsError: boolean = true;

  public itemListFormGroup: FormGroup;
  public itemListNatOfCmpFormGroup: FormGroup;
  public dateErrFlag: boolean = false;
  public sampleDateErrFlag: boolean = false;
  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private complaintDIService: ComplaintDIService,
    private localStorageService: LocalStorageService,
    private investigationReportDIDataService: InvestigationReportDIDataService,
    private modalService: NgbModal,//modal
    private sessionErrorService: SessionErrorService,
    private datePipe: DatePipe//for date
  ) {
    let itemListNatOfCmpGroup: any = {};
    itemListNatOfCmpGroup['complainType'] = new FormControl();
    itemListNatOfCmpGroup['natOfComplain'] = new FormControl();
    itemListNatOfCmpGroup['complainDetail'] = new FormControl();
    this.itemListNatOfCmpFormGroup = new FormGroup(itemListNatOfCmpGroup);

    let editItemListGroup: any = {};
    editItemListGroup['complainTypeOfEditItem'] = new FormControl();
    editItemListGroup['natureOfComplaintOfEditItem'] = new FormControl();
    editItemListGroup['detailOfComplaintOfEditItem'] = new FormControl();
    this.invItemEditFormGroup = new FormGroup(editItemListGroup);
  }

  ngOnInit(): void {
    this.initform();
    this.getRouteParam();
    this.getPreviousInvHistory();
    this.getComplaintTypeVal();//get complaint type dropdown val from web service call
    this.invReportTable = new InvestigationReportDIConfigModel().prevInvReportHeader;
    this.itemGridTable = new InvestigationReportDIConfigModel().invItemGridHeader;
    this.ivtReportDataList.unloadingEquipmentList = new InvestigationDataModel().unloadingEquipmentList;
    this.ivtReportDataList.lubricantUsedList = new InvestigationDataModel().lubricantUsedList;
    this.ivtReportDataList.layingPositionList = new InvestigationDataModel().layingPositionList;
    this.ivtReportDataList.jointingTypeList = new InvestigationDataModel().jointingTypeList;
  }//end of onInit

  /**
   * @description init form data
   */
  initform() {
    this.invReportFormGroup = new FormGroup({
      complaintReferenceNo: new FormControl(''),
      siteVisitMade: new FormControl('', Validators.required),
      siteVisitDt: new FormControl(''),
      sampleCollected: new FormControl('', Validators.required),
      sampleCollectedDate: new FormControl(''),
      investigationReportFromDate: new FormControl('', Validators.required),//from date
      investigationReportToDate: new FormControl('', Validators.required),//to date
      customerCode: new FormControl(''),
      customerName: new FormControl(''),
      complaintAccepted: new FormControl('',Validators.required),
      invReportRemarks: new FormControl('')
    });
  }//end of method

  //start method getRouteParam to get route parameter
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    console.log("complaintReferenceNo investigation-report-di-add-component: ", this.complaintReferenceNo);
    this.invReportFormGroup.controls['complaintReferenceNo'].setValue(this.complaintReferenceNo);
  }//end of the method

  //method to get system date
  private getSystemDate() {
    //formatting the current date
    let date = new Date();
    let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.invReportFormGroup.controls['investigationReportFromDate'].setValue(currentDate);
    this.invReportFormGroup.controls['investigationReportToDate'].setValue(currentDate);
  }//end of method

  //method to get complaint type  
  private getComplaintTypeVal() {
    // this.busySpinner = true;
    //getting all values of complaintType
    this.investigationReportDIDataService.getSelectComplaintType().
      subscribe(res => {
        this.complaintTypeDropDownList = res.details;
      },
        err => {
          console.log(err);
          // this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end method getComplaintTypeVal

  //method of customer item details get
  private getCustomerInvItemDet(customerCodeParam: string) {
    this.investigationReportDIDataService.getCustomerInvDet(customerCodeParam).
      subscribe(res => {
        if (res.msgType === "Info") {
          this.allInvItemDetByCustomerCode = res.invoiceDetails.items;
          this.invDetailsItemsHeader = res.invoiceDetails.itemsHeader;

          let itemListGroup: any = {};
          this.allInvItemDetByCustomerCode.forEach((element, index) => {
            let key = element.invoiceNo + element.itemCode;
            element.formKey = key;
            itemListGroup[key] = new FormControl(false);
          });

          this.itemListFormGroup = new FormGroup(itemListGroup);
        }

        this.allInvItemDetByCustomerCode;
        this.itemListFormGroup;

        console.log(" this.allInvItemDetByCustomerCode ========> ", this.allInvItemDetByCustomerCode);
      },
        err => {
          console.log(err);
          // this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end of method 

  // TODO: SUSMITA
  private getPreviousInvHistory() {
    let cmpStatus: number = 40;
    this.complaintDIService.getComplainViewDetails(this.complaintReferenceNo, cmpStatus).
      subscribe(res => {
        //console.log("res of ref det::::",res);
        if (res.msgType === "Info") {
          let invReportDeatilsJson: any = JSON.parse(res.mapDetails);
          this.invReportDetails = invReportDeatilsJson;
          console.log("res of inv Report Deatils::::", this.invReportDetails);
          this.invReportIndex = this.invReportDetails ? this.invReportDetails.length - 1 : 0;
          // set form value
          this.setResValToForm();
          let pageActivityId: number = 40;
          let complaintDetailsAutoId: number = this.invReportDetails[this.invReportIndex].complaintDetailsAutoId;
          let comingFrom: string = "";//to check its from reg or not n set customer details
          // TODO: Item for previous 
          this.getInvoiceItemDetailWSCall(this.complaintReferenceNo, pageActivityId, complaintDetailsAutoId, comingFrom);
        } else {
          // this.busySpinner = false;
          this.getComplainViewDetailsWSCall();
        }//end of else if
      },
        err => {
          console.log(err);
          this.getComplainViewDetailsWSCall();
        });
  }//end of method 

  //method to get complain details by service call
  private getComplainViewDetailsWSCall() {
    this.getSystemDate();//to get system date and set it to investigation report date
    let prevCompStatus: number = 10;
    this.complaintDIService.getComplainViewDetails(this.complaintReferenceNo, prevCompStatus).
      subscribe(res => {
        console.log("res of reg view det::::", res);
        if (res.msgType === "Info") {
          let invReportDeatilsJson: any = JSON.parse(res.mapDetails);
          let regDetails = invReportDeatilsJson;
          console.log("Reg DTL::::", regDetails);
          let regLastIndex = regDetails ? regDetails.length - 1 : 0;
          let pageActivityId: number = 10;
          let complaintDetailsAutoId: number = regDetails[regLastIndex].complaintDetailsAutoId;
          let comingFrom: string = 'Reg';//to check its from reg or not n set customer details
          this.getInvoiceItemDetailWSCall(this.complaintReferenceNo, pageActivityId, complaintDetailsAutoId, comingFrom);
        } else {
          this.busySpinner = false;
        }//end of else if
      },
        err => {
          console.log(err);
          this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end of method

  //start method getInvoiceItemDetailWSCall to get item details
  private getInvoiceItemDetailWSCall(complaintReferenceNo: string, pageActivityId: number, complaintDetailsAutoId: number, comingFrom: string) {
    this.busySpinner = true;
    this.complaintDIService.getInvoiceItemDetail(complaintReferenceNo, pageActivityId, complaintDetailsAutoId).
      subscribe(res => {
        if (res.msgType === "Info") {
          let invItemDeatilsJson: any = JSON.parse(res.mapDetails);
          this.invItemDetails = invItemDeatilsJson;
          this.busySpinner = false;
          console.log("item details =========.........>>>>>>>>>", this.invItemDetails);
          this.invItemDetails.forEach(itemEl => {
            itemEl.complaintQtyInMtrs = parseInt(itemEl.complaintQtyInMtrs);
            itemEl.complaintQtyInTons = parseInt(itemEl.complaintQtyInTons);
            itemEl.complaintTypeDesc = itemEl.categoryDesc.trim()? itemEl.complaintTypeDesc+'('+itemEl.categoryDesc+')' : itemEl.complaintTypeDesc;
          });
          //new add
          // this.getComplainDet();//calling the method to check n update previous item row
          // if (comingFrom) {
          let invItemIndex: number = 0;
          this.invReportFormGroup.controls['customerCode'].setValue(this.invItemDetails[invItemIndex].customerCode);
          this.invReportFormGroup.controls['customerName'].setValue(this.invItemDetails[invItemIndex].customerName);
          // }//end of if
          let customerCode: string = this.invReportFormGroup.value.customerCode;//store the cutomer code
          this.getCustomerInvItemDet(customerCode);
          // end of new add
        } else {
          this.busySpinner = false;
        }
      },
        err => {
          console.log(err);
          this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end method of getInvoiceItemDetailWSCall

  //start method setResValToForm to set the value in invreport form
  private setResValToForm() {
    let formData: any = this.invReportDetails[this.invReportIndex];
    this.invReportFormGroup.controls['complaintReferenceNo'].setValue(formData.complaintReferenceNo);
    // let siteVisitMadeValue: string = formData.siteVisitMade;
    formData.siteVisitMade ? 
    this.invReportFormGroup.controls['siteVisitMade'].setValue(formData.siteVisitMade): 
    this.invReportFormGroup.controls['siteVisitMade'].setValue('');
    if (formData.siteVisitMade == 'Y') {
      this.invReportFormGroup.controls['siteVisitDt'].setValue(this.datePipe.transform(formData.siteVisitMadeDate, 'yyyy-MM-dd'));
    }
    // this.invReportVar.sampleCollectedValue = formData.sampleCollected;
    formData.sampleCollected ? 
    this.invReportFormGroup.controls['sampleCollected'].setValue(formData.sampleCollected):
    this.invReportFormGroup.controls['sampleCollected'].setValue('');

    if (formData.sampleCollected == 'Y') {
      this.invReportFormGroup.controls['sampleCollectedDate'].setValue(this.datePipe.transform(formData.sampleCollectedDate, 'yyyy-MM-dd'));
    }
    if (formData.investigationReportFromDate) {
      this.invReportFormGroup.controls['investigationReportFromDate'].setValue(this.datePipe.transform(formData.investigationReportFromDate, 'yyyy-MM-dd'));
    }
    if (formData.investigationReportDate) {
      this.invReportFormGroup.controls['investigationReportToDate'].setValue(this.datePipe.transform(formData.investigationReportDate, 'yyyy-MM-dd'));
    }
    if (formData.custCode) {
      this.invReportFormGroup.controls['customerCode'].setValue(formData.custCode);
    }
    if (formData.customerName) {
      this.invReportFormGroup.controls['customerName'].setValue(formData.customerName);
    }
    if(formData.complaintAccepted) {
      this.invReportFormGroup.controls['complaintAccepted'].setValue(formData.complaintAccepted);
    }
    if(formData.investigationReportRemarks) {
      this.invReportFormGroup.controls['invReportRemarks'].setValue(formData.investigationReportRemarks);
    }
    if (formData.investigationReportCancelRemarks) {
      this.invRejectReason = formData.investigationReportCancelRemarks;//set the reject reason
    } else {
      this.invRejectReason = "";
    }
  }//end method setResValToForm

  //onOpenModal for opening modal from modalService
  private onOpenModal(complaintReferenceNo: string, msgBody: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Complaint Reference Number: ' + complaintReferenceNo;//'Information';
    modalRef.componentInstance.modalMessage = msgBody;
  }//end of method onOpenModal

  private wsErrorCall(err) {
    this.errorMsgObj.errMsgShowFlag = true;
    this.errorMsgObj.errorMsg = err.msg;
    this.busySpinner = false;
    this.sessionErrorService.routeToLogin(err._body);
  }//end of method
  //to set items arr for submit
  private setTotalItemArr(itemsArr: any, complaintDetailsAutoId: string, itemInfo: string): any {
    let itemarrEl: any = {};
    itemarrEl.activityId = 40;//itemsArr.activityId;
    itemarrEl.complaintReferenceNo = this.complaintReferenceNo;
    itemarrEl.complaintDetailsAutoId = parseInt(complaintDetailsAutoId);//ask sayantan da --> parseInt(valueSub);
    itemarrEl.natureOfComplaintId = parseInt(itemsArr.natureOfComplaintId);
    itemarrEl.complaintDetails = itemsArr.complaintDetails ? itemsArr.complaintDetails : '';
    itemarrEl.invoiceNo = itemsArr.invoiceNo;
    itemarrEl.itemCode = itemsArr.itemCode ? itemsArr.itemCode : itemsArr.itemNo;
    itemarrEl.complaintQtyInMtrs = itemsArr.complaintQtyInMtrs;
    itemarrEl.complaintQtyInTons = itemsArr.complaintQtyInTons;
    // itemarrEl.invoiceQtyInMtrs = itemsArr.invoiceQtyInMtrs;
    // itemarrEl.invoiceQtyInTons = itemsArr.invoiceQtyInTons;
    itemarrEl.userId = this.localStorageService.user.userId;
    itemarrEl.batchNo = itemsArr.batchNo;
    itemarrEl.cameFrom = itemInfo == 'editItem' ? 10 : 40;//parseInt(itemsArr.cameFrom);
    return itemarrEl;
  }//end of method

  //start method of getTotalItemDet to get total items
  private getTotalItemDet(complaintDetailsAutoId: string): any[] {
    let totalItems: any[] = [];
    let arrEl: any = {};
    this.invItemDetails.forEach(invItmDet => {
      arrEl = this.setTotalItemArr(invItmDet, complaintDetailsAutoId, 'editItem');
      totalItems.push(arrEl);
    });
    this.selectedInvItemDetails.forEach(selInvItmDet => {
      arrEl = this.setTotalItemArr(selInvItmDet, complaintDetailsAutoId, 'addItem');
      totalItems.push(arrEl);
    });
    console.log(" total itemssssss::::::", totalItems);
    return totalItems;
  }//end of the method of getTotalItemDet

  //start method postInvoiceItemDetailWsCall to post item details
  private postInvoiceItemDetailWsCall(items: any[],action: string,invReportDetailJson) {
    this.busySpinner = true;
    let invItem: any = {};
    invItem.items = items;
    this.complaintDIService.postInvoiceItemDetail(invItem, this.plantType,action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("submit item msg====", res.msg);
          if (this.fileArr.length > 0) {
            let fileAutoIdStr: string = '';//taking a var to store files autoId
            this.fileArr.forEach(fileEl => {
              fileAutoIdStr = fileAutoIdStr ? (fileAutoIdStr + ',' + fileEl.fileAutoId) : fileEl.fileAutoId;
            });
            let fileJsonBody: any = {};
            fileJsonBody.complaintReferenceNo = invReportDetailJson.complaintReferenceNo;
            fileJsonBody.complaintDetailsAutoId = parseInt(res.valueSub);
            fileJsonBody.activityId = this.activityId;
            fileJsonBody.userId = this.localStorageService.user.userId;
            fileJsonBody.fileAutoIds = fileAutoIdStr;
            this.fileUploadWSCall(this.plantType, fileJsonBody);//calling the file ws method
          }//end of file array check              
          //new add to send email
          this.sendEmail(invReportDetailJson,this.plantType,"investigation");//calling the method to send email

          this.onOpenModal(res.value, res.msg);//calling the modal to show msg
          let routePath = ROUTE_PATHS.RouteAddRCADI + '/' + invReportDetailJson.complaintReferenceNo + '/' + 50;//rca status is 50
          this.router.navigate([routePath]);//route to rca add page
        }else{
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = res.msg;
          this.busySpinner = false;
        }
      },
        err => {
          console.log(err);
          this.wsErrorCall(err);
        });
  }//end of the method of postInvoiceItemDetailWsCall

  //method to file upload
  private fileUploadWSCall(plantType: string, fileJsonBody: any) {
    this.complaintDIService.postFile(plantType, fileJsonBody).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("files uploaded successfully");
        }//end of if
      }, err => {
        console.log(err);
      });
  }//end of method

  //start method uploadInvoiceItemDetails
  private uploadInvoiceItemDetails(totalItems: any[], action: string,invReportDetailJson:any) {
    //this.deleteInvoiceItemDetailWSCall();
    this.postInvoiceItemDetailWsCall(totalItems,action,invReportDetailJson);
  }//end of the method uploadInvoiceItemDetails

  // private detCompSubmitFlag: boolean = true;//comp det submit flag
  // start method of submitInvReportDIDetDetailWSCall to detail submit webservice calll
  private submitInvReportDIDetDetailWSCall(invReportDetailJson: any, action: string) {
    let totalItems: any[] = [];
    this.complaintDIService.postDetail(invReportDetailJson, this.plantType, action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log(" complain submitted successfully");
          totalItems = this.getTotalItemDet(res.valueSub);
          if (totalItems.length > 0) {
            action = "investigation";
            this.uploadInvoiceItemDetails(totalItems,action,invReportDetailJson);
          }
        } else {
          // if(this.detCompSubmitFlag){
          //   this.submitInvReportDIDetDetailWSCall(invReportDetailJson, action);
          //   this.detCompSubmitFlag = false;//set it false
          // }//end of if
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = res.msg;
          this.busySpinner = false;//to stop spinner
        }//end of else
      },
        err => {
          console.log(err);
          // if(this.detCompSubmitFlag){
          //   this.submitInvReportDIDetDetailWSCall(invReportDetailJson, action);
          //   this.detCompSubmitFlag = false;//set it false
          // }
          this.wsErrorCall(err);
        });
  }//end of submitInvReportDIDetDetailWSCall method

  //start method of submitInvReportDIDetWSCall to submit invReport details
  private submitInvReportDIDetWSCall(invReportHeaderJson: any, invReportDetailJson: any, action: string) {
    this.busySpinner = true;
    this.complaintDIService.putHeader(invReportHeaderJson, this.plantType, action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          invReportDetailJson.complaintReferenceNo = res.value;
          this.submitInvReportDIDetDetailWSCall(invReportDetailJson, action);
        } else {
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = res.msg;
          this.busySpinner = false;
        }
      },
        err => {
          console.log(err);
          this.wsErrorCall(err);
        });
  }//end of the method of submitInvReportDIDetWSCall

  //start method deleteSelInvDetFromAllInvDetArr for deleting the ivoice details from selected invoice data grid array
  private deleteSelInvDetFromSelInvDetArr(selectedInvDetParam: any) {
    console.log(" SelInvDetails before splice ", this.selectedInvItemDetails);
    let indexCount: number = 0;
    for (let selInvDet of this.selectedInvItemDetails) {
      if (selInvDet.invoiceNo == selectedInvDetParam.invoiceNo && selInvDet.itemCode == selectedInvDetParam.itemCode && selInvDet.complaintTypeDesc == selectedInvDetParam.complaintTypeDesc && selInvDet.natureOfComplaintDesc == selectedInvDetParam.natureOfComplaintDesc) {
        this.selectedInvItemDetails.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for

    this.selectedInvItemDetailsObj = {};
    this.selectedInvItemDetails.forEach((invItemAddEl) => {
      let itemKey = invItemAddEl.complaintTypeId + invItemAddEl.natureOfComplaintId + '|' +
        invItemAddEl.formKey; // invItemAddEl.invoiceNo + invItemAddEl.itemCode;
      this.selectedInvItemDetailsObj[itemKey] ? null : this.selectedInvItemDetailsObj[itemKey] = invItemAddEl;
    });

    console.log(" SelInvDetails after splice ", this.selectedInvItemDetails);
  }//end of the method deleteSelInvDetFromSelInvDet 

  //method to send email
  private sendEmail(complainDetailJson: any, plantType: string, action: string){
    let emailJsonBody: any = {};    
    emailJsonBody.complaintReferenceNo = complainDetailJson.complaintReferenceNo;    
    this.complaintDIService.sendEmail(emailJsonBody,plantType,action).
    subscribe(res=>{
      if(res.msgType === 'Info'){
        console.log("mail send successfully");
      }
    },err=>{
    });

  }//end of method

  //start method of complaintQtyErrorCorrection
  private complaintQtyErrorCorrection(itemsArr: any[]) {
    for (let itemDet of itemsArr) {
      if (itemDet.uiInpErrFlag || itemDet.uiInpErrFlag == undefined) {
        this.complaintQtyInMtrsError = true;
        break;
      } else if (!itemDet.uiInpErrFlag) {
        this.complaintQtyInMtrsError = false;
      }//end of else if
    }//end of for     
  }//end of the method complaintQtyErrorCorrection 

  //method to check comp qty of inv added item
  private onKeyupComplaintQtyOfAddItem(complaintQtyInMtrsParam, itemDetEl: any, itemInfoParam: string, itemAddEditArr: any[]) {
    let flag: boolean = false;
    console.log("complaintQtyInMtrsParam===>", complaintQtyInMtrsParam);
    let invoiceQtyInMtrParam: string = itemDetEl.invoiceQtyInMtrs;
    for (let itemDet of itemAddEditArr) {
      if (itemDet.invoiceNo == itemDetEl.invoiceNo && itemDet.itemCode == itemDetEl.itemCode && itemDet.complaintTypeId == itemDetEl.complaintTypeId && itemDet.natureOfComplaintId == itemDetEl.natureOfComplaintId) {
        let complaintQtyInMtrs: number = parseFloat(complaintQtyInMtrsParam);
        let invoiceQtyInMtrs: number = parseFloat(invoiceQtyInMtrParam);
        if (complaintQtyInMtrs > invoiceQtyInMtrs) {
          itemDet.uiInpErrFlag = true;
          itemDet.uiInpErrDesc = 'Complaint Quantity can’t be greater than Invoice Quantity.';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          break;
        } else if (isNaN(complaintQtyInMtrs) || complaintQtyInMtrs == 0) {
          itemDet.uiInpErrFlag = true;
          itemDet.uiInpErrDesc = 'Complaint Quantity can’t be empty or zero';
          this.complaintQtyErrorCorrection(itemAddEditArr);
        } else if (complaintQtyInMtrs < 0) {
          itemDet.uiInpErrFlag = true;
          itemDet.uiInpErrDesc = 'Complaint Quantity can’t be less than zero';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          // } else if (complaintQtyInMtrs >= 0 && complaintQtyInMtrs <= invoiceQtyInMtrs && !(isNaN(complaintQtyInMtrs))) {
        } else if (complaintQtyInMtrs > 0 || (complaintQtyInMtrs <= invoiceQtyInMtrs && !(isNaN(complaintQtyInMtrs)))) {
          itemDet.complaintQtyInMtrs = complaintQtyInMtrs;
          flag = true;
          itemDet.uiInpErrFlag = false;
          itemDet.uiInpErrDesc = '';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          break;
        }//end of else
      }//end of if
    }//end of for   
  }//end of method  

  //method to check comp qty of inv edit item
  private onKeyupComplaintQtyOfEditItem(complaintQtyInMtrsParam, itemDetEl: any, itemInfoParam: string, itemAddEditArr: any[]) {
    let flag: boolean = false;
    console.log("complaintQtyInMtrsParam===>", complaintQtyInMtrsParam);
    let invoiceQtyInMtrParam: string = itemDetEl.invoiceQtyInMtrs;
    for (let itemDet of itemAddEditArr) {
      if (itemDet.invoiceNo == itemDetEl.invoiceNo && itemDet.itemNo == itemDetEl.itemNo && itemDet.complaintTypeId == itemDetEl.complaintTypeId && itemDet.natureOfComplaintId == itemDetEl.natureOfComplaintId) {
        let complaintQtyInMtrs: number = parseFloat(complaintQtyInMtrsParam);
        let invoiceQtyInMtrs: number = parseFloat(invoiceQtyInMtrParam);
        if (complaintQtyInMtrs > invoiceQtyInMtrs) {
          itemDet.uiInpErrFlag = true;
          itemDet.uiInpErrDesc = 'Complaint Quantity can’t be greater than Invoice Quantity.';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          break;
        } else if (complaintQtyInMtrs < 0) {
          itemDet.uiInpErrFlag = true;
          itemDet.uiInpErrDesc = 'Complaint Quantity can’t be less than zero';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          // } else if (complaintQtyInMtrs >= 0 && complaintQtyInMtrs <= invoiceQtyInMtrs && !(isNaN(complaintQtyInMtrs))) {
        } else if (complaintQtyInMtrs == 0 || (complaintQtyInMtrs <= invoiceQtyInMtrs && !(isNaN(complaintQtyInMtrs)))) {
          itemDet.complaintQtyInMtrs = complaintQtyInMtrs;
          flag = true;
          itemDet.uiInpErrFlag = false;
          itemDet.uiInpErrDesc = '';
          this.complaintQtyErrorCorrection(itemAddEditArr);
          break;
        }//end of else
      }//end of if
    }//end of for   
  }//end of method  

  //start method onKeyupComplaintQtyOfEditItem
  public onKeyupComplaintQtyOfInvItem(complaintQtyInMtrsParam, itemDetEl: any, itemInfoParam: string) {
    let itemAddEditArr: any[] = [];
    if (itemInfoParam === 'editItem') {
      itemAddEditArr = this.invItemDetails;
      this.onKeyupComplaintQtyOfEditItem(complaintQtyInMtrsParam, itemDetEl, itemInfoParam, itemAddEditArr);
    } else if (itemInfoParam === 'addItem') {
      itemAddEditArr = this.selectedInvItemDetails;
      this.onKeyupComplaintQtyOfAddItem(complaintQtyInMtrsParam, itemDetEl, itemInfoParam, itemAddEditArr);
    }
  }//end of the method onKeyupComplaintQtyOfEditItem


  //file upload event  
  public fileChange(event) {
    let plantType: string = this.localStorageService.user.plantType;
    this.fileData = new FormData();
    this.totalFileSize = 0;
    this.fileList = event.target.files;
    // console.log("this.fileList.length::",this.fileList.length);
    if (this.fileList.length > 0) {
      this.busySpinner = true;
      for (let i: number = 0; i < this.fileList.length; i++) {
        let file: File = this.fileList[i];
        this.fileData.append('uploadFile', file, file.name);
        this.totalFileSize = this.totalFileSize + file.size;
        console.log("this.totalFileSize:::::::::::", this.totalFileSize);
      }//end of for
      if (this.totalFileSize > this.fileSizeLimit) {
        this.errorMsgObj.errMsgShowFlag = true;
        this.errorMsgObj.errorMsg = "File size should be within 100 mb !";
        this.busySpinner = false;
      } else {
        if (this.fileData != undefined) {
          for (let i: number = 0; i < this.fileList.length; i++) {
            console.log(" file upload", this.fileData.get('uploadFile'));
            if (this.fileData.get('uploadFile') != null) {
              this.formData.append('uploadFile', this.fileData.get('uploadFile'));
            }
          }//end of for
        }//end of if fileData is !undefined
        this.formData.append('Accept', 'application/json');
        this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
        this.formData.append('menuId', 'DEFAULT1');
        this.formData.append('userId', this.localStorageService.user.userId);
        // let formDataObj: any = {};
        // formDataObj = this.formData;
        this.complaintDIService.postFileInTempTable(plantType, this.formData).
          subscribe(res => {
            if (res.msgType === 'Info') {
              this.busySpinner = false;
              console.log("file uploaded successfully..");
              this.fileArr.push({ fileAutoId: res.valueAdv, fileName: res.value, fileUrl: res.valueSub });
              console.log("this.fileArr:: ", this.fileArr);
              this.fileInputVariable.nativeElement.value = "";//reset file
              this.formData = new FormData();
            } else {
              this.errorMsgObj.errMsgShowFlag = true;
              this.errorMsgObj.errorMsg = res.msg;
              this.formData = new FormData();
              this.busySpinner = false;
            }
          }, err => {
            console.log(err);
            this.formData = new FormData();
            this.wsErrorCall(err);
          });
      }
    }//end of if
  }//end of filechange method 

  //on click investigationReportDISubmit method
  public investigationReportDISubmit(): void {
    if (this.invReportFormGroup.valid) {
      console.log("this.invReportFormGroup.value", this.invReportFormGroup.value);
      let date = new Date();
      // let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
      let invReportHeaderJson: any = {};
      invReportHeaderJson.lastActivityId = this.activityId;
      invReportHeaderJson.userId = this.localStorageService.user.userId;
      invReportHeaderJson.complaintReferenceNo = this.invReportFormGroup.value.complaintReferenceNo;
      console.log(" invReportHeaderJson =========", invReportHeaderJson);
      let action: string = "";
      let invReportDetailJson: any = {};
      invReportDetailJson.activityId = this.activityId;
      invReportDetailJson.userId = this.localStorageService.user.userId;
      console.log("invReportFormGroup: ", this.invReportFormGroup.value);
      invReportDetailJson.complaintReferenceNo = this.invReportFormGroup.value.complaintReferenceNo;
      // invReportDetailJson.investigationReportDate = currentDate;
      invReportDetailJson.investigationReportFromDate = this.invReportFormGroup.value.investigationReportFromDate;//from date
      invReportDetailJson.investigationReportDate = this.invReportFormGroup.value.investigationReportToDate;//to date
      invReportDetailJson.sampleCollected = this.invReportFormGroup.value.sampleCollected;//this.invReportVar.sampleCollectedValue;
      if(this.invReportFormGroup.value.sampleCollected == 'Y'){
        invReportDetailJson.sampleCollectedDate = this.invReportFormGroup.value.sampleCollectedDate;
      }
      invReportDetailJson.siteVisitMade = this.invReportFormGroup.value.siteVisitMade;//this.invReportVar.siteVisitMadeValue;
      if(this.invReportFormGroup.value.siteVisitMade == 'Y') {
        invReportDetailJson.siteVisitMadeDate = this.invReportFormGroup.value.siteVisitDt;
      }
      invReportDetailJson.complaintAccepted = this.invReportFormGroup.value.complaintAccepted;
      invReportDetailJson.investigationReportRemarks = this.invReportFormGroup.value.invReportRemarks ? this.invReportFormGroup.value.invReportRemarks : '';

      let unloadingEquipment: string = "";
      this.unloadingEquipmentList.forEach(unloadingEquip => {
        unloadingEquipment = unloadingEquipment ? (unloadingEquipment + "," + unloadingEquip) : unloadingEquip;
      });
      console.log("unloadingEquipment ======== ", unloadingEquipment);
      invReportDetailJson.unloadingEquipement = unloadingEquipment;

      let lubricantUsed: string = "";
      this.lubricantUsedList.forEach(lbUsed => {
        lubricantUsed = lubricantUsed ? (lubricantUsed + "," + lbUsed) : lbUsed;
      });
      console.log("lubricantUsed ======== ", lubricantUsed);
      invReportDetailJson.lubricantUsed = lubricantUsed;

      let layingPosition: string = "";
      this.layingPositionList.forEach(layPos => {
        layingPosition = layingPosition ? (layingPosition + "," + layPos) : layPos;
      });
      console.log("layingPosition ======== ", layingPosition);
      invReportDetailJson.layingPosition = layingPosition;

      let jointingType: string = "";
      this.jointingTypeList.forEach(jType => {
        jointingType = jointingType ? (jointingType + "," + jType) : jType;
      });
      console.log("jointingType ======== ", jointingType);
      invReportDetailJson.jointingType = jointingType;

      console.log("invReportDetailJson====== ", invReportDetailJson);

      this.submitInvReportDIDetWSCall(invReportHeaderJson, invReportDetailJson, action);//calling the me
    } else {
      this.errorMsgObj.errMsgShowFlag = true;
      this.errorMsgObj.errorMsg = 'Please fillout All Data';
    }
  }//end of method investigationReportDISubmit

  //cancel method
  public onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);//route to complain di view page
  }//end of cancel method

  //date validation
  public dateValidation(dateInfo: string) {
    let date = new Date();
    let dateControlName = new Date(this.invReportFormGroup.controls['siteVisitDt'].value);

    //let siteVisitDate: string = this.datePipe.transform(this.invReportFormGroup.controls['siteVisitDt'].value, 'dd-MM-yyyy');
    if (date < dateControlName) {
      this.dateErrFlag = true;
    } else {
      this.dateErrFlag = false;
    }
  }

  public sampledateValidation() {
    let date = new Date();
    let dateControlName = new Date(this.invReportFormGroup.controls['sampleCollectedDate'].value);
    if (date < dateControlName) {
      this.sampleDateErrFlag = true;
    } else {
      this.sampleDateErrFlag = false;
    }
  }

  //start method for clicking radio button 
  public onRadioClick(radioButtonName: string,radioBtnValue: string) {
    
      //  if siteVisitValue is Y then this if condition will be executed
      if (radioBtnValue == 'Y') {
        if (radioButtonName === "siteVisitMade") {
          this.invReportFormGroup.get('siteVisitDt').setValidators(Validators.required);
        }else if(radioButtonName === "sampleCollected"){
          this.invReportFormGroup.get('sampleCollectedDate').setValidators(Validators.required);
        }
        //set sitevisitby field mandatory
      } else if (radioBtnValue == 'N') {
        if (radioButtonName === "siteVisitMade") {
          this.invReportFormGroup.get('siteVisitDt').setValidators(null);
          this.invReportFormGroup.get('siteVisitDt').updateValueAndValidity();
          this.invReportFormGroup.controls['siteVisitDt'].markAsUntouched();
        } else if(radioButtonName === "sampleCollected"){
          this.invReportFormGroup.get('sampleCollectedDate').setValidators(null);
          this.invReportFormGroup.get('sampleCollectedDate').updateValueAndValidity();
          this.invReportFormGroup.controls['sampleCollectedDate'].markAsUntouched();
        }   
      }
  }//end of method onRadioClick

  //start method of onclickUnloadingEquipmentSelect
  public onclickUnloadingEquipmentSelect(paramId) {
    if (this.unloadingEquipmentList.length === 0) {
      this.unloadingEquipmentList.push(paramId);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let data of this.unloadingEquipmentList) {
        if (data == paramId) {
          this.unloadingEquipmentList.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("after pushing unloadingEquipmentList items : ", this.unloadingEquipmentList);
      if (!removeFlag) {
        this.unloadingEquipmentList.push(paramId);
      }//end of if
      console.log("after pushing unloadingEquipmentList items : ", this.unloadingEquipmentList);
    }//end of else

  }//end of onclickUnloadingEquipmentSelect

  // start method of onclickLubricantUsedSelect
  public onclickLubricantUsedSelect(paramId) {
    if (this.lubricantUsedList.length === 0) {
      this.lubricantUsedList.push(paramId);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let data of this.lubricantUsedList) {
        if (data == paramId) {
          this.lubricantUsedList.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("after pushing lubricantUsedList items : ", this.lubricantUsedList);
      if (!removeFlag) {
        this.lubricantUsedList.push(paramId);
      }//end of if
      console.log("after pushing lubricantUsedList items : ", this.lubricantUsedList);
    }//end of else
  }//end method of onclickLubricantUsedSelect

  // start method onclickLayingPositionSelect
  public onclickLayingPositionSelect(paramId) {
    if (this.layingPositionList.length === 0) {
      this.layingPositionList.push(paramId);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let data of this.layingPositionList) {
        if (data == paramId) {
          this.layingPositionList.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("after pushing layingPositionList items : ", this.layingPositionList);
      if (!removeFlag) {
        this.layingPositionList.push(paramId);
      }//end of if
      console.log("after pushing layingPositionList items : ", this.layingPositionList);
    }//end of else
  }//end method of onclickLayingPositionSelect

  // start method onclickJointingTypeListSelect
  public onclickJointingTypeListSelect(paramId) {
    if (this.jointingTypeList.length === 0) {
      this.jointingTypeList.push(paramId);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let data of this.jointingTypeList) {
        if (data == paramId) {
          this.jointingTypeList.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("after pushing jointingTypeList items : ", this.jointingTypeList);
      if (!removeFlag) {
        this.jointingTypeList.push(paramId);
      }//end of if
      console.log("after pushing jointingTypeList items : ", this.jointingTypeList);
    }//end of else
  }//end of method onclickJointingTypeListSelect

    //method for Complaint Logged On and Compliant Reference Date validation 
    public compareTwoDates(controlName: string) {
      this.fromDateErr = false;
      this.toDateErr = false;
      let fromDate = new Date(this.invReportFormGroup.controls['investigationReportFromDate'].value);
      let toDate = new Date(this.invReportFormGroup.controls['investigationReportToDate'].value);
      if(controlName === 'investigationReportFromDate'){
        if (fromDate > toDate) {
          console.log("fromDate Date error.")
          this.fromDateErr = true;
          this.toDateErr = false;
        }//end of if
      }else if(controlName === 'investigationReportToDate'){
        if (toDate < fromDate) {
          console.log("toDate Date error.")
          this.toDateErr = true;
          this.fromDateErr = false;
        }//end of if
      }//end of else if
    }//end of method

  //start method selectData
  public selectData(invRepIndex: number) {
    this.busySpinner = true;
    this.invReportIndex = invRepIndex;
    let comingFrom: string = "";//to check its from reg or not then set the customer details
    let pageCompStatus: number = 40;//to fetch item 
    this.setResValToForm();
    let complainDetailsAutoId: number = this.invReportDetails[this.invReportIndex].complaintDetailsAutoId;
    this.getInvoiceItemDetailWSCall(this.complaintReferenceNo, pageCompStatus, complainDetailsAutoId, comingFrom);//inv item details   
  }//end method of selectData

  // //onOpenModal for opening modal from modalService
  public onItemsOpenModal() {
    this.toggleAddInvItemModal();
  }//end of method
  // start method of onCloseInvoiceNo
  public onCloseInvoiceNo(selectedInvDet: any) {
    this.deleteSelInvDetFromSelInvDetArr(selectedInvDet);
  }//end of the method of onCloseInvoiceNo

  // method to delete error msg
  public deleteResErrorMsgOnClick() {
    this.errorMsgObj.errMsgShowFlag = false;
    this.errorMsgObj.errorMsg = "";
  }//end of method to delete error msg

  //new add
  //method for onchanging compaintType dropdown
  private onComplaintTypeSelect(args, complaintTypeId: string, comTypeName?: string) {
    // let compDet: string = this.investigationItemFormGroup.value.complaintDetails.trim();
    let complaintTypeName: string = '';
    if (args != null) {
      complaintTypeName = args.target.options[args.target.selectedIndex].text;
    }
    comTypeName ? complaintTypeName = comTypeName : null;
    console.log("complaintTypeId", complaintTypeId);
    console.log("this.complaintTypeName,=========================", complaintTypeName);
    if (complaintTypeId && complaintTypeName) {//checking if comptype id n name is available or not
      this.tempCompTypeJson.complaintTypeId = complaintTypeId;
      this.tempCompTypeJson.complaintTypeDesc = complaintTypeName;
    }//end of if
    if (complaintTypeId) {
      this.busySpinner = true;
      this.investigationReportDIDataService.getSelectValNatureOfComplaint(complaintTypeId).
        subscribe(res => {
          if (res.msgType === 'Info') {
            this.natureOfComDropDownList = res.details;
            if (complaintTypeName === 'Others(CAT C)') {
              // this.tempCompTypeJson.natureOfComplaintId = this.natureOfComDropDownList[0].Key;
              this.tempCompTypeJson.natureOfComplaintDesc = this.natureOfComDropDownList[0].Value;
              // this.addModalCheckBoolean = true;
            } else {
              // this.addModalCheckBoolean = false;
            }
          }
          this.busySpinner = false;
        },
          err => {
            console.log(err);
            this.busySpinner = false;
            this.sessionErrorService.routeToLogin(err._body);
          });
    }else{
      this.natureOfComDropDownList = [];//clear the nature of complain dropdown list
    }
  }//end of the method onComplaintTypeSelect

  // start method to select comp type from edit item modal
  public onEditItemComplaintTypeSelect(compTypeDropdownListFromEditModal){
    let selectedKey = this.invItemEditFormGroup.value['complainTypeOfEditItem'];
    let selectedDesc = '';
    compTypeDropdownListFromEditModal.forEach((element) => {
      if (element.Key == selectedKey) {
        selectedDesc = element.Value;
      }
    });
    if (selectedKey == '5') {
      this.invItemEditFormGroup.controls['natureOfComplaintOfEditItem'].setValue('44');
      this.tempCompTypeJson.natureOfComplaintId = '44';
    } else {
      this.tempCompTypeJson.natureOfComplaintId = '';
      this.invItemEditFormGroup.controls['natureOfComplaintOfEditItem'].setValue('');
      this.invItemEditFormGroup.controls['detailOfComplaintOfEditItem'].setValue('');
      this.modalErrorMsgObj.modalErrorMsgShowFlag = false;
      this.modalErrorMsgObj.modalErrorMsg = "";
    }
    this.onComplaintTypeSelect(null, selectedKey, selectedDesc);
  }//end of method

  // start method of Nature Type Select
  public onEditItemNatureTypeSelect(natureOfComDropDownListFromEditModal) {
    let selectedKey = this.invItemEditFormGroup.value['natureOfComplaintOfEditItem'];
    let selectedDesc = '';
    natureOfComDropDownListFromEditModal.forEach((element) => {
      if (element.Key == selectedKey) {
        selectedDesc = element.Value;
      }
    });
    this.tempCompTypeJson.natureOfComplaintId = selectedKey;
    this.tempCompTypeJson.natureOfComplaintDesc = selectedDesc;
  }// end method

  //end of new add
  private toggleEditCompTypeModal() {
    this.editCompTypeModal = this.editCompTypeModal ? false : true;
  }
  public cancelEditItemModal(){
    this.resetEditItemModalData();//clear all data  
      this.toggleEditCompTypeModal();
  }
  private tempCompTypeJson: any = {};//taking json to store temp complaint type n nature of complaint val
  // private editCompTypeOfficialDoc: string = '';//to store official doc no
  // private editCompTypeItemCode: string = '';//to store comp type item
  private selectedUniqueKey: string = '';
  // private editCompTypeKey: string = '';//to store comp type id 
  // private editNatureOfComplaintKey: string = '';//to store nature of comp id 
  public modalErrorMsgObj: any = {//to show modal error msg
    modalErrorMsgShowFlag: false,
    modalErrorMsg: ''
  }
  public openEditCompTypeModal(compDtl?: any) {
    if (compDtl.complaintQtyInMtrs > 0) {
      this.toggleEditCompTypeModal();
      console.log("compDtl::", compDtl);
      // Add Logic
      this.selectedUniqueKey = compDtl.invoiceNo + compDtl.itemNo + compDtl.complaintTypeId + compDtl.natureOfComplaintId;
      // this.editCompTypeOfficialDoc = compDtl.invoiceNo;
      // this.editCompTypeItemCode = compDtl.itemNo;
    }
  }//end of method

  public saveEditCompType() {
    if (this.natOfCompOtherKey[this.tempCompTypeJson.natureOfComplaintId] && !this.invItemEditFormGroup.value['detailOfComplaintOfEditItem']) {
      this.modalErrorMsgObj.modalErrorMsgShowFlag = true;
      this.modalErrorMsgObj.modalErrorMsg = "Detail of Complaint is required.";
    } else {
      this.modalErrorMsgObj.modalErrorMsgShowFlag = false;
      this.modalErrorMsgObj.modalErrorMsg = "";
      let complainDetails = this.invItemEditFormGroup.value['detailOfComplaintOfEditItem'];
      this.tempCompTypeJson.complaintDetails = complainDetails ? complainDetails : '';//set complain details to json
      if (this.tempCompTypeJson.natureOfComplaintId == '44') {
        this.natureOfComDropDownList.forEach(el => {
          if (el.Key == this.tempCompTypeJson.natureOfComplaintId) {
            this.tempCompTypeJson.natureOfComplaintDesc = el.Value;
          }//end of if                
        });
      }//end of if
      console.log("tempCompTypeJson::", this.tempCompTypeJson);
      if (!this.modalErrorMsgObj.modalErrorMsgShowFlag) {
        // Items from register
        this.invItemDetails.forEach(invItemEl => {
          let uniqueKey: string = invItemEl.invoiceNo + invItemEl.itemNo + invItemEl.complaintTypeId + invItemEl.natureOfComplaintId;
          if(this.selectedUniqueKey === uniqueKey){
          // if (invItemEl.invoiceNo === this.editCompTypeOfficialDoc && invItemEl.itemNo === this.editCompTypeItemCode) {
            invItemEl.natureOfComplaintDesc = this.tempCompTypeJson.natureOfComplaintDesc;
            invItemEl.natureOfComplaintId = this.tempCompTypeJson.natureOfComplaintId;
            invItemEl.complaintTypeId = this.tempCompTypeJson.complaintTypeId;
            invItemEl.complaintTypeDesc = this.tempCompTypeJson.complaintTypeDesc;
            invItemEl.complaintDetails = this.tempCompTypeJson.complaintDetails;           
          }//end of if
        });
        //clear data
        this.resetEditItemModalData();
        this.toggleEditCompTypeModal();//close modal
      }//end of err msg flag check
    }//end of else
  }//end of method

  resetEditItemModalData() {
    this.invItemEditFormGroup.controls['complainTypeOfEditItem'].setValue('');
    this.invItemEditFormGroup.controls['natureOfComplaintOfEditItem'].setValue('');
    this.invItemEditFormGroup.controls['detailOfComplaintOfEditItem'].setValue('');
    //clear json 
    this.tempCompTypeJson.complaintDetails = '';
    this.tempCompTypeJson.complaintTypeDesc = '';
    this.tempCompTypeJson.complaintTypeId = '';
    this.tempCompTypeJson.natureOfComplaintId = '';
    this.tempCompTypeJson.natureOfComplaintDesc = '';
    // this.editCompTypeOfficialDoc = '';//clear the inv/official doc no
    // this.editCompTypeItemCode = '';//clear the item code
    this.selectedUniqueKey = '';//clr unique key
    this.natureOfComDropDownList = [];//clear nature of complain arr
    //to clear the error msg
    this.modalErrorMsgObj.modalErrorMsgShowFlag = false;
    this.modalErrorMsgObj.modalErrorMsg = "";
    // this.addModalCheckBoolean = false;//set false to hide checkbox
  }
  //for add item click
  public addInvItemModalFlag: boolean = false;//to show add item modal
  // public addModalCheckBoolean: boolean = false;//to show checkbox
  private toggleAddInvItemModal() {
    this.addInvItemModalFlag = this.addInvItemModalFlag ? false : true;
  }//end of method

  // ========= add item ===============
  private selectedComplainTypeId = '';
  private selectedComplainTypeDesc;
  private selectedNatureOfCompId = '';
  private selectedNatureOfCompDesc;

  public getAddItemList(): any[] {
    this.allInvItemDetByCustomerCode;
    let itemList: any[] = [];
    let keyElement = this.selectedComplainTypeId + this.selectedNatureOfCompId;

    this.allInvItemDetByCustomerCode.forEach((itemDetails) => {
      let itemIdetifier: string = ''
      itemIdetifier = keyElement + '|' + itemDetails.formKey;
      if (!this.selectedInvItemDetailsObj[itemIdetifier]) {
        itemList.push(itemDetails);
      }
    });
    return itemList;
  }//end of method

  public complainTypeOnChange(listOfElements) {
    // listOfElements;
    // this.itemListNatOfCmpFormGroup;
    let selectedKey = this.itemListNatOfCmpFormGroup.value['complainType'];
    let selectedDesc = '';
    listOfElements.forEach((element) => {
      if (element.Key == selectedKey) {
        selectedDesc = element.Value;
      }
    });

    if (selectedKey == '5') {
      this.itemListNatOfCmpFormGroup.controls['natOfComplain'].setValue('44');
      this.selectedNatureOfCompId = '44';
      // this.selectedNatureOfCompDesc = this.natureOfComDropDownList[0].Value;//set the value of nature of complaint dropdown
    } else {
      this.selectedNatureOfCompId = '';
      this.itemListNatOfCmpFormGroup.controls['natOfComplain'].setValue('');
      this.itemListNatOfCmpFormGroup.controls['complainDetail'].setValue('');
    }

    this.selectedComplainTypeId = selectedKey;
    this.selectedComplainTypeDesc = selectedDesc;
    this.addItemModalErrorFlag = false;
    this.onComplaintTypeSelect(null, selectedKey, selectedDesc);
  }//end of method

  public enableSelection() {
    if (this.selectedComplainTypeId && this.selectedNatureOfCompId) {
      return true;
    } else {
      return false;
    }
  }//end of method

  public natOfCompOnChange(natureOfComDropDownList) {

    let selectedKey = this.itemListNatOfCmpFormGroup.value['natOfComplain'];
    let selectedDesc = '';
    natureOfComDropDownList.forEach((element) => {
      if (element.Key == selectedKey) {
        selectedDesc = element.Value;
      }
    });

    this.selectedNatureOfCompId = selectedKey;
    this.selectedNatureOfCompDesc = selectedDesc;
  }

  public addItemModalErrorFlag: boolean = false;
  public natOfCompOtherKey: any = {
    '44': true,//Others,comp-type-->'5'-Others
    '49': true,//Others,comp-type-->'1'-Product Related
    '62': true,//Others,comp-type-->'2'-Jointing Related
    '66': true,//Others,comp-type-->'4'-Supply Related
    '70': true,//Marking & Stenciling,comp-type-->'14'-Document Related
    '71': true,//Others,comp-type-->'14'-Document Related
    '76': true,//Others,comp-type-->'15'-PE Sleeve Related
    '81': true//Others,comp-type-->'16'-Handling & set up at customer side
  };

  public addItemAtInv() {
    if (this.natOfCompOtherKey[this.selectedNatureOfCompId] && !this.itemListNatOfCmpFormGroup.value['complainDetail']) {
      this.addItemModalErrorFlag = true;
    } else {
      this.addItemModalErrorFlag = false;
      for (let itemSelect in this.itemListFormGroup.value) {
        if (this.itemListFormGroup.value[itemSelect]) {
          this.allInvItemDetByCustomerCode.forEach((invItemAddEl) => {
            if (itemSelect == invItemAddEl.formKey) {

              let itemDetails: any = {};
              for (let k in invItemAddEl) {
                itemDetails[k] = invItemAddEl[k];
              }
              let complaintTypeId = '' + this.selectedComplainTypeId;
              let complaintTypeDesc = '' + this.selectedComplainTypeDesc;
              let natureOfComplaintId = '' + this.selectedNatureOfCompId;

              if (this.selectedNatureOfCompId == '44') {
                this.natureOfComDropDownList.forEach(el => {
                  if (el.Key == this.selectedNatureOfCompId) {
                    this.selectedNatureOfCompDesc = el.Value;
                  }//end of if                
                });
              }//end of if
              let natureOfComplaintDesc = '' + this.selectedNatureOfCompDesc;
              let complainDetails = this.itemListNatOfCmpFormGroup.value['complainDetail'];

              itemDetails.complaintTypeId = complaintTypeId;
              itemDetails.complaintTypeDesc = complaintTypeDesc;
              itemDetails.natureOfComplaintId = natureOfComplaintId;
              itemDetails.natureOfComplaintDesc = natureOfComplaintDesc;
              itemDetails.complaintDetails = complainDetails ? complainDetails : '';
              let itemKey = this.selectedComplainTypeId + this.selectedNatureOfCompId + '|' +
                itemDetails.formKey;
              this.selectedInvItemDetailsObj[itemKey] ? null :
                this.selectedInvItemDetailsObj[itemKey] = itemDetails;

            }
          });
        }
      }
      this.selectedInvItemDetails = [];
      for (let element in this.selectedInvItemDetailsObj) {
        this.selectedInvItemDetails.push(this.selectedInvItemDetailsObj[element]);
      }
      this.resetAddItemData();
      this.toggleAddInvItemModal();
    }//end of else
  }

  public cancelAddItemModal() {
    this.resetAddItemData();
    this.toggleAddInvItemModal();
  }

  private resetAddItemData() {
    this.itemListNatOfCmpFormGroup.controls['complainType'].setValue('');
    this.itemListNatOfCmpFormGroup.controls['natOfComplain'].setValue('');
    this.itemListNatOfCmpFormGroup.controls['complainDetail'].setValue('');
    this.selectedComplainTypeId = '';
    this.selectedNatureOfCompId = '';    
    if (this.itemListFormGroup && this.itemListFormGroup.controls) {
      for (let fc in this.itemListFormGroup.controls) {
        this.itemListFormGroup.controls[fc].setValue(false);
      }
    }
    this.itemListFormGroup.markAsPristine();
  }


}//end of class