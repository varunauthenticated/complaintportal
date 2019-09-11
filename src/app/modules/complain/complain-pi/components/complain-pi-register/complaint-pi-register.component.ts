import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { ComplaintPIRegisterDataService } from "../../services/complaint-pi-register-data.service";
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { NgbdComplaintPIRegisterModalComponent } from './complaint-pi-register-modal/complaint-pi-register-modal.component';
import { ComplaintPIRegisterEmitService } from "../../services/complaint-pi-register-emit.service";
import { InvoiceSearchDetailsModel } from "../../models/invoice-search-details.model";
import { PIPolygonModel } from "../../../../shared/components/process-flow/complain-pi-polygon.model";
import { SessionErrorService } from "../../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-complaint-pi-register-form',
  templateUrl: 'complaint-pi-register.component.html',
  styleUrls: ['complaint-pi-register.component.css']
})
export class ComplaintPIRegisterComponent implements OnInit {

  private totalFileSize: number = 0;//file size
  private fileSizeLimit: number = 104857600;//limit of file
  public title: string = "Complaint Register";
  public complaintRegisterFormGroup: FormGroup;
  public modeOfReceiptDropDownList: any = [];
  public complaintLoggedByDropDownList: any = [];
  public complaintTypeDropDownList: any = [];
  public natureOfComDropDownList: any = [];
  public severityIndexRatingsDownList: any = [];
  public complaintReceivedByDownList: any = [];
  public items: any[] = [];
  public complaintTypeId: string;
  public natureCmpName: string;
  public complaintReceivedByOther: string = this.localStorageService.appSettings.complaintReceivedByOther;
  public fileActivityId: number = this.localStorageService.appSettings.complaintRegistrationActivityId;

  //this variables are used for Complaint Logged On and Compliant Reference Date validation
  public complaintReferenceDt: string = "Info";
  public loggedOnDt: string = "Info";
  public loggedOnDate: string;
  public complaintReferenceDate: string;
  public controlName: string;

  public currentDate: string;
  public currentDtloggedOnDt = "Info";
  public currentDtComplaintReferenceDt = "Info";
  public cmplntRefDtLoggedOnDtDiff = "Info";
  public loggedOnDtCmplntRefDtDiff = "Info";
  public cmplntRefDtLoggedOnDtDiffZero = "Info";
  public loggedOnDtCmplntRefDtDiffZero = "Info";
  public diffBetwnCmplntRefDtAndLoggedOnDt: number;
  public submitButtonEnable: boolean = true;


  public complaintReferenceNo: string = "";//to get complaint reference no from route param
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  

  public selectedItemDetails: any[] = [];


  //error msg
  public complaintDetailsEnable: boolean = false;

  //for modify complaint pi
  public invoiceDateForModify: string = "";
  public contactPersonNameForModify: string = "";
  public contactPersonPhoneNoForModify: string = "";
  public contactPersonEmailIdForModify: string = "";
  public complaintTypeIdForModify: string = "";
  public natureOfComplaintIdForModify: string = "";
  public complaintDetailsForModify: string = "";
  public loggedByForModify: string = "";
  public loggedOnDtForModify: string = "";
  public modeId: string = "";
  public repeatedComplaintValue: string = "";
  public modeReferenceNoForModify: string = "";
  public severityIndexRatingForModify: string = "";
  public previousComplaintReferenceNoForModify: string = "";
  public complaintReceivedById: string = "";
  public complaintReceivedByName: string = "";
  public complaintReceivedByPhoneNo: string = "";
  public departmentNameOther: string = "";


  //to store  selected items grid row
  public selectedItemsGrid: any[] = [];
  

  //to store the itemsHeader
  public itemsHeader: any = {};

  // form data for file upload
  private formData: FormData = new FormData();
  private fileData: FormData;
  public fileList: FileList;

  //for commercial settlement radio button value
  public requiredCommercialSettlementInComplaintRegistrationForModify: string = "";

  //for complaint qty error
  public complaintQtyInTonsError: boolean = true;


  public custCode: string = "";
  public custName: string = "";
  public custSegment: string = "";
  public salesGroup: string = "";
  public salesOffice: string = "";

  //to store the maxlength from localstorage
  public departmentNameOtherLength: number = this.localStorageService.dbSettings.departmentNameOther;
  public complaintReceivedByNameLength: number = this.localStorageService.dbSettings.complaintReceivedByName;
  public complaintReceivedByPhoneNoLength: number = this.localStorageService.dbSettings.complaintReceivedByPhoneNo;
  public modeReferenceNoLength: number = this.localStorageService.dbSettings.modeReferenceNo;
  public invoiceNoLength: number = this.localStorageService.dbSettings.invoiceNo;
  public contactPersonNameLength: number = this.localStorageService.dbSettings.contactPersonName;
  public contactPersonPhoneNoLength: number = this.localStorageService.dbSettings.contactPersonPhoneNo;
  public contactPersonEmailIdLength: number = this.localStorageService.dbSettings.contactPersonEmailId;
  public complaintDetailsLength: number = this.localStorageService.dbSettings.complaintDetails;
  public previousComplaintReferenceNoLength: number = this.localStorageService.dbSettings.previousComplaintReferenceNo;
  //var to check index for process flow
  public processFlowPageIndex: number = 0;
  public processFlowData: string[] = [];
  //for busy spinner
  public busySpinner: any = {
    dropdownBusy: true,
    itemsBusy: true,
    compEditBusy: false,//for edit comp webservice
    natureOfCompdropdownBusy: false,//for nature of complaint dropdown
    submitBusy: false,//for submit spinner
    busy: true
  };

  public resMsgType: string = "Info";//for showing error msg in html page
  public errorConst: string = "Error";//error constant
  public infoConstant: string = "Info";//info constant
  public resErrorMsg: string;


  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private invoiceSearchDetailsModel: InvoiceSearchDetailsModel,
    private complaintPIRegisterDataService: ComplaintPIRegisterDataService,
    private complaintPIRegisterEmitService: ComplaintPIRegisterEmitService,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private modalService: NgbModal) {

   
  }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
    });
    console.log("complaintReferenceNo for modify Complaint pi: ", this.complaintReferenceNo);
    this.processFlowData = new PIPolygonModel().validRootCaus;//set the process flow step from model

    // this.toastService.toastElementRef.info('Complaint Register!', 'Info!');
    this.buildForm();
    this.getSelectValues();
    this.getItemsVal("ispl");

    //calling event emit service method
    this.getModalResultEventEmitter();
    this.getItemsHeaderEventEmitter();
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.loggedOnDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.complaintRegisterFormGroup.controls["loggedOnDt"].setValue(this.loggedOnDate);
    this.complaintReferenceDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.complaintRegisterFormGroup.controls["complaintReferenceDt"].setValue(this.complaintReferenceDate);
    console.log("  di cmp: this.loggedOnDt   ", this.loggedOnDate);

    //getting diffBetwnCmplntRefDtAndLoggedOnDt from localStorage
    this.diffBetwnCmplntRefDtAndLoggedOnDt = this.localStorageService.appSettings.diffBetwnCmplntRefDtAndLoggedOnDt;

    //initializing nature of complaint dropdown 
    this.natureOfComDropDownList = [
      { Key: '', Value: '-- Select --' }
    ]
    for (let natureCmp of this.natureOfComDropDownList) {
      if (natureCmp.Key == "") {
        this.complaintRegisterFormGroup.controls["natureOfComplaintId"].setValue(natureCmp.Key);
        break;
      }//end if
    }//end for

   

    //if complaintReferenceNo isn't equal to blank then getComplaintReferenceDetails will be invoked
    if (this.complaintReferenceNo != "") {
      this.submitButtonEnable = true;
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }//end of if

    console.log(" invoiceDetails===>", this.invoiceSearchDetailsModel.invoiceDetails);

    let invDet: any;

    console.log("this.complaintDIInvoiceDetailsService.testVar=====>>>>>>>>>",this.invoiceSearchDetailsModel.testVar)
    if(!this.invoiceSearchDetailsModel.testVar){
      this.clearInvDetService();
    }


    //invoice Search deatails model value is not undefined then setInvDet method will be invoked
    if (this.invoiceSearchDetailsModel && this.invoiceSearchDetailsModel.invoiceDetails) {
      invDet = this.invoiceSearchDetailsModel.invoiceDetails;
      this.setInvDet(invDet);
    }//end of if


    //if selected items grid length is greater than zero setSelectItemsGrid method will invoked
    if (this.invoiceSearchDetailsModel && this.invoiceSearchDetailsModel.selectedItemDetails) {
      let selItemsDet = this.invoiceSearchDetailsModel.selectedItemDetails;
      //for setting selected items grid row
      this.setSelectItemsGrid(selItemsDet);
    }//end of if

    this.complaintQtyErrorCheck();




  }//end of onInit


  //start method getItemsVal
  public getItemsVal(invoiceNo) {
    this.complaintPIRegisterDataService.getInvoiceDetails(invoiceNo).
      subscribe(res => {
        //getting the items object array for webservice and initialing it to a publically defind array named items 
        this.itemsHeader = res.invoiceDetails.itemsHeader;
        this.busySpinner.itemsBusy = false;//to stop the spinner
        this.updateBusySpinner();//method to stop the spinner      
      },
      err => {
        console.log(err);
        this.busySpinner.itemsBusy = false;//to stop the spinner
        this.updateBusySpinner();//method to stop the spinner  
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end method of getItemsVal

  //method to get all values from complaintRegisterDataService  
  private getSelectValues() {
    let selectedValuesBusySpinner: any = {
      receiptModeBusy: true,
      loggedbyBusy: true,
      severityIndexRatingBusy: true,
      complaintTypeBusy: true,
      complaintReceivedBy: true
    };
    //getting all values of ReceiptMode
    this.complaintPIRegisterDataService.getSelectValReceiptMode().
      subscribe(res => {
        this.modeOfReceiptDropDownList = res.details;
        selectedValuesBusySpinner.receiptModeBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();//call the method
        for (let receipt of this.modeOfReceiptDropDownList) {
          if (this.modeId == "" || this.modeId == undefined) {
            if (receipt.Key == "") {
              this.complaintRegisterFormGroup.controls["modeId"].setValue(receipt.Key);
              break;
            }//end if
          }//end of if
        }//end for
      },
      err => {
        console.log(err);
        selectedValuesBusySpinner.receiptModeBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });
    //getting all values of LoggedBy
    this.complaintPIRegisterDataService.getSelectValLoggedBy().
      subscribe(res => {
        this.complaintLoggedByDropDownList = res.details;
        selectedValuesBusySpinner.loggedbyBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        for (let cmpLoggedBy of this.complaintLoggedByDropDownList) {
          if (cmpLoggedBy.Key == this.localStorageService.user.employeeId) {
            this.complaintRegisterFormGroup.controls["loggedBy"].setValue(cmpLoggedBy.Key);
            break;
          }
        }//end for
      },
      err => {
        console.log(err);
        selectedValuesBusySpinner.loggedbyBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });
    //getting all values of SeverityIndexRatings
    this.complaintPIRegisterDataService.getSelectValSeverityIndexRatings().
      subscribe(res => {
        this.severityIndexRatingsDownList = res.details;
        selectedValuesBusySpinner.severityIndexRatingBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        for (let severityIndexRatings of this.severityIndexRatingsDownList) {
          if (this.severityIndexRatingForModify == "" || this.severityIndexRatingForModify == undefined) {
            if (severityIndexRatings.Key == "") {
              this.complaintRegisterFormGroup.controls["severityIndexRating"].setValue(severityIndexRatings.Key);
              break;
            }//end if
          }//end if
        }//end for
      },
      err => {
        console.log(err);
        selectedValuesBusySpinner.severityIndexRatingBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });

    //getting all values of complaintType
    this.complaintPIRegisterDataService.getSelectComplaintType().
      subscribe(res => {
        this.complaintTypeDropDownList = res.details;
        selectedValuesBusySpinner.complaintTypeBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        for (let cmpType of this.complaintTypeDropDownList) {
          if (this.complaintTypeIdForModify == "" || this.complaintTypeIdForModify == undefined) {
            if (cmpType.Key == "") {
              this.complaintRegisterFormGroup.controls["complaintTypeId"].setValue(cmpType.Key);
              break;
            }//end if
          }//end of if
        }//end for
      },
      err => {
        console.log(err);
        selectedValuesBusySpinner.complaintTypeBusy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });

    //getting all values of complaintType
    this.complaintPIRegisterDataService.getSelectValComplainReceivedBy().
      subscribe(res => {
        this.complaintReceivedByDownList = res.details;
        selectedValuesBusySpinner.complaintReceivedBy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        for (let cmpRcvdBy of this.complaintReceivedByDownList) {
          if (this.complaintReceivedById == undefined || this.complaintReceivedById == "") {
            if (cmpRcvdBy.Key == "") {
              this.complaintRegisterFormGroup.controls["complaintReceivedById"].setValue(cmpRcvdBy.Key);
              break;
            }//end if
          }//end of if
        }//end for
      },
      err => {
        console.log(err);
        selectedValuesBusySpinner.complaintReceivedBy = false;//to stop spinner
        selectedValuesUpdateSpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });
    // method to stop selected spinner
    let selectedValuesUpdateSpinner = (): any => {
      if (selectedValuesBusySpinner.receiptModeBusy == false &&
        selectedValuesBusySpinner.loggedbyBusy == false &&
        selectedValuesBusySpinner.severityIndexRatingBusy == false &&
        selectedValuesBusySpinner.complaintTypeBusy == false &&
        selectedValuesBusySpinner.complaintReceivedBy == false) {
        this.busySpinner.dropdownBusy = false;
        this.updateBusySpinner();
      }//end of if
    }//end of selected spinner method to stop the spinner

  }//end method getSelectValues
 
  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.dropdownBusy || this.busySpinner.itemsBusy || this.busySpinner.compEditBusy || this.busySpinner.natureOfCompdropdownBusy || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if(this.busySpinner.dropdownBusy == false  && this.busySpinner.itemsBusy == false && this.busySpinner.compEditBusy == false && this.busySpinner.natureOfCompdropdownBusy== false && this.busySpinner.submitBusy== false){
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method


  //a method named buildform for creating the complaintRegisterFormGroup and its formControl
  private buildForm(): void {
    this.complaintRegisterFormGroup = this.formBuilder.group({
      'modeId': [''
        , [
          Validators.required,
        ]
      ],
      'complaintReferenceDt': [''
      ],
      'modeReferenceNo': [''
      ],
      'invoiceNo': [''
        // , [
        //   Validators.required,
        // ]
      ],
      'contactPersonName': [''
      ],
      'contactPersonPhoneNo': [''
      ],
      'contactPersonEmailId': [''
      ],
      'loggedBy': [''
      ],
      'loggedOnDt': [''
      ],
      'complaintTypeId': [''
        , [
          Validators.required,
        ]
      ],
      'natureOfComplaintId': [''
        , [
          Validators.required,
        ]
      ],
      'severityIndexRating': [''
        , [
          Validators.required,
        ]
      ],
      'complaintReceivedById': [''
        , [
          Validators.required,
        ]
      ],
      'departmentNameOther': [''],
      'complaintReceivedByName': [''
        , [
          Validators.required,
        ]
      ],
      'complaintReceivedByPhoneNo': [''
        , [
          Validators.required,
        ]
      ],
      'complaintDetails': [''
      ],
      'itemNos': [''
      ],
      'repeatedComplaint': [''
        , [
          Validators.required,
        ]
      ],
      'previousComplaintReferenceNo': [''
      ],
      'requiredCommercialSettlementInComplaintRegistration': [''
        , [
          Validators.required,
        ]
      ]
    });
  }//end of method buildForm


  //onOpenModal for opening modal from modalService
  private onOpenModal(complaintRefNo) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
    modalRef.componentInstance.modalMessage =
      this.complaintReferenceNo ?
        "Complaint Reference Number(PI) " + complaintRefNo + " updated successfully."
        : "Complaint Reference Number(PI) " + complaintRefNo + " created successfully.";
  }
  //end of method onOpenModal

  //start method tableGridDataConverterFromRes for creating table grid json array from res 
  private tableGridDataConverterFromRes(resItemsParam) {
    let disInvNoArr: string[] = [];
    let selectedItem: any[] = [];
    let invNo: string = "";
    let itemDets: any = {};
    for (let selectedDetRes of resItemsParam) {
      if (disInvNoArr.length == 0) {
        disInvNoArr.push(selectedDetRes.invoiceNo);
        invNo = selectedDetRes.invoiceNo;
      } else {
        if (disInvNoArr.includes(selectedDetRes.invoiceNo) == false) {
          disInvNoArr.push(selectedDetRes.invoiceNo);
        }
      }
    }
    console.log(" disInvNoArr ====>", disInvNoArr);
    disInvNoArr.forEach(invNo => {
      resItemsParam.forEach(selectedDetRes => {
        if (invNo == selectedDetRes.invoiceNo) {
          selectedItem.push(selectedDetRes);
        }

      });
      if (selectedItem.length > 0) {
        //calling invMapArr method
        this.invMapArr(invNo, selectedItem);
        selectedItem = [];
      }

    });
  }
  // end method tableGridDataConverterFromRes

  //start method invMapArr
  private invMapArr(invNo, selectedItem) {
    let itemDets: any = {};
    itemDets.selectedItem = selectedItem;
    this.selectedItemDetails.push({ key: invNo, value: itemDets });
    console.log(" this.selectedItemDetails=====.>>>>>>  ", this.selectedItemDetails);
  }//end of the method invMapArr

  // start method onChangeModeOfRecptOfCom
  public onChangeModeOfRecptOfCom(modeId) {
    this.modeId = modeId;
    console.log(" modeId ", modeId);
    if (this.modeId == '1') {
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValidators(null);
      this.complaintRegisterFormGroup.get('modeReferenceNo').updateValueAndValidity();
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValue("");
      this.complaintRegisterFormGroup.get('modeReferenceNo').markAsUntouched();
      this.modeReferenceNoForModify = "";
    } else if (this.modeId == '2') {
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValidators(Validators.required);
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValue(this.modeReferenceNoForModify);
    } else if (this.modeId == '3') {
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValidators(null);
      this.complaintRegisterFormGroup.get('modeReferenceNo').updateValueAndValidity()
      this.complaintRegisterFormGroup.get('modeReferenceNo').setValue("");
      this.complaintRegisterFormGroup.get('modeReferenceNo').markAsUntouched();
      this.modeReferenceNoForModify = "";

    }
  }
  // end method onChangeModeOfRecptOfCom


  //start method setInvDetsForInvNoSearch for storing the invoice Details to invoice details model
  private setInvDetsForInvNoSearch() {
    console.log(this.complaintRegisterFormGroup.value);
    if(this.complaintReferenceNo != undefined || this.complaintReferenceNo !=""){
      this.invoiceSearchDetailsModel.compRefNo = this.complaintReferenceNo;
    }
    let invDet: any = {};
    invDet.complaintReceivedById = this.complaintRegisterFormGroup.value.complaintReceivedById;
    invDet.departmentNameOther = this.complaintRegisterFormGroup.value.departmentNameOther;
    invDet.complaintReceivedByName = this.complaintRegisterFormGroup.value.complaintReceivedByName;
    invDet.complaintReceivedByPhoneNo = this.complaintRegisterFormGroup.value.complaintReceivedByPhoneNo;
    invDet.modeId = this.complaintRegisterFormGroup.value.modeId;
    invDet.modeReferenceNo = this.complaintRegisterFormGroup.value.modeReferenceNo;

    invDet.complaintReferenceDt = this.complaintRegisterFormGroup.value.complaintReferenceDt;
    invDet.contactPersonName = this.complaintRegisterFormGroup.value.contactPersonName;
    invDet.contactPersonPhoneNo = this.complaintRegisterFormGroup.value.contactPersonPhoneNo;
    invDet.contactPersonEmailId = this.complaintRegisterFormGroup.value.contactPersonEmailId;
    invDet.complaintTypeId = this.complaintRegisterFormGroup.value.complaintTypeId;
    invDet.natureOfComplaintId = this.complaintRegisterFormGroup.value.natureOfComplaintId;
    invDet.complaintDetails = this.complaintRegisterFormGroup.value.complaintDetails;
    invDet.repeatedComplaint = this.complaintRegisterFormGroup.value.repeatedComplaint;
    invDet.previousComplaintReferenceNo = this.complaintRegisterFormGroup.value.previousComplaintReferenceNo;
    invDet.requiredCommercialSettlementInComplaintRegistration = this.complaintRegisterFormGroup.value.requiredCommercialSettlementInComplaintRegistration;
    invDet.severityIndexRating = this.complaintRegisterFormGroup.value.severityIndexRating;

    this.invoiceSearchDetailsModel.invoiceDetails = invDet;

    let items: any[] = [];
    items = this.selectedItemsGrid;

    let selectedItemsDet: any = {};

    selectedItemsDet.items = items;
    this.invoiceSearchDetailsModel.selectedItemDetails = selectedItemsDet;

    for (let selItm of this.selectedItemsGrid) {
      this.custCode = selItm.customerCode;
      this.custName = selItm.customerName;
      this.salesGroup = selItm.salesGroup;
      this.salesOffice = selItm.salesOffice;
      break;
    }

    this.invoiceSearchDetailsModel.title = this.title;
    this.invoiceSearchDetailsModel.custCode = this.custCode;
    this.invoiceSearchDetailsModel.custName = this.custName;
    this.invoiceSearchDetailsModel.salesGroup = this.salesGroup;
    this.invoiceSearchDetailsModel.salesOffice = this.salesOffice;
    this.invoiceSearchDetailsModel.testVar = "data stored";
  }//end of the method setInvDetsForInvNoSearch

  // start method setInvDet for setting invDet from invoiceDetails model
  private setInvDet(invDetParam) {
    let invDet = invDetParam;
    if(this.invoiceSearchDetailsModel && this.invoiceSearchDetailsModel.compRefNo){
      this.complaintReferenceNo = this.invoiceSearchDetailsModel.compRefNo;
    }
    if(this.complaintReferenceNo != "" || this.complaintReferenceNo != undefined){
      this.submitButtonEnable = true;
    }
    this.complaintReceivedById = invDet.complaintReceivedById
    if (this.complaintReceivedById) {
      this.complaintRegisterFormGroup.controls["complaintReceivedById"].setValue(this.complaintReceivedById);
    }

    this.departmentNameOther = invDet.departmentNameOther;
    if (this.departmentNameOther) {
      this.complaintRegisterFormGroup.controls["departmentNameOther"].setValue(this.departmentNameOther);
    }

    this.complaintReceivedByName = invDet.complaintReceivedByName;
    if (this.complaintReceivedByName) {
      this.complaintRegisterFormGroup.controls["complaintReceivedByName"].setValue(this.complaintReceivedByName);
    }

    this.complaintReceivedByPhoneNo = invDet.complaintReceivedByPhoneNo;
    if (this.complaintReceivedByPhoneNo) {
      this.complaintRegisterFormGroup.controls["complaintReceivedByPhoneNo"].setValue(this.complaintReceivedByPhoneNo);
    }

    this.complaintReferenceDate = invDet.complaintReferenceDt;
    if (this.complaintReferenceDate) {
      this.complaintRegisterFormGroup.controls["complaintReferenceDt"].setValue(this.complaintReferenceDate);
    }

    this.modeId = invDet.modeId;
    if (this.modeId) {
      this.complaintRegisterFormGroup.controls["modeId"].setValue(this.modeId);
    }


    this.modeReferenceNoForModify = invDet.modeReferenceNo;
    if (this.modeReferenceNoForModify) {
      this.complaintRegisterFormGroup.controls["modeReferenceNo"].setValue(this.modeReferenceNoForModify);
    }

    this.complaintTypeIdForModify = invDet.complaintTypeId;
    this.natureOfComplaintIdForModify = invDet.natureOfComplaintId;
    if (this.complaintTypeIdForModify) {
      this.complaintRegisterFormGroup.controls["complaintTypeId"].setValue(this.complaintTypeIdForModify);
      if (this.natureOfComplaintIdForModify) {
        this.onComplaintTypeSelect(this.complaintTypeIdForModify, this.natureOfComplaintIdForModify);
      } else {
        this.onComplaintTypeSelect(this.complaintTypeIdForModify);
      }
    }

    this.contactPersonNameForModify = invDet.contactPersonName;
    if (this.contactPersonNameForModify) {
      this.complaintRegisterFormGroup.controls["contactPersonName"].setValue(this.contactPersonNameForModify);
    }

    this.contactPersonPhoneNoForModify = invDet.contactPersonPhoneNo;
    if (this.contactPersonPhoneNoForModify) {
      this.complaintRegisterFormGroup.controls["contactPersonPhoneNo"].setValue(this.contactPersonPhoneNoForModify);
    }

    this.contactPersonEmailIdForModify = invDet.contactPersonEmailId;
    if (this.contactPersonEmailIdForModify) {
      this.complaintRegisterFormGroup.controls["contactPersonEmailId"].setValue(this.contactPersonEmailIdForModify);
    }

    this.severityIndexRatingForModify = invDet.severityIndexRating;
    if (this.severityIndexRatingForModify) {
      this.complaintRegisterFormGroup.controls["severityIndexRating"].setValue(this.severityIndexRatingForModify);
    }

    this.complaintDetailsForModify = invDet.complaintDetails;
    if (this.complaintDetailsForModify) {
      this.complaintRegisterFormGroup.controls["complaintDetails"].setValue(this.complaintDetailsForModify);
    }

    this.repeatedComplaintValue = invDet.repeatedComplaint;
    if (this.repeatedComplaintValue) {
      this.complaintRegisterFormGroup.controls["repeatedComplaint"].setValue(this.repeatedComplaintValue);
    }

    this.previousComplaintReferenceNoForModify = invDet.previousComplaintReferenceNo;
    if (this.previousComplaintReferenceNoForModify) {
      this.complaintRegisterFormGroup.controls["previousComplaintReferenceNo"].setValue(this.previousComplaintReferenceNoForModify);
    }

    this.requiredCommercialSettlementInComplaintRegistrationForModify = invDet.requiredCommercialSettlementInComplaintRegistration;
    if (this.requiredCommercialSettlementInComplaintRegistrationForModify) {
      this.complaintRegisterFormGroup.controls["requiredCommercialSettlementInComplaintRegistration"].setValue(this.requiredCommercialSettlementInComplaintRegistrationForModify);
    }

    //setting the invoiceDetails value as blank
    this.invoiceSearchDetailsModel.invoiceDetails = "";

  }//end of the method setInvDet


  private setSelectItemsGrid(selItemsDetParam) {
    if (selItemsDetParam.items.length != 0) {
      let items: any[] = selItemsDetParam.items;

      for (let selItm of items) {
        this.custCode = selItm.customerCode;
        this.custName = selItm.customerName;
        this.custSegment = selItm.customerSegment;
        this.salesGroup = selItm.salesGroup;
        this.salesOffice = selItm.salesOffice;
        this.contactPersonNameForModify = selItm.customerContactPersonName;
        this.contactPersonPhoneNoForModify = selItm.customerContactPersonPhoneNo;
        this.contactPersonEmailIdForModify = selItm.customerContactPersonEmailId;
        break;
      }
      this.invoiceSearchDetailsModel.custCode = this.custCode;
      this.invoiceSearchDetailsModel.custName = this.custName;
      this.invoiceSearchDetailsModel.salesGroup = this.salesGroup;
      this.invoiceSearchDetailsModel.salesOffice = this.salesOffice;
      //storing the inv details which are selected
      this.selectedItemsGrid = items;

      //calling  method tableGridDataConverterFromRes for creating table grid json array from res and passing the res as parameter
      this.tableGridDataConverterFromRes(this.selectedItemsGrid);
    }//end of if
  }

  //for clicking submit button this method will be invoked
  public onComplainSubmit(): void {
    console.log(this.complaintRegisterFormGroup.value);
    let complaintPiRegDet: any = {};
    complaintPiRegDet.complaintReceivedById = this.complaintRegisterFormGroup.value.complaintReceivedById;
    complaintPiRegDet.departmentNameOther = this.complaintRegisterFormGroup.value.departmentNameOther;
    complaintPiRegDet.complaintReceivedByName = this.complaintRegisterFormGroup.value.complaintReceivedByName;
    complaintPiRegDet.complaintReceivedByPhoneNo = this.complaintRegisterFormGroup.value.complaintReceivedByPhoneNo;
    complaintPiRegDet.modeId = this.complaintRegisterFormGroup.value.modeId;
    complaintPiRegDet.complaintReferenceDt = this.complaintRegisterFormGroup.value.complaintReferenceDt;
    complaintPiRegDet.modeReferenceNo = this.complaintRegisterFormGroup.value.modeReferenceNo;
    complaintPiRegDet.contactPersonName = this.complaintRegisterFormGroup.value.contactPersonName;
    complaintPiRegDet.contactPersonPhoneNo = this.complaintRegisterFormGroup.value.contactPersonPhoneNo;
    complaintPiRegDet.contactPersonEmailId = this.complaintRegisterFormGroup.value.contactPersonEmailId;
    complaintPiRegDet.loggedBy = this.complaintRegisterFormGroup.value.loggedBy;
    complaintPiRegDet.loggedOnDt = this.complaintRegisterFormGroup.value.loggedOnDt;
    complaintPiRegDet.complaintTypeId = this.complaintRegisterFormGroup.value.complaintTypeId;
    complaintPiRegDet.natureOfComplaintId = this.complaintRegisterFormGroup.value.natureOfComplaintId;
    complaintPiRegDet.complaintDetails = this.complaintRegisterFormGroup.value.complaintDetails;
    complaintPiRegDet.repeatedComplaint = this.complaintRegisterFormGroup.value.repeatedComplaint;
    complaintPiRegDet.previousComplaintReferenceNo = this.complaintRegisterFormGroup.value.previousComplaintReferenceNo;
    complaintPiRegDet.severityIndexRating = this.complaintRegisterFormGroup.value.severityIndexRating;
    complaintPiRegDet.requiredCommercialSettlementInComplaintRegistration = this.complaintRegisterFormGroup.value.requiredCommercialSettlementInComplaintRegistration;

    let selectedItemObj: any[] = [];
    for (let selectedDet of this.selectedItemDetails) {
      for (let selItem of selectedDet.value.selectedItem) {
        selectedItemObj.push(selItem);
      }
    }
    let itemNos: any = {};
    itemNos.items = selectedItemObj;
    console.log("itemNos.items: ", itemNos.items);
    complaintPiRegDet.itemNos = itemNos;
    console.log(" complaintPiRegDet.itemNos", complaintPiRegDet.itemNos);
    if (this.complaintReferenceNo != '' || this.complaintReferenceNo != null) {
      complaintPiRegDet.complaintReferenceNo = this.complaintReferenceNo;
    }
    console.log("complaintPiRegDet submit val =====>", complaintPiRegDet);
    console.log("this.totalFileSize on submit method:::::::::::", this.totalFileSize);
    if (this.totalFileSize > this.fileSizeLimit) {
      this.resMsgType = this.errorConst;
      this.resErrorMsg = "File size should be within 100 mb !";
    } else {
      let complaintPiRegDetJsonArr: any[] = [];

      complaintPiRegDetJsonArr.push(JSON.stringify(complaintPiRegDet));

      this.formData.append("complaintRegisterDet", complaintPiRegDetJsonArr.toString());

      console.log("complaintPiRegDetJsonArr =====>>>>", complaintPiRegDetJsonArr.toString());
      //method to add or update preli
      if (this.fileData != undefined) {
        for (let i: number = 0; i < this.fileList.length; i++) {
          console.log(" file upload", this.fileData.get('uploadFile' + i.toString()));
          if (this.fileData.get('uploadFile' + i.toString()) != null) {
            this.formData.append('uploadFile' + i.toString(), this.fileData.get('uploadFile' + i.toString()));
          }
        }//end of for
      }//end of if fileData is !undefined

      this.formData.append('Accept', 'application/json');
      this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
      this.formData.append('menuId', 'DEFAULT1');
      this.formData.append('userId', this.localStorageService.user.userId);

      let formDataObj: any = {};
      formDataObj = this.formData;
      console.log("pi formDataObj====>>>>", formDataObj);

      let methodForAddOrEditPi: any;
      methodForAddOrEditPi = this.complaintReferenceNo ?
        this.complaintPIRegisterDataService.complaintUpdate(formDataObj) :
        this.complaintPIRegisterDataService.complainSubmit(formDataObj);
      this.busySpinner.submitBusy = true;
      this.updateBusySpinner();
      methodForAddOrEditPi.
        subscribe(res => {
          console.log("pi Success Response: ", res);
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          if (res.msgType == "Info") {
            this.resMsgType = res.msgType;
            complaintPiRegDet.complaintReferenceNo = res.value;
            this.clearInvDetService();
            //calling onOpenModal for opening modal
            this.onOpenModal(complaintPiRegDet.complaintReferenceNo);
            this.router.navigate([ROUTE_PATHS.RouteHome]);
          } else {
            this.resMsgType = this.errorConst;
            this.resErrorMsg = "Sorry! Save data fail. Please try again";
            this.formData = new FormData();//to create new instance of formdata
          }//end of else
        }, err => {
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          if (err.status == 401) {
            this.resErrorMsg = "Sorry! Unable to save data.Please try again";
          } else {
            this.resErrorMsg = "Netowrk/Server Problem";
          }//end of else
          this.formData = new FormData();//to create new instance of formdata
          this.sessionErrorService.routeToLogin(err._body);
        });
    }//end of else

  }//end of onComplaintSubmit method

  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.clearInvDetService();
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method

  //onOpenModal for opening modal from modalService
  public onInvoiceNoOpenModal(invoiceNo: string) {
    const modalRef = this.modalService.open(NgbdComplaintPIRegisterModalComponent);
    modalRef.componentInstance.modalTitle = this.title;
    modalRef.componentInstance.invoiceNo = invoiceNo;
    modalRef.componentInstance.items = this.items;
    if (invoiceNo == '') {
      this.setInvDetsForInvNoSearch();
      modalRef.componentInstance.custCode = this.custCode;
      modalRef.componentInstance.custName = this.custName;
    } else if (invoiceNo!='') {
      this.invoiceSearchDetailsModel.selectedItemDetails = this.selectedItemsGrid;
      console.log("selected grid in pi reg====>>>>>",this.invoiceSearchDetailsModel.selectedItemDetails);
    }
  }
  //end of method onOpenModal


  //method to refesh the grid after closing the modal
  private getModalResultEventEmitter() {
    this.complaintPIRegisterEmitService.getModalResultEventEmitter().
      subscribe(selectedItemDetailsRes => {
        console.log(" eventEmitter res : ", selectedItemDetailsRes);
        if (this.selectedItemDetails.length == 0) {
          for (let selectedDetRes of selectedItemDetailsRes) {
            this.selectedItemDetails.push({ key: selectedDetRes.key, value: selectedDetRes.value });
          }//end of for
        } else {
          for (let selectedDetRes of selectedItemDetailsRes) {
            this.getDistinctKeyValuePairOfSelectedItmsGrid(selectedDetRes)
          }//end of for 
        }//end of else
        if (this.selectedItemDetails.length > 0) {
          this.setCustInforOnEventEmit(this.selectedItemDetails);
        }
      },
      err => {
        console.log(err);
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of event emiiter result

  //start method for getting distinct key value pair map of selected item grid 4.11.17
  getDistinctKeyValuePairOfSelectedItmsGrid(selectedDetRes: any) {
    let prevKey: string = "";
    let lastKey: string = "";
    for (let selectedDet of this.selectedItemDetails) {
      if (selectedDetRes.key == selectedDet.key) {
        let selectedItemFromRes: any[] = selectedDetRes.value.selectedItem;
        let selectedItemInPiReg: any[] = selectedDet.value.selectedItem;
        if (selectedItemFromRes.length > 0) {
          selectedDet.value.selectedItem = [];
          selectedDet.value.selectedItem = selectedItemFromRes;
          break;
        }
      } else if (selectedDetRes.key != selectedDet.key) {
        prevKey = selectedDet.key;
        lastKey = this.selectedItemDetails[this.selectedItemDetails.length - 1].key;
        if (prevKey != selectedDetRes.key && lastKey == prevKey) {
          this.selectedItemDetails.push({ key: selectedDetRes.key, value: selectedDetRes.value });
          break;
        }//end of if
      }//end of else if
    }//end of for
  }//end of the method

  //start method of setCustInforOnEventEmit
  private setCustInforOnEventEmit(selectedItemDetailsParam: any[]) {
    //let selectedItemDet : any[] = selectedItemDetailsParam;
    this.selectedItemsGrid = [];
    for (let selectedDet of selectedItemDetailsParam) {
      for (let selItm of selectedDet.value.selectedItem) {
        this.custCode = selItm.customerCode;
        this.custName = selItm.customerName;
        this.custSegment = selItm.customerSegment;
        this.salesGroup = selItm.salesGroup;
        this.salesOffice = selItm.salesOffice;
        this.selectedItemsGrid.push(selItm);
        this.contactPersonNameForModify = selItm.customerContactPersonName;
        this.contactPersonPhoneNoForModify = selItm.customerContactPersonPhoneNo;
        this.contactPersonEmailIdForModify = selItm.customerContactPersonEmailId;
      }//end of for
    }//end of for
    this.invoiceSearchDetailsModel.custCode = this.custCode;
    this.complaintQtyErrorCheck();
  }//end of the method setCustInforOnEventEmit

  // start method of onNatureTypeSelect
  private onNatureTypeSelectName(natureOfCmpParam) {
    this.complaintDetailsEnable = false;
    this.natureCmpName = natureOfCmpParam;
    console.log("natureCmpIdParam", this.natureCmpName);
    if (this.natureCmpName == "Other") {
      this.complaintDetailsEnable = true;
      this.complaintRegisterFormGroup.controls['complaintDetails'].markAsTouched();
    }
  }
  // end method of onNatureTypeSelect

  //start method getItemsHeaderEventEmitter for getting the itemsheader from eventemitter
  getItemsHeaderEventEmitter() {
    this.complaintPIRegisterEmitService.getItemsHeaderEventEmitter().
      subscribe(itemsHeaderRes => {
        console.log(" itemsHeaderRes  : ", itemsHeaderRes);
        this.itemsHeader = itemsHeaderRes;
      },
      err => {
        console.log(err);
        this.sessionErrorService.routeToLogin(err._body);
      });

  }//end of the method getItemsHeaderEventEmitter

  //start method for closing invoice bubble and removing invoice details for the array
  public deleteItemDetOnClick(selectedInvoiceNo) {
    console.log(" this.selectedItemDetails ========== ", this.selectedItemDetails);
    let indexCount: number = 0;
    for (let selectedDet of this.selectedItemDetails) {
      if (selectedInvoiceNo == selectedDet.key) {
        this.selectedItemDetails.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for
    if (this.selectedItemDetails.length == 0) {
      this.selectedItemsGrid = [];
      if(this.invoiceSearchDetailsModel.compRefNo == undefined || this.invoiceSearchDetailsModel.compRefNo == ""){
        this.custCode = "";
        this.custName = "";
      }
      this.custSegment = "";
      this.salesGroup = "";
      this.salesOffice = "";
      this.invoiceSearchDetailsModel.custCode = this.custCode;
    } else if (this.selectedItemDetails.length > 0) {
      let selectedItemObj: any[] = [];
      for (let selectedDet of this.selectedItemDetails) {
        for (let selItem of selectedDet.value.selectedItem) {
          selectedItemObj.push(selItem);
        }//end of for
      }//end of for
      this.selectedItemsGrid = selectedItemObj;
    }//end of else if
  }//end of the method deleteItemDetOnClick


  //method for onchanging compaintType dropdown
  public onComplaintTypeSelect(complaintTypeId, selectedNatureOfComplaintId?: string) {
    this.complaintTypeId = complaintTypeId;
    console.log("complaintTypeId", this.complaintTypeId);
    console.log("selectedNatureOfComplaintId == ", selectedNatureOfComplaintId);
    if (complaintTypeId == "") {
      this.natureOfComDropDownList = [
        { Key: '', Value: '-- Select --' }
      ]
      this.complaintRegisterFormGroup.controls["natureOfComplaintId"].setValue("");
    } else {
      this.busySpinner.natureOfCompdropdownBusy = true;
      this.updateBusySpinner();
      this.complaintPIRegisterDataService.getSelectValNatureOfComplaint(this.complaintTypeId).
        subscribe(res => {
          this.natureOfComDropDownList = res.details;
          this.busySpinner.natureOfCompdropdownBusy = false;//to stop the spinner
          this.updateBusySpinner();
          for (let natureCmp of this.natureOfComDropDownList) {
            console.log("natureCmp.Key=====> ", natureCmp.Key);
            if (natureCmp.Key == "" && (selectedNatureOfComplaintId == null || selectedNatureOfComplaintId == "" || selectedNatureOfComplaintId == undefined)) {
              this.complaintRegisterFormGroup.controls["natureOfComplaintId"].setValue(natureCmp.Key);
              break;
            } else if (selectedNatureOfComplaintId != null || selectedNatureOfComplaintId != "" || selectedNatureOfComplaintId != undefined) {
              console.log(" selectedNatureOfComplaintId == ", selectedNatureOfComplaintId);
              if (natureCmp.Key == selectedNatureOfComplaintId) {
                this.complaintRegisterFormGroup.controls["natureOfComplaintId"].setValue(selectedNatureOfComplaintId);
                if (natureCmp.Value == "Other") {
                  this.onNatureTypeSelectName(natureCmp.Value);
                }
              }//end of if
            }//end of else if
          }//end for
        },
        err => {
          console.log(err);
          this.busySpinner.natureOfCompdropdownBusy = false;//to stop the spinner
          this.updateBusySpinner();
          this.sessionErrorService.routeToLogin(err._body);
        });
    }//end else
  }//end of the method onComplaintTypeSelect

  //method for Complaint Logged On and Compliant Reference Date validation 
  public compareTwoDates(controlName) {
    console.log(" currentDate ", this.currentDate);
    console.log("compareTwoDates method called .");
    console.log("controlName = ", controlName);
    this.submitButtonEnable = true;
    console.log(" diffBetwnCmplntRefDtAndLoggedOnDt ", this.diffBetwnCmplntRefDtAndLoggedOnDt)
    this.complaintReferenceDt = "Info";
    this.loggedOnDt = "Info";
    this.loggedOnDtCmplntRefDtDiff = "Info";
    this.currentDtloggedOnDt = "Info";
    this.loggedOnDt = "Info";
    this.loggedOnDtCmplntRefDtDiff = "Info";
    this.currentDtComplaintReferenceDt = "Info";
    this.cmplntRefDtLoggedOnDtDiff = "Info";
    this.cmplntRefDtLoggedOnDtDiffZero = "Info";
    //converting the complaintReferenceDt value andloggedOnDt value into time 
    let compRefDt: number = new Date(this.complaintRegisterFormGroup.controls['complaintReferenceDt'].value).getTime();
    let logOnDt: number = new Date(this.complaintRegisterFormGroup.controls['loggedOnDt'].value).getTime();
    let oneDay = 24 * 60 * 60 * 1000;
    console.log(" compRefDt ", compRefDt);
    console.log(" logOnDt ", logOnDt);
    // calculating the difference between complaintReferenceDt and loggedOnDt
    let compRefDtLogOnDtDiff: number = Math.abs((logOnDt - compRefDt) / (oneDay));
    console.log(" date difference ", compRefDtLogOnDtDiff);

    // if the control name is complaintReferenceDt then this if condition will be executed
    if (controlName == "complaintReferenceDt") {
      // if complaintReferenceDt is greater than current date then this if conditon will be executed
      if (new Date(this.currentDate) < new Date(this.complaintRegisterFormGroup.controls['complaintReferenceDt'].value)) {
        this.currentDtComplaintReferenceDt = "Error";
        this.submitButtonEnable = false;
      } else {
        //if complaintReferenceDt is smaller than current date then this else conditon will be executed
        this.currentDtComplaintReferenceDt = "Info";
        this.cmplntRefDtLoggedOnDtDiff = "Info";
        // if complaintReferenceDt is greater than loggedOnDt then this if condition will be executed
        if ((new Date(this.complaintRegisterFormGroup.controls['loggedOnDt'].value) < new Date(this.complaintRegisterFormGroup.controls['complaintReferenceDt'].value))) {
          console.log("Date error.")
          this.complaintReferenceDt = "Error";
          this.submitButtonEnable = false;
          this.loggedOnDt = "Info";
        } else {//if complaintReferenceDt is smaller than loggedOnDt then this else condition will be executed
          // if diffBetwnCmplntRefDtAndLoggedOnDt is not greater than or equal to zero then this if condition will be executed
          if (!(this.diffBetwnCmplntRefDtAndLoggedOnDt <= 0)) {
            // if compRefDtLogOnDtDiff is greater than diffBetwnCmplntRefDtAndLoggedOnDt and compRefDtLogOnDtDiff is not NaN then this if condition will be executed
            if ((compRefDtLogOnDtDiff > this.diffBetwnCmplntRefDtAndLoggedOnDt) && !(isNaN(compRefDtLogOnDtDiff))) {
              this.complaintReferenceDt = "Info";
              this.cmplntRefDtLoggedOnDtDiff = "Error";
              this.loggedOnDtCmplntRefDtDiff = "Info";
              this.submitButtonEnable = false;
            }// end if 
          } else if (this.diffBetwnCmplntRefDtAndLoggedOnDt == 0) { // if diffBetwnCmplntRefDtAndLoggedOnDt is equal to zero then this if condition will be executed
            // if compRefDtLogOnDtDiff is greater than diffBetwnCmplntRefDtAndLoggedOnDt and compRefDtLogOnDtDiff is not NaN
            if ((compRefDtLogOnDtDiff > this.diffBetwnCmplntRefDtAndLoggedOnDt) && !(isNaN(compRefDtLogOnDtDiff))) {
              this.cmplntRefDtLoggedOnDtDiffZero = "Error";
              this.loggedOnDtCmplntRefDtDiffZero = "Info";
              this.submitButtonEnable = false;
            } //end if
          } //end else if
        }//end else
      }//end else   
    } else if (controlName == "loggedOnDt") { //if controlName is loggedOnDt then this else if condition will be executed
      this.currentDtloggedOnDt = "Info";
      this.loggedOnDt = "Info";
      this.loggedOnDtCmplntRefDtDiff = "Info";
      this.loggedOnDtCmplntRefDtDiffZero = "Info";
      //if loggedOnDt is greater than current date then this if condition will be executed
      if (new Date(this.currentDate) < new Date(this.complaintRegisterFormGroup.controls['loggedOnDt'].value)) {
        this.currentDtloggedOnDt = "Error";
        this.submitButtonEnable = false;
      } else { //if loggedOnDt is smaller than current date then this else condition will executed
        this.currentDtloggedOnDt = "Info";
        this.loggedOnDt = "Info";
        this.loggedOnDtCmplntRefDtDiff = "Info";
        // if complaintReferenceDt is greater than loggedOnDt then this if condition will be executed
        if (new Date(this.complaintRegisterFormGroup.controls['loggedOnDt'].value) < new Date(this.complaintRegisterFormGroup.controls['complaintReferenceDt'].value)) {
          console.log("Date error.")
          this.loggedOnDt = "Error";
          this.submitButtonEnable = false;
          this.complaintReferenceDt = "Info";
        } else { //if complaintReferenceDt is smaller than loggedOnDt then this if condition will be executed
          // if diffBetwnCmplntRefDtAndLoggedOnDt is not greater than or equal to zero then this if condition will be executed
          if (!(this.diffBetwnCmplntRefDtAndLoggedOnDt <= 0)) {
            // compRefDtLogOnDtDiff is greater than diffBetwnCmplntRefDtAndLoggedOnDt and compRefDtLogOnDtDiff is not NaN then this if condition will be executed
            if ((compRefDtLogOnDtDiff > this.diffBetwnCmplntRefDtAndLoggedOnDt) && !(isNaN(compRefDtLogOnDtDiff))) {
              this.loggedOnDtCmplntRefDtDiff = "Error";
              this.cmplntRefDtLoggedOnDtDiff = "Info";
              this.submitButtonEnable = false;
            } // end of if
          } // end of if
          // if diffBetwnCmplntRefDtAndLoggedOnDt is equal to zero then this else if condition will be executed
          else if (this.diffBetwnCmplntRefDtAndLoggedOnDt == 0) {
            // if compRefDtLogOnDtDiff is greater than diffBetwnCmplntRefDtAndLoggedOnDt and compRefDtLogOnDtDiff is not NaN
            if ((compRefDtLogOnDtDiff > this.diffBetwnCmplntRefDtAndLoggedOnDt) && !(isNaN(compRefDtLogOnDtDiff))) {
              this.loggedOnDtCmplntRefDtDiffZero = "Error";
              this.cmplntRefDtLoggedOnDtDiffZero = "Info";
              this.submitButtonEnable = false;
            }// end of if
          } //end of else if
        }// end of else
      }// end of else
    }// end of else if 
  }//end of method compareTwoDates


  //start method onRadioClick
  public onRadioClick(radioValue) {
    console.log("radioValue ", radioValue);
    this.repeatedComplaintValue = radioValue;
    if (this.repeatedComplaintValue == 'Y') {
      this.complaintRegisterFormGroup.controls["repeatedComplaint"].setValue(this.repeatedComplaintValue);
      this.complaintRegisterFormGroup.get('previousComplaintReferenceNo').setValidators(Validators.required);
    } else if (this.repeatedComplaintValue == 'N') {
      this.complaintRegisterFormGroup.controls["repeatedComplaint"].setValue(this.repeatedComplaintValue);
      this.complaintRegisterFormGroup.get('previousComplaintReferenceNo').setValidators(null);
      this.complaintRegisterFormGroup.get('previousComplaintReferenceNo').updateValueAndValidity();
      this.complaintRegisterFormGroup.get('previousComplaintReferenceNo').setValue("");
      this.previousComplaintReferenceNoForModify = "";
      this.complaintRegisterFormGroup.get('previousComplaintReferenceNo').markAsUntouched();
    }
  } //end of the method onRadioClick

  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.busySpinner.compEditBusy = true;
    this.complaintPIRegisterDataService.getComplaintReferenceDetails(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice
        this.selectedComplaintReferenceDetails = res.details[0];
        this.busySpinner.compEditBusy = false;
        this.updateBusySpinner();
        this.itemsHeader = res.itemsHeader;
        console.log("res for edit comp: ", res);
        console.log("comprefdetobj for edit comp: ", this.selectedComplaintReferenceDetails);
        console.log("this.selectedComplaintReferenceDetails.activityId: ", this.selectedComplaintReferenceDetails.activityId);
        console.log("this.localStorageService.appSettings.complaintRegistrationActivityId :", this.localStorageService.appSettings.complaintRegistrationActivityId);
        if (this.selectedComplaintReferenceDetails.activityId == this.localStorageService.appSettings.complaintRegistrationActivityId) {
          console.log(" ActivityId is matched");
          let invItems: any[] = this.selectedComplaintReferenceDetails.itemNos.items;
          if (invItems.length > 0) {
            for (let selItm of invItems) {
              this.custCode = selItm.customerCode;
              this.custName = selItm.customerName;
              this.custSegment = selItm.customerSegment;
              this.salesGroup = selItm.salesGroup;
              this.salesOffice = selItm.salesOffice;
              break;
            }//end of for
            this.invoiceSearchDetailsModel.custCode = this.custCode;
            this.invoiceSearchDetailsModel.custName = this.custName;
            this.invoiceSearchDetailsModel.salesGroup = this.salesGroup;
            this.invoiceSearchDetailsModel.salesOffice = this.salesOffice;
            for (let selItm of invItems) {
              this.selectedItemsGrid.push(selItm);
            }
          }//end of if
          //calling  method tableGridDataConverterFromRes for creating table grid json array from res and passing the res as parameter
          this.tableGridDataConverterFromRes(invItems);
          this.complaintQtyInTonsError = false;
          this.invoiceSearchDetailsModel.compRefNo = complaintReferenceNo;

          this.complaintReceivedById = this.selectedComplaintReferenceDetails.complaintReceivedById;
          if (this.complaintReceivedById == "0") {
            this.complaintReceivedById = "";
          }
          this.complaintRegisterFormGroup.controls["complaintReceivedById"].setValue(this.complaintReceivedById);
          this.complaintReceivedByName = this.selectedComplaintReferenceDetails.complaintReceivedByName;
          if (this.complaintReceivedByName == " ") {
            this.complaintReceivedByName = "";
          }
          this.complaintRegisterFormGroup.controls["complaintReceivedByName"].setValue(this.complaintReceivedByName);
          this.complaintReceivedByPhoneNo = this.selectedComplaintReferenceDetails.complaintReceivedByPhoneNo;
          if (this.complaintReceivedByPhoneNo == " ") {
            this.complaintReceivedByPhoneNo = "";
          }
          this.complaintRegisterFormGroup.controls["complaintReceivedByPhoneNo"].setValue(this.complaintReceivedByPhoneNo);
          this.modeId = this.selectedComplaintReferenceDetails.modeId;
          this.complaintRegisterFormGroup.controls["modeId"].setValue(this.modeId);

          this.complaintReferenceDate = this.datePipe.transform(this.selectedComplaintReferenceDetails.complaintReferenceDt, 'yyyy-MM-dd');
          this.complaintRegisterFormGroup.controls["complaintReferenceDt"].setValue(this.complaintReferenceDate);
          this.modeReferenceNoForModify = this.selectedComplaintReferenceDetails.modeReferenceNo;
          if (this.modeReferenceNoForModify == " ") {
            this.modeReferenceNoForModify = "";
          }
          this.complaintRegisterFormGroup.controls["modeReferenceNo"].setValue(this.modeReferenceNoForModify);
          // this.invoiceDateForModify = this.datePipe.transform(this.selectedComplaintReferenceDetails.invoiceDt, 'dd-MM-yyyy');
          this.contactPersonNameForModify = this.selectedComplaintReferenceDetails.contactPersonName;
          if (this.contactPersonNameForModify == " ") {
            this.contactPersonNameForModify = "";
          }
          this.complaintRegisterFormGroup.controls["contactPersonName"].setValue(this.contactPersonNameForModify);
          this.contactPersonPhoneNoForModify = this.selectedComplaintReferenceDetails.contactPersonPhoneNo;
          if (this.contactPersonPhoneNoForModify == " ") {
            this.contactPersonPhoneNoForModify = "";
          }
          this.complaintRegisterFormGroup.controls["contactPersonPhoneNo"].setValue(this.contactPersonPhoneNoForModify);
          this.contactPersonEmailIdForModify = this.selectedComplaintReferenceDetails.contactPersonEmailId;
          if (this.contactPersonEmailIdForModify == " ") {
            this.contactPersonEmailIdForModify = "";
          }
          this.complaintRegisterFormGroup.controls["contactPersonEmailId"].setValue(this.contactPersonEmailIdForModify);
          this.complaintTypeIdForModify = this.selectedComplaintReferenceDetails.complaintTypeId;
          this.complaintRegisterFormGroup.controls["complaintTypeId"].setValue(this.complaintTypeIdForModify);
          this.natureOfComplaintIdForModify = this.selectedComplaintReferenceDetails.natureOfComplaintId;
          this.onComplaintTypeSelect(this.complaintTypeIdForModify, this.natureOfComplaintIdForModify);
          this.severityIndexRatingForModify = this.selectedComplaintReferenceDetails.severityIndexRating;
          if (this.severityIndexRatingForModify == " ") {
            this.severityIndexRatingForModify = "";
          }
          this.complaintRegisterFormGroup.controls["severityIndexRating"].setValue(this.severityIndexRatingForModify);
          this.complaintDetailsForModify = this.selectedComplaintReferenceDetails.complaintDetails;
          if (this.complaintDetailsForModify == " ") {
            this.complaintDetailsForModify = "";
          }
          this.complaintRegisterFormGroup.controls["complaintDetails"].setValue(this.complaintDetailsForModify);
          this.loggedByForModify = this.selectedComplaintReferenceDetails.loggedBy;
          this.complaintRegisterFormGroup.controls["loggedBy"].setValue(this.loggedByForModify);
          this.loggedOnDtForModify = this.datePipe.transform(this.selectedComplaintReferenceDetails.loggedOnDt, 'yyyy-MM-dd');
          this.complaintRegisterFormGroup.controls["loggedOnDt"].setValue(this.loggedOnDtForModify);
          this.repeatedComplaintValue = this.selectedComplaintReferenceDetails.repeatedComplaint;
          this.complaintRegisterFormGroup.controls["repeatedComplaint"].setValue(this.repeatedComplaintValue);
          this.previousComplaintReferenceNoForModify = this.selectedComplaintReferenceDetails.previousComplaintReferenceNo;
          if (this.previousComplaintReferenceNoForModify == " ") {
            this.previousComplaintReferenceNoForModify = "";
          }
          this.complaintRegisterFormGroup.controls["previousComplaintReferenceNo"].setValue(this.previousComplaintReferenceNoForModify);

          this.requiredCommercialSettlementInComplaintRegistrationForModify = this.selectedComplaintReferenceDetails.requiredCommercialSettlementInComplaintRegistration.charAt(0);
          console.log(" requiredCommercialSettlementInComplaintRegistrationForModify===>", this.requiredCommercialSettlementInComplaintRegistrationForModify)
          this.complaintRegisterFormGroup.controls["requiredCommercialSettlementInComplaintRegistration"].setValue(this.requiredCommercialSettlementInComplaintRegistrationForModify);

        } else {
          console.log(" ActivityId isn't matched");
          this.resMsgType = this.errorConst;
          this.resErrorMsg = "Complaint Refference No" + " " + complaintReferenceNo + " cannot be edited as root cause analysis already done.";
        }

      },
      err => {
        console.log(err);
        this.busySpinner.compEditBusy = false;
        this.updateBusySpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });
  }

  //start method onKeyupComplaintQty
  onKeyupComplaintQty(complaintQtyInTonsParam, invoiceNo, itemCode, invoiceQtyInTonsParam,batchNo:string) {
    let flag: boolean = false;
    console.log("complaintQtyInTonsParam===>", complaintQtyInTonsParam);
    // let cmpQtyErr : boolean = false;
    for (let selectedItmDet of this.selectedItemDetails) {
      for (let itemDet of selectedItmDet.value.selectedItem) {
        if (itemDet.invoiceNo == invoiceNo && itemDet.itemCode == itemCode && itemDet.batchNo == batchNo) {
          let complaintQtyInTons: number = parseFloat(complaintQtyInTonsParam);
          let invoiceQtyInTons: number = parseFloat(invoiceQtyInTonsParam);
          if (complaintQtyInTons > invoiceQtyInTons) {

            itemDet.uiInpErrFlag = true;
            itemDet.uiInpErrDesc = 'Complaint Quantity can’t be greater than Invoice Quantity.';
            this.complaintQtyErrorCorrection();

            break;
          } else if (isNaN(complaintQtyInTons) || complaintQtyInTons == 0) {

            itemDet.uiInpErrFlag = true;
            itemDet.uiInpErrDesc = 'Complaint Quantity can’t be empty or zero';
            this.complaintQtyErrorCorrection();

          }else if (complaintQtyInTons < 0) {
            itemDet.uiInpErrFlag = true;
            itemDet.uiInpErrDesc = 'Complaint Quantity can’t be less than zero';
            this.complaintQtyErrorCorrection();

          } else if (complaintQtyInTons > 0 && complaintQtyInTons <= invoiceQtyInTons && !(isNaN(complaintQtyInTons))) {
            itemDet.complaintQtyInTons = complaintQtyInTons;
            flag = true;
            itemDet.uiInpErrFlag = false;
            itemDet.uiInpErrDesc = '';
            this.complaintQtyErrorCorrection();
            break;
          }//end of else
        }//end of if
      }//end of inner for
      if (flag == true) {
        break;
      }//end of 
    }//end of outer for
    console.log(" this.selectedItemDetails onkeyup ", this.selectedItemDetails);
  }//end of the method onKeyupComplaintQty


    //start method 
    complaintQtyErrorCheck() {
      console.log("complaintQtyErrorCheck start===>");
      for (let selectedItmDet of this.selectedItemDetails) {
        for (let itemDet of selectedItmDet.value.selectedItem) {
          let invoiceQtyInTons: number = parseFloat(itemDet.invoiceQtyInTons);
          let complaintQtyInTons: number = parseFloat(itemDet.complaintQtyInTons);
          if (isNaN(complaintQtyInTons) || complaintQtyInTons == 0) {
            itemDet.uiInpErrFlag = true;
            itemDet.uiInpErrDesc = 'Complaint Quantity can’t be empty or zero';
            this.complaintQtyErrorCorrection();
            // this.complaintQtyInMtrsError = true;
            // break;
          } if (complaintQtyInTons > invoiceQtyInTons) {
            itemDet.uiInpErrFlag = true;
            itemDet.uiInpErrDesc = 'Complaint Quantity can’t be greater than Invoice Quantity';
            this.complaintQtyErrorCorrection();
            // this.complaintQtyInMtrsError = true;
            // break;
          } else if (complaintQtyInTons > 0 && complaintQtyInTons < invoiceQtyInTons && !(isNaN(complaintQtyInTons))) {
            itemDet.uiInpErrFlag = false;
            this.complaintQtyErrorCorrection();
          }//end of else
        }//end of for
        // if (this.complaintQtyInMtrsError == true) {
        // break;
        // }//end of if
      }//end of for
    }//end of cmpQtyerrorcheck
  
    //start method of complaintQtyErrorCorrection
    private complaintQtyErrorCorrection() {
      for (let selectedItmDet of this.selectedItemDetails) {
        for (let itemDet of selectedItmDet.value.selectedItem) {
          if (itemDet.uiInpErrFlag == true || itemDet.uiInpErrFlag == undefined) {
            this.complaintQtyInTonsError = true;
            break;
          } else if (itemDet.uiInpErrFlag == false) {
            this.complaintQtyInTonsError = false;
          }//end of else if
        }//end of for
        if (this.complaintQtyInTonsError === true) {
          break;
        }//end of if
      }//end of for
    }//end of the method complaintQtyErrorCorrection  
  
  // start method clearInvDetService to clear all inv det value
  private clearInvDetService(){
    this.invoiceSearchDetailsModel.invoiceDetails = "";
    this.invoiceSearchDetailsModel.selectedItemDetails = "";
    this.invoiceSearchDetailsModel.compRefNo = "";
    this.invoiceSearchDetailsModel.custCode = "";
    this.invoiceSearchDetailsModel.custName = "";
    this.invoiceSearchDetailsModel.salesOffice = "";
    this.invoiceSearchDetailsModel.salesGroup = "";
  }//end of the method

  // start method of onNatureTypeSelect
  public onNatureTypeSelect(args) {
    this.complaintDetailsEnable = false;
    this.natureCmpName = args.target.options[args.target.selectedIndex].text;
    console.log("natureCmpIdParam", this.natureCmpName);
    if (this.natureCmpName == "Other") {
      this.complaintDetailsEnable = true;
      this.complaintRegisterFormGroup.controls['complaintDetails'].markAsTouched();
    }
  }
  // end method of onNatureTypeSelect

  // start method of comDetsOnkeyup
  public comDetsOnkeyup(complaintDetails) {
    this.complaintDetailsEnable = false;
    console.log(" complaintDetails ", complaintDetails);
    if ((complaintDetails == "" || complaintDetails == " ") && this.natureCmpName == "Other") {
      this.complaintRegisterFormGroup.controls['natureOfComplaintId'].markAsUntouched();
      this.complaintDetailsForModify = "";
      this.complaintDetailsEnable = true;
    }
  }
  // end method of comDetsOnkeyup

  // start method onCompRecBySelect for changing complaint received by  dropdown
  public onCompRecBySelect(compRecByIdParam) {
    this.complaintReceivedById = compRecByIdParam;
    console.log("complaintReceivedById", this.complaintReceivedById);
    if (this.complaintReceivedById == this.complaintReceivedByOther) {
      this.complaintRegisterFormGroup.get('departmentNameOther').setValidators(Validators.required);
    } else {
      this.complaintRegisterFormGroup.get('departmentNameOther').setValidators(null);
      this.complaintRegisterFormGroup.get('departmentNameOther').updateValueAndValidity();
      this.complaintRegisterFormGroup.get('departmentNameOther').setValue("");
      this.complaintRegisterFormGroup.get('departmentNameOther').markAsUntouched();
      this.departmentNameOther = "";
    }//end of else
  }//end of the method onCompRecBySelect

  //start method onCommercialSettlementRadioClick for choosing commercial sattlement radio button 
  onCommercialSettlementRadioClick(radioValueParam) {
    console.log(" radioValueParam ===>", radioValueParam);
    if (radioValueParam) {
      this.complaintRegisterFormGroup.get('requiredCommercialSettlementInComplaintRegistration').setValue(radioValueParam);
    }//end of if
  }//end of the method onCommercialSettlementRadioClick

  //file upload event  
  public fileChange(event) {
    this.fileData = new FormData();
    this.totalFileSize = 0;
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      for (let i: number = 0; i < this.fileList.length; i++) {
        let file: File = this.fileList[i];
        this.fileData.append('uploadFile' + i.toString(), file, file.name);
        this.totalFileSize = this.totalFileSize + file.size;
        console.log("this.totalFileSize:::::::::::", this.totalFileSize);
      }//end of for
    }//end of if
  }//end of filechange method 

  // method to delete error msg
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }//end of if
  }//end of method to delete error msg


}//end of class