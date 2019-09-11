import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-close-complain-di-add-edit',
  templateUrl: 'close-complain-di-add-edit.component.html',
  styleUrls: ['close-complain-di-add-edit.component.css']

})
export class CloseComplainDIAddEditComponent {
  @ViewChild('fileInput')
  fileInputVariable: any;
  private formData: FormData = new FormData(); // form data for file upload
  private totalFileSize: number = 0;//file upload error
  private fileSizeLimit: number = 104857600;
  private fileData: FormData;
  private fileList: FileList;
  public title: string = "Close Complaint";
  public closeComplainDIFormGroup: FormGroup;
  public closeRemarksLength: number = this.localStorageService.dbSettings.closeRemarks;
  public fileActivityId: number = this.localStorageService.appSettings.closeComplaintActivityId;//to load the files
  public routeParam: any = {
    complaintReferenceNo: '',//to get complaint reference no from route param
    complaintStatus: ''//to fetch complaint status from route
  };
  //for busy spinner
  public busySpinner: boolean = false;
  //for error msg
  public errorMsgObj: any = {
    errorMsg: '',
    errMsgShowFlag: false
  };
  public fileArr: any[] = [];//to store file details from file upload response
  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,//modal
    private datePipe: DatePipe,//for date
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService
  ) {
    this.buildForm();//build form
  }

  ngOnInit(): void {
    this.getRouteParam();//calling method to get route param 
    this.getSystemDate();//method to get system date
  }//end of onInit

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    console.log("complaintReferenceNo for complaint close di add: ", this.routeParam.complaintReferenceNo);
    this.closeComplainDIFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);
  }//end of method

  //a method named buildform for creating the closeComplainDIFormGroup and its formControl
  private buildForm(): void {
    this.closeComplainDIFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'closeDate': [''
      ],
      'acknoledgementReceived': [''
        , [
          Validators.required,
        ]
      ],
      'remarks': [''
        , [
          Validators.required,
        ]
      ]
    });
  }//end of method buildForm
  //method to get system date
  private getSystemDate() {
    //formatting the current date
    let date = new Date();
    let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd'); //'dd-MMM-yyyy');
    this.closeComplainDIFormGroup.controls["closeDate"].setValue(currentDate);
  }//end of method

  private wsErrorCall(err) {
    this.errorMsgObj.errMsgShowFlag = true;
    this.errorMsgObj.errorMsg = err.msg;
    this.busySpinner = false;
    this.sessionErrorService.routeToLogin(err._body);
  }//end of method

  //onOpenModal for opening modal from modalService
  private onOpenModal(complaintReferenceNo: string, msgBody: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Complaint Reference Number: ' + complaintReferenceNo;//'Information';
    modalRef.componentInstance.modalMessage = msgBody;
  }//end of method onOpenModal

  //method to send email
  private sendEmail(complainDetailJson: any, plantType: string){
    let action: string = "close_add";
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

  //method to file upload
  private fileUploadWSCall(plantType: string, fileJsonBody: any) {
    this.complaintDIService.postFile(plantType, fileJsonBody).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("files uploaded successfully");
        } else {
          this.fileUploadWSCall(plantType, fileJsonBody);
        }
      }, err => {
        console.log(err);
        this.fileUploadWSCall(plantType, fileJsonBody);
      });
  }//end of method

  //method of complaint details submit service call
  private complaintDetailsSubmitWSCall(complainDetailJson: any, plantType: string, action: string) {
    this.complaintDIService.postDetail(complainDetailJson, plantType, action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log(" ca Det submitted successfully");
          if (this.fileArr.length > 0) {
            let fileAutoIdStr: string = '';//taking a var to store files autoId
            this.fileArr.forEach(fileEl => {
              fileAutoIdStr = fileAutoIdStr ? (fileAutoIdStr + ',' + fileEl.fileAutoId) : fileEl.fileAutoId;
            });
            let fileJsonBody: any = {};
            fileJsonBody.complaintReferenceNo = complainDetailJson.complaintReferenceNo;
            fileJsonBody.complaintDetailsAutoId = parseInt(res.valueSub);
            fileJsonBody.activityId = complainDetailJson.activityId;
            fileJsonBody.userId = this.localStorageService.user.userId;
            fileJsonBody.fileAutoIds = fileAutoIdStr;
            this.fileUploadWSCall(plantType, fileJsonBody);//calling the file ws method
          }//end of file array check
          this.sendEmail(complainDetailJson,plantType);
          this.onOpenModal(this.routeParam.complaintReferenceNo, res.msg);//open modal to show the msg
          this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
        } else {
          // this.complaintDetailsSubmitWSCall(complainDetailJson, plantType, action);
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = res.msg;
          this.busySpinner = false;//to stop spinner
        }
      },
        err => {
          console.log(err);
          // this.complaintDetailsSubmitWSCall(complainDetailJson, plantType, action);
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = err.msg;
          this.busySpinner = false;
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end of method

  //method of submit modify allocate complaint
  public onComplaintResolutionPISubmit() {
    this.busySpinner = true;//to load spinner
    console.log("form value of Close complain di submit : ", this.closeComplainDIFormGroup.value);
    let closeComplainWsInfo: any = {};
    closeComplainWsInfo.activityId = 80;
    closeComplainWsInfo.plantType = this.localStorageService.user.plantType;
    closeComplainWsInfo.action = "";
    let closeComplainJsonForHeaderTable: any = {};
    closeComplainJsonForHeaderTable.lastActivityId = closeComplainWsInfo.activityId;
    closeComplainJsonForHeaderTable.userId = this.localStorageService.user.userId;
    closeComplainJsonForHeaderTable.complaintReferenceNo = this.closeComplainDIFormGroup.value.complaintReferenceNo;
    console.log("close complain json for header table::", closeComplainJsonForHeaderTable);
    let closeComplainJsonForDetTable: any = {};
    closeComplainJsonForDetTable.activityId = closeComplainWsInfo.activityId;
    closeComplainJsonForDetTable.complaintReferenceNo = this.closeComplainDIFormGroup.value.complaintReferenceNo;
    closeComplainJsonForDetTable.closeRemarks = this.closeComplainDIFormGroup.value.remarks;
    closeComplainJsonForDetTable.acknoledgementReceived = this.closeComplainDIFormGroup.value.acknoledgementReceived;
    closeComplainJsonForDetTable.closeDate = this.closeComplainDIFormGroup.value.closeDate;
    closeComplainJsonForDetTable.userId = this.localStorageService.user.userId;
    console.log("close complain json for Det table::", closeComplainJsonForDetTable);
    this.complaintDIService.putHeader(closeComplainJsonForHeaderTable, closeComplainWsInfo.plantType, closeComplainWsInfo.action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("header added successfully");
          this.complaintDetailsSubmitWSCall(closeComplainJsonForDetTable, closeComplainWsInfo.plantType, closeComplainWsInfo.action);
        } else {
          this.errorMsgObj.errMsgShowFlag = true;
          this.errorMsgObj.errorMsg = res.msg;
          this.busySpinner = false;//to stop spinner
        }
      },
        err => {
          console.log(err);
          this.wsErrorCall(err);
        });
  } //end of method submit close di add

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

  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
  }// end of onCancel method

  //method to delete error msg
  public deleteResErrorMsgOnClick() {
    this.errorMsgObj.errMsgShowFlag = false;
    this.errorMsgObj.errorMsg = "";
  }//end of method delete error msg
}//end of class
