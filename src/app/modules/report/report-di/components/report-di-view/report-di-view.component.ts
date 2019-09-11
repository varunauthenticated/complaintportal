/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
// import { ToastService } from "../../home/services/toast-service";
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { ReportsDIDataService } from "../../services/report-di-view-data.service";
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-reports-di-form',
  templateUrl: 'report-di-view.component.html',
  styleUrls: ['report-di-view.component.css']
})
export class ReportsDIViewComponent implements OnInit {
  public complaintDIViewDetails: any = {}//to show the report det in html page
  public modifyComplaint: string;//for modify report id   
  public submitboolean: Boolean = false;//taking a var to show hide grid det n from,to dates in html

  public viewReportsDIRefNo: string;//to send route    
  public misReportFormGroup: FormGroup;//creating formgroup for mis report

  // for checking fromDate and toDate error
  public fromDateErr: boolean = false;
  public toDateErr: boolean = false;

  public currentDate: string;//for sysdate
  public toDate: string;//to date
  public fromDate: string;//from date

  //to show error msg in html
  public resErrFlag: boolean = false;
  public resErrorMsg: string;//to show error msg

  //for busy spinner
  public busySpinner: any = {
    gridBusy: true,
    busy: true
  };
  public title: string = '';
  //report register var to check complaint is registered or not in html
  public complaintLoggedActivityId: number = this.localStorageService.appSettings.complaintRegistrationActivityId;


  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private reportsDIDataService: ReportsDIDataService,
    private modalService: NgbModal,
    private router: Router,
    private sessionErrorService: SessionErrorService,
    private datePipe: DatePipe//for date
  ) {
    console.log("ReportsDIViewComponent Class");
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit ReportsDIViewComponent Class");
    this.buildForm();//calling the buildform method
    this.getParamFromRoute();//get route param
    this.getSystemDate();//method to get system date
    // this.misReportDetailsWSCall();//grid view
  }//end of onInit
  //build form
  private buildForm(): void {
    this.misReportFormGroup = this.formBuilder.group({
      'fromDate': [''
      ],
      'toDate': [''
      ]
    });
  }//end of build form

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.gridBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.gridBusy == false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //method to get route param
  private getParamFromRoute() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      let routeParam: string = params.plantType ? params.plantType : '';//get the viewEditParam to check wheather its edit or not
      console.log(" param from route : ", routeParam);
    });
  }//end of method to get route param

   //method to get system date
   private getSystemDate(){
    //formatting the current date
    let date = new Date();
    this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.misReportFormGroup.controls["toDate"].setValue(this.toDate);
    let custDate = 'Mon Jan 01 2018 00:00:00 GMT+0530'; //set 1st JAN 2018 to from date
    this.fromDate =this.datePipe.transform(custDate, 'yyyy-MM-dd');
    this.misReportFormGroup.controls["fromDate"].setValue(this.fromDate);
    // console.log("  mis report page ::: this.fromDate   ", this.fromDate); 
    this.busySpinner.gridBusy = false;//to set gridbusy false
    this.updateBusySpinner();//call the method to stop the spinner   
  }//end of method

  //method for showing the complaint details by service call
  private misReportDetailsWSCall() {
    this.busySpinner.gridBusy = true;
    //taking any type of json to create json body for ws call
    let misReportJsonBody: any = {};
    misReportJsonBody.fromDate = this.misReportFormGroup.value.fromDate;
    misReportJsonBody.toDate = this.misReportFormGroup.value.toDate;

    console.log("misReportJsonBody::", misReportJsonBody);


    this.reportsDIDataService.getMISReportDetails(misReportJsonBody).
      subscribe(res => {
        console.log("MIS Report View Details:::: ", res);
        if(res.msgType === "Info"){//checking if msgtype is info dn set the res details to the obj
          this.complaintDIViewDetails = res;
        }else if(res.msgType === "Error"){
          this.resErrFlag = true;
          this.resErrorMsg = "No Data Found!";
        }

        this.busySpinner.gridBusy = false;
        this.updateBusySpinner();
      },
        err => {
          console.log(err);
          this.busySpinner.gridBusy = false;
          this.updateBusySpinner();
          this.sessionErrorService.routeToLogin(err._body);
        });
  }//end of service call method

  //method to hide error msg div
  public deleteResErrorMsgOnClick(){
    this.resErrFlag = false;
  }//end of method

  //method to submit dates
  public onClickMISDateSubmit() {
    this.busySpinner.gridBusy = true;//set true to load spinner
    this.updateBusySpinner();//calling the method to load spinner
    this.misReportDetailsWSCall();//grid view
    this.submitboolean = true;//set true  to show the grid
  }//end of method






  // //creating a method to check selectAll checkbox
  // public selectAllCheck() {
  //   this.checkAll = !this.checkAll;
  //   this.selectedData = (this.checkAll) ? this.complaintDIViewDetails.details : [];
  //   console.log("this.selectedData on selectAllCheck method : ", this.selectedData);
  //   if (this.checkAll == true) {
  //     this.otherCheck = true;
  //   } else {
  //     this.otherCheck = false;
  //   }
  // }//end of selectAllCheck method



  // //method for view report-di actn di
  // public viewComplaint(){    
  //   for(let reportsDIDet of this.selectedData){
  //     this.viewReportsDIRefNo = reportsDIDet.complaintReferenceNo;
  //   }//end of for
  //   console.log("complaintRefId for View Reports DI: ",this.viewReportsDIRefNo); 
  //   // this.viewEditParam = "view";     
  //    // Not authenticated
  //   this.router.navigate([ROUTE_PATHS.RouteMisReportViewDetails,'DI',this.viewReportsDIRefNo]);
  // }//end of method for view report-di di

  //method for Complaint Logged On and Compliant Reference Date validation 
  public compareTwoDates(controlName: string) {
    this.fromDateErr = false;
    this.toDateErr = false;
    if(controlName === 'fromDate'){
      if ((new Date(this.misReportFormGroup.controls['fromDate'].value) > new Date(this.misReportFormGroup.controls['toDate'].value))) {
        console.log("fromDate Date error.")
        this.fromDateErr = true;
        this.toDateErr = false;
      }//end of if
    }else if(controlName === 'toDate'){
      if ((new Date(this.misReportFormGroup.controls['toDate'].value) < new Date(this.misReportFormGroup.controls['fromDate'].value))) {
        console.log("toDate Date error.")
        this.toDateErr = true;
        this.fromDateErr = false;
      }//end of if
    }//end of else if
  }//end of method
  
//method to download mis report in new window
public windowOpen(url){
  window.open(url);
}//end of method

}//end of class
