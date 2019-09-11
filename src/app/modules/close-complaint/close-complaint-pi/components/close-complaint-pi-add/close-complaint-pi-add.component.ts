import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { CloseComplaintPIService } from '../../services/close-complaint-pi.service';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-close-complaint-pi-add',
  templateUrl: 'close-complaint-pi-add.component.html',
  styleUrls: ['close-complaint-pi-add.component.css']

})
export class CloseComplaintPIAddComponent {
  private plantType: string;
  public title: string = "Close Complaint Modify";

  public closeComplaintPIAddFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint reference no from route param
  public fileActivityId: number = this.localStorageService.appSettings.closeComplaintActivityId;//to load the files

  //for busy spinner
  public busySpinner: any = {
    submitBusy: false,//for submit spinner
    compRefDetBusy: true,
    busy: true
  };
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  
  //for view in html page
  public rootCauseAnalysisValue: string;//rootCauseAnalysisValue radio button value 
  public rootCauseRsnDet: string = "";//textarea rootCauseRsnDet
  public capaClose: string;//capaClose radio
  public capaRsnDet: string = "";//capaRsnDet text area
  public requiredCommercialSettlement: string;//radio value for commercial settlement
  public commercialSettlementDet: string = "";//commercialSettlementDet text area
  public creditNoteNoDet: string = "";//creditNoteNoDet textbox
  public remarksDet: string = "";//textarea remarksDet
  //for error msg
  public resErrorType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";

  //to store the maxlength for localstorage
  public rootCauseReasonInCloseLength: number = this.localStorageService.dbSettings.rootCauseAnalysisAgreementReasonInClose;
  public capaAgreementReasonInCloseLength: number = this.localStorageService.dbSettings.capaAgreementReasonInClose;
  public requiredCommercialSettlementLength: number = this.localStorageService.dbSettings.requiredCommercialSettlementReasonInClose;
  public creditNoteNoLength: number = this.localStorageService.dbSettings.creditNoteNo;
  public closeRemarksLength: number = this.localStorageService.dbSettings.closeRemarks;

  // form data for file upload
  private formData: FormData = new FormData();
  private totalFileSizeForApprovalFile: number = 0;//for approval file upload
  private totalFileSizeForUploadFile: number = 0;//for close file upload  
  private fileSizeLimit: number = 104857600;
  private fileData: FormData;
  private approvalFileData: FormData;
  public fileList: FileList;
  public approvalFileList: FileList;
  public submitButtonEnable: boolean = true;//to disable submit button


  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private closeComplaintPIService: CloseComplaintPIService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService
  ) { }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
    });
    console.log("complaintReferenceNo for CAPA Action PI add: ", this.complaintReferenceNo);

    if (this.complaintReferenceNo == '') {
      // this.getComplaintReferenceNoDropdownVal();
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }
    this.buildForm();
  }//end of onInit

  //a method named buildform for creating the closeComplaintPIAddFormGroup and its formControl
  private buildForm(): void {
    this.closeComplaintPIAddFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'rootCause': [''
      , [
        Validators.required,
      ]
      ],
      'rootCauseRsn': [''
        , [
          Validators.required,
        ]
      ],
      'cpAction': [''
      , [
        Validators.required,
      ]
      ],
      'caparsn': [''
        , [
          Validators.required,
        ]
      ],
      'commercialSettlement': [''
      , [
        Validators.required,
      ]
      ],
      'commercialsettlementRsn': [''
        // , [
        //   Validators.required,
        // ]
      ],
      'creditNoteNo': [''
      // , [
      //   Validators.required,
      // ]
      ],
      'remarks': [''
      , [
        Validators.required,
      ]
      ]

    });

  }//end of method buildForm
  
  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.compRefDetBusy || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if(this.busySpinner.compRefDetBusy == false && this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method

  //start method onRootCauseRadioClick
  public onRootCauseRadioClick(rootCauseAnalysisValue) {
    console.log("rootCauseAnalysisValue:: ", rootCauseAnalysisValue);
    this.rootCauseAnalysisValue = rootCauseAnalysisValue;
    this.closeComplaintPIAddFormGroup.controls["rootCause"].setValue(this.rootCauseAnalysisValue);
  }//end of method onRootCauseRadioClick
  //start method onCAPARadioClick
  public onCAPARadioClick(capaRadioValue) {
    console.log("capaRadioValue:: ", capaRadioValue);
    this.capaClose = capaRadioValue;
    this.closeComplaintPIAddFormGroup.controls["cpAction"].setValue(this.capaClose);
  }//end of method onCAPARadioClick

  //start method onCommercialSettlementRadioClick
  public onCommercialSettlementRadioClick(commercialSettlementRadioValue) {
    console.log("commercialSettlementRadioValue:: ", commercialSettlementRadioValue);
    this.requiredCommercialSettlement = commercialSettlementRadioValue;
    this.closeComplaintPIAddFormGroup.controls["commercialSettlement"].setValue(this.requiredCommercialSettlement);
    if(commercialSettlementRadioValue === "N"){
      this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValue(this.selectedComplaintReferenceDetails.requiredCommercialSettlementReasonInClose.trim());
      // this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValidators(Validators.required);
      // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValidators(null);//setr credit note validators null
      // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].updateValueAndValidity();
      // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].markAsUntouched();
    }else if(commercialSettlementRadioValue === "Y"){
      this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValue(this.selectedComplaintReferenceDetails.creditNoteNo.trim());
      // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValidators(Validators.required);
      this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValidators(null);//set com set reason validators null
      this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].updateValueAndValidity();
      this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].markAsUntouched();
    }
  }//end of method onCommercialSettlementRadioClick  
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resErrorType) {
    if (resErrorType == 'Error') {
      this.resErrorType = "Info";
    }
  }//method to delete error msg

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.closeComplaintPIService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice
        console.log("res for edit comp: ", res);
        this.selectedComplaintReferenceDetails = res.details[0];
        if (res.msgType == "Info") {
          //closeRemarks,rootCauseAnalysisAgreementInClose,rootCauseAnalysisAgreementReasonInClose,capaAgreementInClose,capaAgreementReasonInClose,requiredCommercialSettlementInClose,.creditNoteNo,requiredCommercialSettlementReasonInClose
          //root cause  
          this.closeComplaintPIAddFormGroup.controls["complaintReferenceNo"].setValue(this.complaintReferenceNo);
          let rootCauseAnalysisAgreementInCloseRes: string = this.selectedComplaintReferenceDetails.rootCauseAnalysisAgreementInClose;
          this.rootCauseAnalysisValue = rootCauseAnalysisAgreementInCloseRes.substring(0, 1);
          this.closeComplaintPIAddFormGroup.controls["rootCause"].setValue(this.rootCauseAnalysisValue);//set it to form control
          let rootCauseAnalysisAgreementReasonInCloseRes: string = this.selectedComplaintReferenceDetails.rootCauseAnalysisAgreementReasonInClose;
          this.rootCauseRsnDet = rootCauseAnalysisAgreementReasonInCloseRes.trim();
          if (this.rootCauseAnalysisValue == "N") {
            this.closeComplaintPIAddFormGroup.controls["rootCauseRsn"].setValue(this.rootCauseRsnDet);
          } else {
            this.closeComplaintPIAddFormGroup.controls["rootCauseRsn"].setValue(" ");
          }
          //capa
          let capaAgreementInCloseRes: string = this.selectedComplaintReferenceDetails.capaAgreementInClose;
          this.capaClose = capaAgreementInCloseRes.substring(0, 1);
          this.closeComplaintPIAddFormGroup.controls["cpAction"].setValue(this.capaClose);
          let capaAgreementReasonInCloseRes: string = this.selectedComplaintReferenceDetails.capaAgreementReasonInClose;
          this.capaRsnDet = capaAgreementReasonInCloseRes.trim();
          if (this.capaClose == "N") {
            this.closeComplaintPIAddFormGroup.controls["caparsn"].setValue(this.capaRsnDet);
          } else {
            this.closeComplaintPIAddFormGroup.controls["caparsn"].setValue(" ");
          }
          //commercial settlement
          let requiredCommercialSettlementFromRes: string = this.selectedComplaintReferenceDetails.requiredCommercialSettlementInClose;
          this.requiredCommercialSettlement = requiredCommercialSettlementFromRes.substring(0, 1);
          this.closeComplaintPIAddFormGroup.controls["commercialSettlement"].setValue(this.requiredCommercialSettlement);
          let requiredCommercialSettlementReasonInCloseRes: string = this.selectedComplaintReferenceDetails.requiredCommercialSettlementReasonInClose;
          this.commercialSettlementDet = requiredCommercialSettlementReasonInCloseRes.trim();
          let creditNoteNoRes: string = this.selectedComplaintReferenceDetails.creditNoteNo;
          this.creditNoteNoDet = creditNoteNoRes.trim();
          if (this.requiredCommercialSettlement == "N") {
            this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValue(this.commercialSettlementDet.trim());
            this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValidators(Validators.required);
            // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValidators(null);
          } else {
            this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValue(this.creditNoteNoDet.trim());
            // this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValidators(Validators.required);
            this.closeComplaintPIAddFormGroup.controls["commercialsettlementRsn"].setValidators(null);
          }
          // if(this.requiredCommercialSettlement.trim() == ""){
          //   this.closeComplaintPIAddFormGroup.controls["creditNoteNo"].setValue(" ");
          // }
          let remarksDetRes: string = this.selectedComplaintReferenceDetails.closeRemarks;
          this.remarksDet = remarksDetRes.trim();
          this.closeComplaintPIAddFormGroup.controls["remarks"].setValue(this.remarksDet);
          this.plantType = this.selectedComplaintReferenceDetails.plantType;
        } else {
          // show error msg on html page
          this.resErrorType = this.errorConst;
          this.resErrorMsg = res.msg;
        }//end of else
        this.busySpinner.compRefDetBusy = false;//busy spinner
        this.updateBusySpinner();//method for busy spinner
      },
      err => {
        console.log(err);
        this.busySpinner.compRefDetBusy = false;//busy spinner
        this.updateBusySpinner();//method for busy spinner
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of method to get complaint ref details and set the values to the html page 

  //method of submit modify allocate complaint
  public onCloseComplaintSubmit() {
    console.log("form value of CAPA PI add/modify submit : ", this.closeComplaintPIAddFormGroup.value);
    let closeComplaintSubmitDet: any = {};
    closeComplaintSubmitDet.complaintReferenceNo = this.complaintReferenceNo;
    closeComplaintSubmitDet.rootCauseAnalysisAgreementInClose = this.rootCauseAnalysisValue;//rootCause
    closeComplaintSubmitDet.rootCauseAnalysisAgreementReasonInClose = this.closeComplaintPIAddFormGroup.value.rootCauseRsn;//
    closeComplaintSubmitDet.capaAgreementInClose = this.capaClose;
    closeComplaintSubmitDet.capaAgreementReasonInClose = this.closeComplaintPIAddFormGroup.value.caparsn;
    closeComplaintSubmitDet.requiredCommercialSettlementInClose = this.requiredCommercialSettlement;
    closeComplaintSubmitDet.creditNoteNo = this.closeComplaintPIAddFormGroup.value.creditNoteNo.trim() ? this.closeComplaintPIAddFormGroup.value.creditNoteNo: ' ' ;
    closeComplaintSubmitDet.requiredCommercialSettlementReasonInClose = this.closeComplaintPIAddFormGroup.value.commercialsettlementRsn;
    closeComplaintSubmitDet.closeRemarks = this.closeComplaintPIAddFormGroup.value.remarks;
    closeComplaintSubmitDet.plantType = this.plantType;
    console.log("onCloseComplaintSubmit: ", closeComplaintSubmitDet);
    // console.log("this.totalFileSizeForApprovalFile on submit method:::::::::::", this.totalFileSizeForApprovalFile);
    console.log("this.totalFileSizeForUploadFile on submit method:::::::::::", this.totalFileSizeForUploadFile);
    // // let approvalBoolean: boolean = false;
    // if(this.requiredCommercialSettlement == "Y") { 
    //   if(this.totalFileSizeForApprovalFile > 0) { 
    //     approvalBoolean = true;
    //   } else{
    //     this.resErrorType = this.errorConst;
    //     this.resErrorMsg = "Please choose approval file.";
    //     approvalBoolean = false;
    //   }//end of else approval file size check
    // }else{
    //   approvalBoolean = true;
    // }
    // //checking boolean is true or false
    // if(approvalBoolean == true){   
      let totalFileSize: number = this.totalFileSizeForUploadFile + this.totalFileSizeForApprovalFile;
        if (totalFileSize > this.fileSizeLimit) {
          this.resErrorType = this.errorConst;
          this.resErrorMsg = "File size should be within 100 mb !";
        } else {
          let jsonArr: any[] = [];//json arr to convert obj toString
          jsonArr.push(JSON.stringify(closeComplaintSubmitDet));
          this.formData.append("closeComplaintDet", jsonArr.toString());
          //method to add or update close pi
          if (this.fileData != undefined) {
            for (let i: number = 0; i < this.fileList.length; i++) {
              console.log(" file upload", this.fileData.get('uploadFile' + i.toString()));
              if (this.fileData.get('uploadFile' + i.toString()) != null) {
                this.formData.append('uploadFile' + i.toString(), this.fileData.get('uploadFile' + i.toString()));
              }//end of if
            }//end of for
          }//end of if fileData is !undefined
          // //method to add or update approval close pi
          if (this.approvalFileData != undefined) {
            for (let i: number = 0; i < this.approvalFileList.length; i++) {
              console.log("approval file upload", this.approvalFileData.get('approvalUploadFile' + i.toString()));
              if (this.approvalFileData.get('approvalUploadFile' + i.toString()) != null) {
                this.formData.append('approvalUploadFile' + i.toString(), this.approvalFileData.get('approvalUploadFile' + i.toString()));
              }//end of if
            }//end of for
          }//end of if approval fileData is !undefined
          this.formData.append('Accept', 'application/json');
          this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
          this.formData.append('menuId', 'DEFAULT1');
          this.formData.append('userId', this.localStorageService.user.userId);
          let formDataObj: any = {};
          formDataObj = this.formData;
          this.busySpinner.submitBusy = true;
          this.updateBusySpinner();
          this.closeComplaintPIService.capasubmitWithFileUpload(formDataObj).
            subscribe(res => {
              this.busySpinner.submitBusy = false;
              this.updateBusySpinner();
              console.log("close modify PI add Success Response: ", res);
              this.resErrorType = res.msgType;
              if (res.msgType == "Info") {
                this.router.navigate([ROUTE_PATHS.RouteCloseComplaintPI]);//route to the previous page
              } else {
                this.resErrorType = this.errorConst;
                this.resErrorMsg = res.msg;
                this.formData = new FormData();
              }
            },
            err => {
              this.busySpinner.submitBusy = false;
              this.updateBusySpinner();
              if (err.status == 401) {
                this.resErrorMsg = "Sorry! Unable to save data. Please try again.";
              } else {
                this.resErrorMsg = "Netowrk/Server Problem";
              }
              this.formData = new FormData();
              this.sessionErrorService.routeToLogin(err._body);
            });
        }//end of else
        //end of if approval file submit
      // }//end of if boolean is true
  } //end of method submit modify capa actn pi
  //file upload event  
  public fileChange(event) {
    this.fileData = new FormData();
    this.totalFileSizeForUploadFile = 0;
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      for (let i: number = 0; i < this.fileList.length; i++) {
        let file: File = this.fileList[i];
        this.fileData.append('uploadFile' + i.toString(), file, file.name);
        this.totalFileSizeForUploadFile = this.totalFileSizeForUploadFile + file.size;
        console.log("this.totalFileSizeForUploadFile:::::::::::", this.totalFileSizeForUploadFile);
      }//end of for
    }//end of if
  }//end of filechange method      
  // //approvalFileChange event  
  public approvalFileChange(event) {
    this.approvalFileData = new FormData();
    this.totalFileSizeForApprovalFile = 0;
    this.approvalFileList = event.target.files;
    if (this.approvalFileList.length > 0) {
      for (let i: number = 0; i < this.approvalFileList.length; i++) {
        let file: File = this.approvalFileList[i];
        this.approvalFileData.append('approvalUploadFile' + i.toString(), file, file.name);
        this.totalFileSizeForApprovalFile = this.totalFileSizeForApprovalFile + file.size;
        console.log("this.totalFileSizeForApprovalFile:::::::::::", this.totalFileSizeForApprovalFile);
      }//end of for
    }//end of if
  }//end of approvalFileChange method

  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method
}//end of class
