import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { ComplaintResolutionDIService } from "../../services/complaint-resolution-di.service";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";
// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-complaint-resolution-di-add',
  templateUrl: 'complaint-resolution-di-add.component.html',
  styleUrls: ['complaint-resolution-di-add.component.css']

})
export class ComplaintResoluionDIAddComponent {
  private plantType: string;
  public title: string = "Complaint Resolution Modify";

  public complaintResolutionPIFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint reference no from route param
  public fileActivityId: number = this.localStorageService.appSettings.resolutionOfComplaintsAtCustomerPlaceActivityId;//to load the files

  //for busy spinner
  public busySpinner: any = {
    compRefDetBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  };
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  
  //for view in html page
  public remarksDetails: string = "";//text area value for remarks details

  //for error msg
  public resErrorType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  // form data for file upload
  private formData: FormData = new FormData();
  private totalFileSize: number = 0;
  private fileData: FormData;
  public fileList: FileList;
  public submitButtonEnable: boolean = true;//to disable submit button
  private fileSizeLimit: number = 104857600;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private complaintResolutionDIService: ComplaintResolutionDIService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
  ) { }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
    });
    console.log("complaintReferenceNo for complaint reso add: ", this.complaintReferenceNo);

    if (this.complaintReferenceNo == '') {
      // this.getComplaintReferenceNoDropdownVal();
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }
    this.buildForm();
  }//end of onInit

  //a method named buildform for creating the complaintResolutionPIFormGroup and its formControl
  private buildForm(): void {
    this.complaintResolutionPIFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
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
    } else if(this.busySpinner.compRefDetBusy == false &&  this.busySpinner.submitBusy == false){
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resErrorType) {
    if (resErrorType == 'Error') {
      this.resErrorType = "Info";
    }
  }//method to delete error msg

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.complaintResolutionDIService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice 
        //validInvalidComplaintRemarks = remarks
        //complaintViewValue.complaintReferenceNo,complaintViewValue.actionRecomendedAfterSiteVisit,complaintViewValue.validComplaint,complaintViewValue.validInvalidComplaintRemarks
        console.log("res for edit comp: ", res);
        this.selectedComplaintReferenceDetails = res.details[0];
        if (res.msgType == "Info") {
          let remarksDetRes: string = this.selectedComplaintReferenceDetails.actionRecomendedAfterSiteVisit;
          this.remarksDetails = remarksDetRes.trim();
          this.complaintResolutionPIFormGroup.controls["remarks"].setValue(this.remarksDetails);
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
  public onComplaintResolutionPISubmit() {
    console.log("form value of CAPA PI add/modify submit : ", this.complaintResolutionPIFormGroup.value);
    let complaintResoSubmitDet: any = {};
    complaintResoSubmitDet.complaintReferenceNo = this.complaintReferenceNo;
    complaintResoSubmitDet.actionRecomendedAfterSiteVisit = this.complaintResolutionPIFormGroup.value.remarks;//actn det
    complaintResoSubmitDet.plantType = this.plantType;
    console.log("onComplaintResolutionPISubmit: ", complaintResoSubmitDet);
    console.log("this.totalFileSize on submit method:::::::::::", this.totalFileSize);
    if(this.totalFileSize > this.fileSizeLimit){
      this.resErrorType = this.errorConst;
      this.resErrorMsg = "File size should be within 100 mb !";
    }else{
      let jsonArr: any[] = [];//json arr to convert obj toString
      jsonArr.push(JSON.stringify(complaintResoSubmitDet));
      this.formData.append("complaintResoDet", jsonArr.toString());
      //method to add or update preli
      if (this.fileData != undefined) {
        //check the file size
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
      this.complaintResolutionDIService.complaintResosubmitWithFileUpload(formDataObj).
        subscribe(res => {
          console.log("complaint reso add Success Response: ", res);
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          this.resErrorType = res.msgType;
          if (res.msgType == "Info") {          
              this.router.navigate([ROUTE_PATHS.RouteComplaintResolutionDI]);//route to the previous page
          } else {
            this.resErrorType = this.errorConst;
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
        console.log("this.totalFileSize:::::::::::",this.totalFileSize);
      }//end of for
    }//end of if
  }//end of filechange method  
  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method
}//end of class
