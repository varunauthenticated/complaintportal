import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { CAPAActionPIService } from '../../services/capa-action-pi.service';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-capa-action-pi-add',
  templateUrl: 'capa-action-pi-add.component.html',
  styleUrls: ['capa-action-pi-add.component.css']

})
export class CAPAActionPIAddComponent {
  private plantType: string;
  // form data for file upload
  private totalFileSize: number = 0;
  private fileSizeLimit: number = 104857600;
  private formData: FormData = new FormData();
  private fileData: FormData;
  public fileList: FileList;

  public title: string = "CAPA Modify";
  public rcaDate: string = "";
  public dateErrorFlag: any = {
    futureDateErrFlag: false,
    rcaDateErrFlag: false
  }

  public capaActionPIAddFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint reference no from route param
  public fileActivityId: number = this.localStorageService.appSettings.analyseCustomerComplaintsAndActionPlanActivityId;//to load the files

  //for busy spinner
  public busySpinner: any = {
    compRefDetBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  };
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  
  //for view in html page
  public actionType: string;//radio button value
  public actnDetails: string = "";//textarea
  public requiredCommercialSettlement: string;//radio value for commercial settlement

  //to store the maxlength for localstorage
  public actionTakenAtPlantLength: number = this.localStorageService.dbSettings.actionTakenAtPlant;

  public previousActionType: string;//prev actn type
  public previousActnDetails: string;//prev actn det

  //for error msg
  public resMsgType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  // public submitButtonEnable: boolean = true;//to disable submit button
  public correctiveAction: string;
  public actionTypeTakenAtPlantInShort: string;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private cAPAActionPIService: CAPAActionPIService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
  ) { }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
    });
    console.log("complaintReferenceNo for CAPA Action PI add: ", this.complaintReferenceNo);

    if (this.complaintReferenceNo == '') {
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }
    this.buildForm();
  }//end of onInit

  //a method named buildform for creating the capaActionPIAddFormGroup and its formControl
  private buildForm(): void {
    this.capaActionPIAddFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'commercialSettlement': [''
        , [
          Validators.required,
        ]
      ],
      'cpAction': [''
        // , [
        //   Validators.required,
        // ]
      ],
      'actionDet': [''
        , [
          Validators.required,
        ]
      ],
      'correctiveAction': [''
        // , [
        //   Validators.required,
        // ]
      ],
      'techCloserDate': ['',
        [
          Validators.required
        ]
      ],
      'closerremarks': ['',
        [
          Validators.required
        ]
      ]
    });

  }//end of method buildForm
  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.compRefDetBusy || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.compRefDetBusy == false && this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method


  //start method onCAPARadioClick
  public onCAPARadioClick(capaRadioValue) {
    console.log("capaRadioValue:: ", capaRadioValue);
    this.actionType = capaRadioValue;
    this.capaActionPIAddFormGroup.controls['cpAction'].setValue(capaRadioValue);
    if (this.previousActionType && this.previousActnDetails) {
      if (this.previousActionType == this.actionType) {
        this.actnDetails = this.previousActnDetails;
      } else {
        this.actnDetails = '';
      }
    }
    // new add for tech closer validation
    if (capaRadioValue === 'C') {
      this.capaActionPIAddFormGroup.get('techCloserDate').setValidators(null);
      this.capaActionPIAddFormGroup.get('techCloserDate').updateValueAndValidity();
      this.capaActionPIAddFormGroup.get('closerremarks').setValidators(null);
      this.capaActionPIAddFormGroup.get('closerremarks').updateValueAndValidity();
    } else {
      this.capaActionPIAddFormGroup.controls['techCloserDate'].setValidators(Validators.required);
      this.capaActionPIAddFormGroup.controls['closerremarks'].setValidators(Validators.required);
    }

  }//end of method onCAPARadioClick

  //start method onCommercialSettlementRadioClick
  public onCommercialSettlementRadioClick(commercialSettlementRadioValue) {
    this.capaActionPIAddFormGroup.controls['commercialSettlement'].setValue(commercialSettlementRadioValue);
    console.log("commercialSettlementRadioValue:: ", commercialSettlementRadioValue);
    this.requiredCommercialSettlement = commercialSettlementRadioValue;
  }//end of method onCommercialSettlementRadioClick
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }
  }//method to delete error msg

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.cAPAActionPIService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice
        console.log("res for edit comp: ", res);
        this.selectedComplaintReferenceDetails = res.details[0];
        if (res.msgType == "Info") {
          let actionTypeFromRes: string = this.selectedComplaintReferenceDetails.actionTypeTakenAtPlant;
          this.actionType = actionTypeFromRes.substring(0, 1);
          this.previousActionType = actionTypeFromRes.substring(0, 1);
          let actnDetailsFromRes: string = this.selectedComplaintReferenceDetails.actionTakenAtPlant;
          this.actnDetails = actnDetailsFromRes.trim();
          this.previousActnDetails = actnDetailsFromRes.trim();
          this.capaActionPIAddFormGroup.controls["actionDet"].setValue(this.actnDetails);
          let requiredCommercialSettlementFromRes: string = this.selectedComplaintReferenceDetails.requiredCommercialSettlementInCapa;
          this.requiredCommercialSettlement = requiredCommercialSettlementFromRes.substring(0, 1);
          this.capaActionPIAddFormGroup.controls['commercialSettlement'].setValue(this.requiredCommercialSettlement);
          this.plantType = this.selectedComplaintReferenceDetails.plantType;
          this.correctiveAction = this.selectedComplaintReferenceDetails.correctiveAction.trim();
          this.actionTypeTakenAtPlantInShort = this.selectedComplaintReferenceDetails.actionTypeTakenAtPlantInShort.trim();
          this.capaActionPIAddFormGroup.controls['cpAction'].setValue(this.actionTypeTakenAtPlantInShort);
          if (this.actionTypeTakenAtPlantInShort == 'P') {
            this.capaActionPIAddFormGroup.controls['techCloserDate'].setValue(this.selectedComplaintReferenceDetails.closeDateAtTmlEnd);
            this.capaActionPIAddFormGroup.controls['closerremarks'].setValue(this.selectedComplaintReferenceDetails.closeRemarksAtTmlEnd);
          } else {
            this.capaActionPIAddFormGroup.get('techCloserDate').setValidators(null);
            this.capaActionPIAddFormGroup.get('techCloserDate').updateValueAndValidity();
            this.capaActionPIAddFormGroup.get('closerremarks').setValidators(null);
            this.capaActionPIAddFormGroup.get('closerremarks').updateValueAndValidity();
          }
          this.rcaDate = this.selectedComplaintReferenceDetails.rootCauseAnanysisDate;
        } else {
          // show error msg on html page
          this.resMsgType = this.errorConst;
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

  //method to validate closer date
  public dateValidation() {
    let date = new Date();
    let dateControlName = new Date(this.capaActionPIAddFormGroup.controls['techCloserDate'].value);
    let rcaDate = new Date(this.rcaDate);

    //let siteVisitDate: string = this.datePipe.transform(this.invReportFormGroup.controls['siteVisitDt'].value, 'dd-MM-yyyy');
    // if (rcaDate < dateControlName) {
    //   this.dateErrorFlag.futureDateErrFlag = false;
    //   this.dateErrorFlag.rcaDateErrFlag = true;
    // }else 
    if (date < dateControlName) {
      this.dateErrorFlag.futureDateErrFlag = true;
      this.dateErrorFlag.rcaDateErrFlag = false;
    } else {
      this.dateErrorFlag.futureDateErrFlag = false;
      this.dateErrorFlag.rcaDateErrFlag = false;
    }
  }

  //method of submit modify allocate complaint
  public onCAPAActionPISubmit() {
    console.log("form value of CAPA PI add/modify submit : ", this.capaActionPIAddFormGroup.value);
    let cAPAActionPIDet: any = {};
    cAPAActionPIDet.complaintReferenceNo = this.complaintReferenceNo;
    cAPAActionPIDet.complaintActionType = this.actionType;//capa radio value
    cAPAActionPIDet.actionTakenAtPlant = this.capaActionPIAddFormGroup.value.actionDet;//actn det
    cAPAActionPIDet.requiredCommercialSettlementInCapa = this.requiredCommercialSettlement;//commercial settlement
    cAPAActionPIDet.plantType = this.plantType;
    cAPAActionPIDet.closeDateAtTmlEnd = this.capaActionPIAddFormGroup.value.techCloserDate;
    cAPAActionPIDet.closeRemarksAtTmlEnd = this.capaActionPIAddFormGroup.value.closerremarks;
    console.log("onCAPAActionPISubmit: ", cAPAActionPIDet);
    console.log("this.totalFileSize on submit method:::::::::::", this.totalFileSize);
    if (this.totalFileSize > this.fileSizeLimit) {
      this.resMsgType = this.errorConst;
      this.resErrorMsg = "File size should be within 100 mb !";
    } else {
      let jsonArr: any[] = [];//json arr to convert obj toString
      jsonArr.push(JSON.stringify(cAPAActionPIDet));
      this.formData.append("cAPAActionDet", jsonArr.toString());
      //method to add or update preli
      if (this.fileData != undefined) {
        for (let i: number = 0; i < this.fileList.length; i++) {
          console.log(" file upload", this.fileData.get('uploadFile' + i.toString()));
          if (this.fileData.get('uploadFile' + i.toString()) != null) {
            this.formData.append('uploadFile' + i.toString(), this.fileData.get('uploadFile' + i.toString()));
          }//end of if
        }//end of for
      }//end of if fileData is !undefined
      this.formData.append('Accept', 'application/json');
      this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
      this.formData.append('menuId', 'DEFAULT1');
      this.formData.append('userId', this.localStorageService.user.userId);
      let formDataObj: any = {};
      formDataObj = this.formData;
      this.busySpinner.submitBusy = true;
      this.updateBusySpinner();
      this.cAPAActionPIService.capasubmitWithFileUpload(formDataObj).
        subscribe(res => {
          console.log("CAPA action PI add Success Response: ", res);
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          this.resMsgType = res.msgType;
          if (res.msgType == "Info") {
            this.router.navigate([ROUTE_PATHS.RouteCAPAActionPI]);//route to the previous page
          } else {
            this.resMsgType = this.errorConst;
            this.resErrorMsg = res.msgType;
            this.formData = new FormData();//new instance create of formdata
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
            this.formData = new FormData();//new instance create of formdata
            this.sessionErrorService.routeToLogin(err._body);
          });
    }//end of else 
  } //end of method submit modify capa actn pi
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
  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method
}//end of class
