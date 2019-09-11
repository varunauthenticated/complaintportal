import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { CAPAActionService } from '../../services/capa-action.service';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-capa-action-pi-add',
  templateUrl: 'capa-action-di-add.component.html',
  styleUrls: ['capa-action-di-add.component.css']

})
export class CAPAActionDIAddComponent {
  private plantType: string;
  public title: string = "CAPA";

  public capaActionDIAddFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint reference no from route param
  public viewEditParam: string;
  public fileActivityId: number = this.localStorageService.appSettings.analyseCustomerComplaintsAndActionPlanActivityId;//to load the files

  //for busy spinner
  public busySpinner: any = {
    compRefDetBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  };
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  
  //for view in html page
  public correctiveActionDetails: string;//textarea for corrective actn det
  public preventiveActionDetails: string;//text area for preventive actn det

  //for error msg
  public resMsgType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  // form data for file upload
  private formData: FormData = new FormData();
  private totalFileSizeForCorrectiveFile: number = 0;//for corrective file upload
  private totalFileSizeForPreventiveFile: number = 0;//for preventive file upload  
  private fileSizeLimit: number = 104857600;//total file size limit== 100 mb
  private preventiveFileData: FormData;
  private correctiveFileData: FormData;
  public preventiveFileList: FileList;
  public correctiveFileList: FileList;
  // public submitButtonEnable: boolean = true;//to disable submit button

  //to store the maxlength for localstorage
  public actionTakenAtPlantLength: number = this.localStorageService.dbSettings.actionTakenAtPlant;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private cAPAActionService: CAPAActionService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService
  ) { }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.viewEditParam = params.viewEditParam;//get the viewEditParam to check wheather its edit or not
    });
    console.log("complaintReferenceNo for CAPA Action DI add: ", this.complaintReferenceNo);
    this.buildForm();//build form
    
    if (this.complaintReferenceNo == '') {
      // this.getComplaintReferenceNoDropdownVal();
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }//end of else
    //set mandetory field as required
    if(this.viewEditParam === 'Edit'){
      // this.capaActionDIAddFormGroup.get('actionDet').setValidators(Validators.required);
      this.capaActionDIAddFormGroup.get('correctiveActionDet').setValidators(Validators.required);
    }//end of if
  }//end of onInit

  //a method named buildform for creating the capaActionDIAddFormGroup and its formControl
  private buildForm(): void {
    this.capaActionDIAddFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'correctiveActionDet': [''
      ],
      'preventiveActionDet': [''
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
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }
  }//method to delete error msg

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.cAPAActionService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice
        console.log("res for edit comp: ", res);
        this.selectedComplaintReferenceDetails = res.details[0];
        if (res.msgType == "Info") {
          this.capaActionDIAddFormGroup.controls["complaintReferenceNo"].setValue(this.complaintReferenceNo);
          
          let correctiveActnDetailsFromRes: string = this.selectedComplaintReferenceDetails.correctiveAction;
          this.correctiveActionDetails = correctiveActnDetailsFromRes.trim();
          this.capaActionDIAddFormGroup.controls["correctiveActionDet"].setValue(this.correctiveActionDetails);


          let preventiveActnDetailsFromRes: string = this.selectedComplaintReferenceDetails.preventiveAction;
          this.preventiveActionDetails = preventiveActnDetailsFromRes.trim();
          this.capaActionDIAddFormGroup.controls["preventiveActionDet"].setValue(this.preventiveActionDetails);
          //set mandetory field as required field
          if(this.viewEditParam === 'modify'){
            this.capaActionDIAddFormGroup.get('correctiveActionDet').setValidators(Validators.required);

          }
          // this.capaActionDIAddFormGroup.controls["actionDet"].setValue(this.correctiveActionDetails);
          this.plantType = this.selectedComplaintReferenceDetails.plantType;
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

  //method of submit modify allocate complaint
  public onCAPAActionDISubmit() {
    console.log("form value of CAPA DI add/modify submit : ", this.capaActionDIAddFormGroup.value);
    let cAPAActionDIDet: any = {};
    cAPAActionDIDet.complaintReferenceNo = this.complaintReferenceNo;
    cAPAActionDIDet.correctiveAction = this.capaActionDIAddFormGroup.value.correctiveActionDet;//corrective actn det
    cAPAActionDIDet.preventiveAction = this.capaActionDIAddFormGroup.value.preventiveActionDet;//preventive actn det
    cAPAActionDIDet.plantType = this.plantType;
    console.log("onCAPAActionDISubmit: ", cAPAActionDIDet);
    let totalFileSize: number = this.totalFileSizeForCorrectiveFile + this.totalFileSizeForPreventiveFile;
    console.log("totalFileSize on submit method:::::::::::", totalFileSize);
    if (totalFileSize > this.fileSizeLimit) {//checking file size in total
      this.resMsgType = this.errorConst;
      this.resErrorMsg = "File size should be within 100 mb !";
    } else {
      let jsonArr: any[] = [];//json arr to convert obj toString
      jsonArr.push(JSON.stringify(cAPAActionDIDet));
      this.formData.append("cAPAActionDet", jsonArr.toString());
      //start if of corrective file data is !undefined
      if (this.correctiveFileData != undefined) {
        for (let i: number = 0; i < this.correctiveFileList.length; i++) {
          console.log(" file upload", this.correctiveFileData.get('correctiveActionUploadFile' + i.toString()));
          if (this.correctiveFileData.get('correctiveActionUploadFile' + i.toString()) != null) {
            this.formData.append('correctiveActionUploadFile' + i.toString(), this.correctiveFileData.get('correctiveActionUploadFile' + i.toString()));
          }//end of if
        }//end of for
      }//end of if corrective fileData is !undefined
      //start if of preventive file data is !undefined
      if (this.preventiveFileData != undefined) {
        for (let i: number = 0; i < this.preventiveFileList.length; i++) {
          console.log("preventive file upload", this.preventiveFileData.get('preventiveActionUploadFile' + i.toString()));
          if (this.preventiveFileData.get('preventiveActionUploadFile' + i.toString()) != null) {
            this.formData.append('preventiveActionUploadFile' + i.toString(), this.preventiveFileData.get('preventiveActionUploadFile' + i.toString()));
          }//end of if
        }//end of for
      }//end of if preventive fileData is !undefined

      this.formData.append('Accept', 'application/json');
      this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
      this.formData.append('menuId', 'DEFAULT1');
      this.formData.append('userId', this.localStorageService.user.userId);
      let formDataObj: any = {};
      this.busySpinner.submitBusy = true;
      this.updateBusySpinner();
      formDataObj = this.formData;
      this.cAPAActionService.capasubmitWithFileUpload(formDataObj).
        subscribe(res => {
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          console.log("CAPA action DI add Success Response: ", res);
          this.resMsgType = res.msgType;
          if (res.msgType == "Info") {
            this.router.navigate([ROUTE_PATHS.RouteCAPAActionDI,this.viewEditParam]);//route to the previous page
          } else {
            this.resMsgType = this.errorConst;
            this.resErrorMsg = "Netowrk/Server Problem. Please try again.";
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
  } //end of method submit modify capa actn di

  //file upload event for corrective
  public fileChangeForCorrective(event) {
    this.correctiveFileData = new FormData();
    this.totalFileSizeForCorrectiveFile = 0;
    this.correctiveFileList = event.target.files;
    if (this.correctiveFileList.length > 0) {
      for (let i: number = 0; i < this.correctiveFileList.length; i++) {
        let file: File = this.correctiveFileList[i];
        this.correctiveFileData.append('correctiveActionUploadFile' + i.toString(), file, file.name);
        this.totalFileSizeForCorrectiveFile = this.totalFileSizeForCorrectiveFile + file.size;
        console.log("this.totalFileSizeForCorrectiveFile:::::::::::", this.totalFileSizeForCorrectiveFile);
      }//end of for
    }//end of if
  }//end of filechange method for corrective
  //file upload event for preventive
  public fileChangeForPreventive(event) {
    this.preventiveFileData = new FormData();
    this.totalFileSizeForPreventiveFile = 0;
    this.preventiveFileList = event.target.files;
    if (this.preventiveFileList.length > 0) {
      for (let i: number = 0; i < this.preventiveFileList.length; i++) {
        let file: File = this.preventiveFileList[i];
        this.preventiveFileData.append('preventiveActionUploadFile' + i.toString(), file, file.name);
        this.totalFileSizeForPreventiveFile = this.totalFileSizeForPreventiveFile + file.size;
        console.log("this.totalFileSizeForPreventiveFile:::::::::::", this.totalFileSizeForPreventiveFile);
      }//end of for
    }//end of if
  }//end of filechange method for preventive
  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method
}//end of class
