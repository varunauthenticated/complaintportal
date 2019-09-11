import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';

@Component({
  selector: 'ispl-rca-di-add-edit',
  templateUrl: 'rca-di-add-edit.component.html',
  styleUrls: ['rca-di-add-edit.component.css']

})
export class RCADIAddEditComponent implements OnInit {
  @ViewChild('fileInput')
  fileInputVariable: any;
  // form data for file upload
  private formData: FormData = new FormData();
  private totalFileSize: number = 0;//file upload error
  private fileSizeLimit: number = 104857600;
  private fileData: FormData;
  public fileList: FileList;
  public title: string = "RCA";//to show titlee on html page
  public rcaDIAddEditFormGroup: FormGroup;
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
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private datePipe: DatePipe,//for date
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService
  ) {
    this.buildForm();//build form
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of RCADIAddEditComponent..");
    this.getRouteParam();//calling method to get route param 
    this.getSystemDate();//method to get system date
  }//end of on init

  //a method named buildform for creating the rcaDIAddEditFormGroup and its formControl
  private buildForm(): void {
    this.rcaDIAddEditFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'rcaAddEditDate': [''
        , [
          Validators.required,
        ]
      ],
      'rcaAddEditDetails': [''
        , [
          Validators.required,
        ]
      ]
    });
  }//end of method buildForm

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    console.log("complaintReferenceNo for rca di add/edit: ", this.routeParam.complaintReferenceNo);
    console.log("this.complaintStatus for rca di view::", this.routeParam.complaintStatus);
    this.rcaDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);
  }//end of method

  //method to get system date
  private getSystemDate() {
    //formatting the current date
    let date = new Date();
    let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.rcaDIAddEditFormGroup.controls["rcaAddEditDate"].setValue(currentDate);
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
    let action: string = "rca_add";
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
  private fileUploadWSCall(plantType: string,fileJsonBody: any) {
    this.complaintDIService.postFile(plantType,fileJsonBody).
    subscribe(res=>{
      if (res.msgType === 'Info') {
        console.log("files uploaded successfully");
      }
    },err=>{
      console.log(err);
    });
  }//end of method
  // private detCompSubmitFlag: boolean = true;//comp det submit flag
  //method of complaint details submit service call
  private complaintDetailsSubmitWSCall(complainDetailJson: any, plantType: string, action: string) {
    this.complaintDIService.postDetail(complainDetailJson, plantType, action).
    subscribe(res => {
      if (res.msgType === 'Info') {
        console.log(" rca Det submitted successfully");
        if (this.fileArr.length > 0) {
          let fileAutoIdStr: string = '';//taking a var to store files autoId
          this.fileArr.forEach(fileEl => {
            fileAutoIdStr = fileAutoIdStr? (fileAutoIdStr + ',' + fileEl.fileAutoId) : fileEl.fileAutoId;
          });
          let fileJsonBody: any = {};
          fileJsonBody.complaintReferenceNo = complainDetailJson.complaintReferenceNo;
          fileJsonBody.complaintDetailsAutoId = parseInt(res.valueSub);
          fileJsonBody.activityId = complainDetailJson.activityId;
          fileJsonBody.userId = this.localStorageService.user.userId;
          fileJsonBody.fileAutoIds = fileAutoIdStr;
          this.fileUploadWSCall(plantType,fileJsonBody);//calling the file ws method
        }//end of file array check
        this.sendEmail(complainDetailJson,plantType);
        this.onOpenModal(this.routeParam.complaintReferenceNo,res.msg);//open modal to show the msg
        let routePath = ROUTE_PATHS.RouteAddCADI + '/' + this.routeParam.complaintReferenceNo + '/' + 60;//ca status
        this.router.navigate([routePath]);//route
      } else { 
        // if(this.detCompSubmitFlag){
        //   this.complaintDetailsSubmitWSCall(complainDetailJson, plantType, action);
        //   this.detCompSubmitFlag = false;//set it false
        // }//end of if       
        this.errorMsgObj.errMsgShowFlag = true;
        this.errorMsgObj.errorMsg = res.msg;
        this.busySpinner = false;//to stop spinner
      }
    },
      err => {
        console.log(err);
        this.wsErrorCall(err);
        // if(this.detCompSubmitFlag){
        //   this.complaintDetailsSubmitWSCall(complainDetailJson, plantType, action);
        //   this.detCompSubmitFlag = false;//set it false
        // }//end of if   
      });
  }//end of method

   //method of submit modify allocate complaint
   public onRCADIAddEditRejectSubmit(rcaAcceptReject: string) {
    this.busySpinner = true;//to load spinner
    console.log("form value of rca DI add/modify/reject submit : ", this.rcaDIAddEditFormGroup.value);
    let rcaDIAddEditSubmitDet: any = {};
    let rcaWsInfo: any = {};
    rcaWsInfo.activityId = 50;
    rcaWsInfo.plantType = this.localStorageService.user.plantType;
    rcaWsInfo.action = "";
    let rcaJsonForHeaderTable: any = {};
    rcaJsonForHeaderTable.lastActivityId = rcaWsInfo.activityId;
    rcaJsonForHeaderTable.userId = this.localStorageService.user.userId;
    rcaJsonForHeaderTable.complaintReferenceNo = this.rcaDIAddEditFormGroup.value.complaintReferenceNo;
    console.log("rca json for header table::", rcaJsonForHeaderTable);
    let rcaJsonForDetTable: any = {};
    rcaJsonForDetTable.activityId = rcaWsInfo.activityId;
    rcaJsonForDetTable.complaintReferenceNo = this.rcaDIAddEditFormGroup.value.complaintReferenceNo;
    rcaJsonForDetTable.rootCauseAnanysisRemarks = this.rcaDIAddEditFormGroup.value.rcaAddEditDetails;
    rcaJsonForDetTable.rootCauseAnanysisDate = this.rcaDIAddEditFormGroup.value.rcaAddEditDate;
    rcaJsonForDetTable.userId = this.localStorageService.user.userId;
    console.log("rca json for Det table::", rcaJsonForDetTable);
    this.complaintDIService.putHeader(rcaJsonForHeaderTable, rcaWsInfo.plantType, rcaWsInfo.action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("header submitted successfully");
          this.complaintDetailsSubmitWSCall(rcaJsonForDetTable,rcaWsInfo.plantType,rcaWsInfo.action);
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
  } //end of method submit modify capa actn pi

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