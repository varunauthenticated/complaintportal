import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { AllocateComplaintDIDataService } from '../../services/allocate-complaint-data.services';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

// import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ispl-allocate-complaint-add',
  templateUrl: 'allocate-complaint-add.component.html',
  styleUrls: ['allocate-complaint-add.component.css']

})
export class AllocateComplaintAddComponent {

  public title: string = "Allocate Complaint";
  public fileActivityId: number = 0;//to load the files


  public allocateComplaintAddFormGroup: FormGroup;
  public siteVisitByDropDownList: any = [];//to store the values from webservice
  public departmentNameDropDownList: any[] = [];//for department name dropdown
  //for error msg
  public resMsgType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  //for update allocate complaint
  public loggedOnDtForModify: string;
  public siteVisitDtForModify: string;
  public siteVisitByForModify: string;

  public complaintReferenceNo: string;//to get complaint reference no from route param
  // public compRefDropdownVal: any = [];//to get complaint ref nos list foradd allocate complaint
  public selectedComplaintReferenceDetails: any = {};//to get selected complaint values  


  //for site visit validation
  public loggedOnDt: string = "Info";
  public siteVisitDt: string = "Info";
  public siteVisitDtloggedOnDt = "Info";
  public currentDate: string;
  public currentDtloggedOnDt = "Info";
  public submitButtonEnable: boolean = false;
  public siteVisitError: boolean = false; //to show the site visit error div

  public viewEditParam: string = "";

  //error var
  public allocateComplaintAddError: string;

  public resErrorType: any;

  //for busy spinner
  public busySpinner: any = {
    siteVisitBusy: false,
    submitAllocateBusy: false,
    compRefDetBusy: true,
    busy: true
  };


  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private allocatecomplaintDiDataService: AllocateComplaintDIDataService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService
  ) { }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
      this.viewEditParam = params.viewEditParam;
    });
    console.log("complaintReferenceNo for allocate Complaint add: ", this.complaintReferenceNo);
    if (this.complaintReferenceNo == '') {
      // this.getComplaintReferenceNoDropdownVal();
    } else {
      this.getComplaintReferenceDetails(this.complaintReferenceNo, this.fileActivityId);
    }
    this.buildForm();
    //this.getSelectValues();//for site visit by
    this.getDepartmentNameValues();// for departmaent anme
    if (this.viewEditParam == 'Edit') {
      this.allocateComplaintAddFormGroup.get('siteVisitByDepartmentName').setValidators(Validators.required);
      this.allocateComplaintAddFormGroup.get('siteVisitBy').setValidators(Validators.required);
    }

  }//end of onInit

  //start method of getDepartmentNameValues
  private getDepartmentNameValues() {
    this.departmentNameDropDownList.push({ key: "", value: "-- Select --" });
    this.departmentNameDropDownList.push({ key: "SALES", value: "SALES" });
    this.departmentNameDropDownList.push({ key: "QA", value: "QA" });
    this.departmentNameDropDownList.push({ key: "OTHERS", value: "OTHERS" });
    this.siteVisitByDropDownList = [
      { Key: '', Value: '-- Select --' }
    ];
    for (let siteVisitBy of this.siteVisitByDropDownList) {
      if (siteVisitBy.Key == "") {
        this.allocateComplaintAddFormGroup.controls["siteVisitBy"].setValue(siteVisitBy.Key);
        break;
      }//end if
    }//end for
  }//end method of getDepartmentNameValues

  //method to get sitevisitby values from ComplaintDIRegisterDataService  
  private getSiteVisitByDepartmentNameValues(departmentNameParam: string , siteVisitByParam ?: string) {
    let departmentName: string = departmentNameParam;
    let siteVisitBy: string = siteVisitByParam;
    if (departmentName == "") {
      this.siteVisitByDropDownList = [
        { Key: '', Value: '-- Select --' }
      ]
      this.allocateComplaintAddFormGroup.controls["siteVisitBy"].setValue("");
    } else {
      this.busySpinner.siteVisitBusy = true;
      this.updateBusySpinner();//method for busy spinner
      //getting values of site visit by 
      this.allocatecomplaintDiDataService.getSelectValSiteVisitBy(departmentNameParam).
        subscribe(res => {
          this.allocateComplaintAddFormGroup.controls["siteVisitBy"].setValue("");
          this.siteVisitByDropDownList = res.details;
          console.log(" siteVisitByDropDownList ===>", this.siteVisitByDropDownList);
          this.busySpinner.siteVisitBusy = false;//busy spinner
          this.updateBusySpinner();//method for busy spinner
          for(let siteVisitBy of  this.siteVisitByDropDownList){
            if(siteVisitBy.Key == siteVisitByParam){
              this.allocateComplaintAddFormGroup.controls["siteVisitBy"].setValue(siteVisitByParam);
              break;
            }
          }
        },
        err => {
          console.log(err);
          this.busySpinner.siteVisitBusy = false;//busy spinner
          this.updateBusySpinner();//method for busy spinner
          this.sessionErrorService.routeToLogin(err._body);
        });
    }
  }//end method getSelectValues

  //a method named buildform for creating the allocateComplaintAddFormGroup and its formControl
  private buildForm(): void {
    this.allocateComplaintAddFormGroup = this.formBuilder.group({
      'complaintReferenceNo': [''
      ],
      'loggedOnDt': [''
      ],
      'siteVisitDt': [''
      ],
      'siteVisitByDepartmentName': [''
      ],
      'siteVisitBy': [''
      ]
    });

  }//end of method buildForm

  //method to get complaint ref details and set the values to the html page
  public getComplaintReferenceDetails(complaintReferenceNo: string, fileActivityId: number) {
    this.allocatecomplaintDiDataService.getComplaintReferenceDetailsView(complaintReferenceNo, fileActivityId)
      .subscribe(res => {
        //getting the comp ref details from webservice
        this.selectedComplaintReferenceDetails = res.details[0];
        console.log("res for edit comp: ", res);
        this.resMsgType = res.msgType;
        if (res.msgType == "Info") {
          console.log("comprefdetobj for edit comp: ", this.selectedComplaintReferenceDetails);

          this.loggedOnDtForModify = this.datePipe.transform(this.selectedComplaintReferenceDetails.loggedOnDt, 'yyyy-MM-dd');
          // console.log(" logged on date::=>>>>>>>>>",this.loggedOnDtForModify);
          this.allocateComplaintAddFormGroup.controls["loggedOnDt"].setValue(this.loggedOnDtForModify);
          this.siteVisitDtForModify = this.datePipe.transform(this.selectedComplaintReferenceDetails.siteVisitDt, 'yyyy-MM-dd');
          this.allocateComplaintAddFormGroup.controls["siteVisitDt"].setValue(this.siteVisitDtForModify);
          this.allocateComplaintAddFormGroup.controls["complaintReferenceNo"].setValue(this.complaintReferenceNo);
          let siteVisitByDepartmentName: string = this.selectedComplaintReferenceDetails.siteVisitByDepartmentName.trim();
          this.allocateComplaintAddFormGroup.controls["siteVisitByDepartmentName"].setValue(siteVisitByDepartmentName);
          this.siteVisitByForModify = this.selectedComplaintReferenceDetails.siteVisitBy;
          this.siteVisitByForModify = this.siteVisitByForModify.trim();
          this.onChangeDepartmentName(siteVisitByDepartmentName, this.siteVisitByForModify);                
          this.submitButtonEnable = true;//to enable submit button   
        } else {
          this.resMsgType = this.errorConst;
          this.resErrorMsg = "Netowrk/Server Problem. Please try again.";
        }
        this.busySpinner.compRefDetBusy = false;//busy spinner
        this.updateBusySpinner();//method for busy spinner
      },
      err => {
        if (err.status == 401) {
          this.resErrorMsg = "Sorry! Unable to save data. Please try again.";
        } else {
          this.resErrorMsg = "Netowrk/Server Problem";
        }
        console.log("allocate add--get ref no det-- error", err);
        this.busySpinner.compRefDetBusy = false;//busy spinner
        this.updateBusySpinner();//method for busy spinner
        this.sessionErrorService.routeToLogin(err._body);

      });

  }//end of method to get complaint ref details and set the values to the html page

  //start method compareSiteVisitDt
  public compareSiteVisitDt() {
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.siteVisitDt = "Info";
    this.siteVisitDtloggedOnDt = "Info";
    this.submitButtonEnable = true;
    // if loggedOnDt is greater than siteVisitDtthan this else if condition will be executed
    if (new Date(this.allocateComplaintAddFormGroup.controls['siteVisitDt'].value) < new Date(this.allocateComplaintAddFormGroup.controls['loggedOnDt'].value)) {
      console.log("Date error.")
      this.siteVisitDt = "Error";
      this.submitButtonEnable = false;
      this.siteVisitDtloggedOnDt = "Info";
    } else if (this.currentDtloggedOnDt == "Error" || this.siteVisitDtloggedOnDt == "Error" || this.siteVisitDt == "Error" || this.loggedOnDt == "Error") {
      this.submitButtonEnable = false;
    }
  }//end of method compareSiteVisitDt

  //method of submit modify allocate complaint
  onAllocateComplainSubmit() {

    console.log("form value of allocate complaint add submit : ", this.allocateComplaintAddFormGroup.value);
    let allocateComplaintDet: any = {};
    allocateComplaintDet.complaintReferenceNo = this.complaintReferenceNo;
    // ?this.allocateComplaintAddFormGroup.value.complaintReferenceNo
    //  : this.allocateComplaintAddFormGroup.value.compRefNoDrpDwn;
    allocateComplaintDet.loggedOnDt = this.allocateComplaintAddFormGroup.value.loggedOnDt;
    allocateComplaintDet.siteVisitDt = this.allocateComplaintAddFormGroup.value.siteVisitDt;
    allocateComplaintDet.siteVisitByDepartmentName = this.allocateComplaintAddFormGroup.value.siteVisitByDepartmentName;
    allocateComplaintDet.siteVisitBy = this.allocateComplaintAddFormGroup.value.siteVisitBy;
    console.log("onAllocateComplainSubmit: ", allocateComplaintDet);
    this.busySpinner.submitAllocateBusy = true;
    this.updateBusySpinner();
    this.allocatecomplaintDiDataService.allocateComplaintSubmitDetails(allocateComplaintDet).
      subscribe(res => {
        console.log("Allocate Comnplaint Success Response: ", res);
        this.resMsgType = res.msgType;
        if (res.msgType == "Info") {
          this.router.navigate([ROUTE_PATHS.RouteAllocateComplaint,this.viewEditParam]);
        } else {
          this.resMsgType = this.errorConst;
          this.resErrorMsg = "Netowrk/Server Problem. Please try again.";
        }
        this.busySpinner.submitAllocateBusy = false;
        this.updateBusySpinner();
      },
      err => {
        if (err.status == 401) {
          this.resErrorMsg = "Sorry! Unable to save data. Please try again.";
        } else {
          this.resErrorMsg = "Netowrk/Server Problem";
        }
        this.busySpinner.submitAllocateBusy = false;
        this.updateBusySpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });

  } //end of method submit modify allocate complaint
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }
  }//method to delete error msg

  //for clicking cancel button this method will be invoked
  public onCancel(): void {
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }// end of onCancel method

  //start method of onSiteVisitBySelect
  public onChangeDepartmentName(departmentNameParam: string, siteVisitByParam ?: string) {
    let departmentName: string = departmentNameParam;
    this.getSiteVisitByDepartmentNameValues(departmentName, siteVisitByParam);
  }//end of the method of onSiteVisitBySelect

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.compRefDetBusy || this.busySpinner.siteVisitBusy || this.busySpinner.submitAllocateBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.compRefDetBusy == false && this.busySpinner.siteVisitBusy == false || this.busySpinner.submitAllocateBusy == false ) {
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method


}//end of class
