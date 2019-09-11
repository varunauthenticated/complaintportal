import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { CloseComplaintDIService } from '../../services/close-complaint-di.service';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-close-complaint-di-add',
  templateUrl: 'close-complaint-di-add.component.html',
  styleUrls: ['close-complaint-di-add.component.css']

})
export class CloseComplaintDIAddComponent {
  private plantType: string;
  public title: string = "Close Complaint";

  public closeComplaintDIFormGroup: FormGroup;
  public complaintReferenceNo: string;//to get complaint reference no from route param
  public fileActivityId: number = this.localStorageService.appSettings.closeComplaintActivityId;//to load the files
  //for busy spinner
  public busySpinner: any = {
    compRefDetBusy: true,
    submitBusy: false,//for submit spinner
    busy: true
  };
  public currentDate: string;//for sysdate
  public closeDate: string;//close date

  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  
  //for view in html page
  public remarksDetails: string = "";//text area value for remarks details
  public acknoledgementReceived: string;//radio value for acknoledgement received
  //for error msg
  public resErrorType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  // form data for file upload
  private formData: FormData = new FormData();
  private totalFileSize: number = 0;//file upload error
  private fileSizeLimit: number = 104857600;
  private fileData: FormData;
  public fileList: FileList;
  public submitButtonEnable: boolean = true;//to disable submit button
  public closeRemarksLength: number = this.localStorageService.dbSettings.closeRemarks;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private closeComplaintDIService: CloseComplaintDIService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private datePipe: DatePipe//for date
  ) { }

  ngOnInit(): void {
    this.buildForm();//build form
    this.getRouteParam();//calling method to get route param 
    // this.getSystemDate();//method to get system date
    //checking if route param has value or not 
    if (this.complaintReferenceNo == '') {
      // this.getComplaintReferenceNoDropdownVal();
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }
  }//end of onInit

  //method to get route param
  private getRouteParam(){
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
    });
    console.log("complaintReferenceNo for complaint close di add: ", this.complaintReferenceNo);  
  }//end of method

  //a method named buildform for creating the closeComplaintDIFormGroup and its formControl
  private buildForm(): void {
    this.closeComplaintDIFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'closeDate': [''
      ],
      'acknoledgementReceived': [''
      ],
      'remarks': [''
        , [
          Validators.required,
        ]
      ]
    });
  }//end of method buildForm
  //method to get system date
  private getSystemDate(){
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'dd-MMM-yyyy');
    this.closeComplaintDIFormGroup.controls["closeDate"].setValue(this.currentDate);
    this.closeDate = this.datePipe.transform(this.currentDate, 'dd-MMM-yyyy');
    console.log("  preli::: this.closeDate   ", this.closeDate);    
  }//end of method

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.compRefDetBusy || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if(this.busySpinner.compRefDetBusy == false && this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method

  //radio button click method of acknoledgement received
  public onAcknoledgementReceivedRadioClick(acknoledgementvalue){
    // if(acknoledgementvalue === 'y'){
    //   this.closeComplaintDIFormGroup.get('remarks').setValidators(Validators.required);
    //   this.closeComplaintDIFormGroup.controls['remarks'].markAsTouched();
    // }
    console.log("acknoledgementvalue:: ", acknoledgementvalue);
    this.acknoledgementReceived = acknoledgementvalue;
    this.closeComplaintDIFormGroup.controls["acknoledgementReceived"].setValue(this.acknoledgementReceived);


  }//end of method

  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resErrorType) {
    if (resErrorType == 'Error') {
      this.resErrorType = "Info";
    }
  }//method to delete error msg

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.closeComplaintDIService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice 
        console.log("res for edit comp: ", res);
        this.selectedComplaintReferenceDetails = res.details[0];
        if (res.msgType == "Info") {
          let remarksDetRes: string = this.selectedComplaintReferenceDetails.closeRemarks;
          this.remarksDetails = remarksDetRes.trim();
          this.closeComplaintDIFormGroup.controls["remarks"].setValue(this.remarksDetails);
          //close date
          let resCloseDate = this.selectedComplaintReferenceDetails.closeDate.trim();
          if(resCloseDate){
            this.closeDate = resCloseDate;
          }else{
            this.getSystemDate();
          }

          //plant type
          this.plantType = this.selectedComplaintReferenceDetails.plantType;
          //acknoledgement receive
          let acknoledgementReceivedCloseRes: string = this.selectedComplaintReferenceDetails.acknoledgementReceived;
          if(acknoledgementReceivedCloseRes){//checking acknoledgementReceivedCloseRes has value dn substring the value
            acknoledgementReceivedCloseRes = acknoledgementReceivedCloseRes.substring(0, 1);
          }
          this.acknoledgementReceived = acknoledgementReceivedCloseRes;
          this.closeComplaintDIFormGroup.controls["acknoledgementReceived"].setValue(this.acknoledgementReceived);
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
    console.log("form value of CAPA PI add/modify submit : ", this.closeComplaintDIFormGroup.value);
    let complaintCloseSubmitDet: any = {};
    complaintCloseSubmitDet.complaintReferenceNo = this.complaintReferenceNo;
    complaintCloseSubmitDet.closeRemarks = this.closeComplaintDIFormGroup.value.remarks;//actn det
    complaintCloseSubmitDet.plantType = this.plantType;
    complaintCloseSubmitDet.acknoledgementReceived = this.acknoledgementReceived;
    complaintCloseSubmitDet.closeDate = this.closeDate;
    console.log("onComplaintResolutionPISubmit: ", complaintCloseSubmitDet);
    console.log("this.totalFileSize on submit method:::::::::::", this.totalFileSize);
    
    if (this.totalFileSize > this.fileSizeLimit) {
      this.resErrorType = this.errorConst;
      this.resErrorMsg = "File size should be within 100 mb !";
    } else {
      let jsonArr: any[] = [];//json arr to convert obj toString
      jsonArr.push(JSON.stringify(complaintCloseSubmitDet));
      this.formData.append("closeComplaintDet", jsonArr.toString());
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
      this.closeComplaintDIService.closeComplaintSubmitWithFileUpload(formDataObj).
        subscribe(res => {
          console.log("complaint close di add Success Response: ", res);
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();
          this.resErrorType = res.msgType;
          if (res.msgType == "Info") {
            this.router.navigate([ROUTE_PATHS.RouteCloseComplaintDI]);//route to the previous page
          } else {
            this.resErrorType = res.msgType;
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
        console.log("this.totalFileSize:::::::::::", this.totalFileSize);
      }//end of for
    }//end of if
  }//end of filechange method  
  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method
}//end of class
