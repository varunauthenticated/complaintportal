import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
@Component({
  selector: 'ispl-pa-di-add-edit',
  templateUrl: 'pa-di-add-edit.component.html',
  styleUrls: ['pa-di-add-edit.component.css']
})
export class PADIAddEditComponent implements OnInit {
  @ViewChild('fileInput')
  fileInputVariable: any;
  private formData: FormData = new FormData(); // form data for file upload
  private totalFileSize: number = 0;//file upload error
  private fileSizeLimit: number = 104857600;
  private fileData: FormData;
  private fileList: FileList;
  public paDIAddEditFormGroup: FormGroup;
  public title: string = "PA";//to show titlee on html page
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

  public rcaDate: string = "";
  public dateErrorFlag: any = {
    futureDateErrFlag: false,
    rcaDateErrFlag: false
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private datePipe: DatePipe,//for date
    private modalService: NgbModal,//modal
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private complaintDIService: ComplaintDIService
  ) {
    this.buildForm();//build form
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of PADIAddEditComponent..");
    this.getRouteParam();//calling method to get route param 
    this.getSystemDate();//method to get system date
  }//end of on init

  //a method named buildform for creating the paDIAddEditFormGroup and its formControl
  private buildForm(): void {
    this.paDIAddEditFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'paAddEditDate': [''
        , [
          Validators.required,
        ]
      ],
      'paAddEditDetails': [''
        , [
          Validators.required,
        ]
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

  //method to get route param
  private getRouteParam() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
    });
    console.log("complaintReferenceNo for pa di add/edit: ", this.routeParam.complaintReferenceNo);
    console.log("this.complaintStatus for pa di view::", this.routeParam.complaintStatus);
    this.paDIAddEditFormGroup.controls['complaintReferenceNo'].setValue(this.routeParam.complaintReferenceNo);
  }//end of method

  //method to get system date
  private getSystemDate() {
    //formatting the current date
    let date = new Date();
    let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.paDIAddEditFormGroup.controls["paAddEditDate"].setValue(currentDate);
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
    let action: string = "pa_add";
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
        } 
      }, err => {
        console.log(err);        
      });
  }//end of method
  // private detCompSubmitFlag: boolean = true;//comp det submit flag
  //method of complaint details submit service call
  private complaintDetailsSubmitWSCall(complainDetailJson: any, plantType: string, action: string) {
    this.complaintDIService.postDetail(complainDetailJson, plantType, action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log(" pa Det submitted successfully");
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
          let routePath = ROUTE_PATHS.RouteAddCloseComplainDI + '/' + this.routeParam.complaintReferenceNo + '/' + 80;//pa status
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
  public onPADIAddEditSubmit() {
    this.busySpinner = true;//to load spinner
    console.log("form value of pa DI add/modify submit : ", this.paDIAddEditFormGroup.value);
    let paWsInfo: any = {};
    paWsInfo.activityId = 70;
    paWsInfo.plantType = this.localStorageService.user.plantType;
    paWsInfo.action = "";
    let paJsonForHeaderTable: any = {};
    paJsonForHeaderTable.lastActivityId = paWsInfo.activityId;
    paJsonForHeaderTable.userId = this.localStorageService.user.userId;
    paJsonForHeaderTable.complaintReferenceNo = this.paDIAddEditFormGroup.value.complaintReferenceNo;
    console.log("pa json for header table::", paJsonForHeaderTable);
    let paJsonForDetTable: any = {};
    paJsonForDetTable.activityId = paWsInfo.activityId;
    paJsonForDetTable.complaintReferenceNo = this.paDIAddEditFormGroup.value.complaintReferenceNo;
    paJsonForDetTable.preventiveAction = this.paDIAddEditFormGroup.value.paAddEditDetails;
    paJsonForDetTable.preventiveActionDate = this.paDIAddEditFormGroup.value.paAddEditDate;
    paJsonForDetTable.userId = this.localStorageService.user.userId;
    paJsonForDetTable.closeDateAtTmlEnd = this.paDIAddEditFormGroup.value.techCloserDate;
    paJsonForDetTable.closeRemarksAtTmlEnd = this.paDIAddEditFormGroup.value.closerremarks;
    console.log("pa json for Det table::", paJsonForDetTable);
    this.complaintDIService.putHeader(paJsonForHeaderTable, paWsInfo.plantType, paWsInfo.action).
      subscribe(res => {
        if (res.msgType === 'Info') {
          console.log("header added successfully");
          this.complaintDetailsSubmitWSCall(paJsonForDetTable, paWsInfo.plantType, paWsInfo.action);
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
  } //end of method 

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

   //method to validate closer date
   public dateValidation(){
    let date = new Date();
    let dateControlName = new Date(this.paDIAddEditFormGroup.controls['techCloserDate'].value);
    let rcaDate = new Date(this.rcaDate);

    //let siteVisitDate: string = this.datePipe.transform(this.invReportFormGroup.controls['siteVisitDt'].value, 'dd-MM-yyyy');
    // if (rcaDate < dateControlName) {
    //   this.dateErrorFlag.futureDateErrFlag = false;
    //   this.dateErrorFlag.rcaDateErrFlag = true;
    // }else 
    if(date < dateControlName) {
      this.dateErrorFlag.futureDateErrFlag = true;
      this.dateErrorFlag.rcaDateErrFlag = false;
    } else {
      this.dateErrorFlag.futureDateErrFlag = false;
      this.dateErrorFlag.rcaDateErrFlag = false;
    }
  }


}//end of class