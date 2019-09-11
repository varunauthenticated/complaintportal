/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
import { ComplaintResolutionPIService } from "../services/complaint-resolution-pi.service";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { SessionErrorService } from "../../shared/services/session-error.service";

@Component({
  selector: 'ispl-complaint-resolution-pi-form',
  templateUrl: 'complaint-resolution-pi.component.html',
  styleUrls: ['complaint-resolution-pi.component.css']
})
export class ComplaintResolutionPIComponent implements OnInit {

  public title: string = "Root Cause Analysis";//"Complaint Resolution";
  public complaintPIViewDetails: any = {}//to show the complaint det in html page

  public  modifyReso: string;//for modify complaint id

  //for sorting and orderType
  public sortSelection: any = {
    plantType: 'PI',
    sortData: '',
    orderType: '',
    fileActivityId: this.localStorageService.appSettings.resolutionOfComplaintsAtCustomerPlaceActivityId
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;
  //close complaint var to check complaint is closed or not in html
  public rootCauseAnalysisActivityId: number = this.localStorageService.appSettings.resolutionOfComplaintsAtCustomerPlaceActivityId;

  //busySpinner 
  public busySpinner: any = {
    busy: true,
  }//end of spinner

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private complaintResolutionPIService: ComplaintResolutionPIService,
    private modalService: NgbModal,
    private sessionErrorService: SessionErrorService,
    private router: Router
  ) {
    console.log("View Complain Class");
     // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit View Complain Class");
    this.getcomplaintPIViewDetailsValues(this.sortSelection);
  }//end of onInit

  //method for showing the complaint details  by service call
  private getcomplaintPIViewDetailsValues(viewDetParaJson: any) {
    this.busySpinner.busy = true;//start spinner
    console.log("this.sortselection of complaint resolution pi................... : ",this.sortSelection);
    this.complaintResolutionPIService.getcomplaintViewDetails(this.sortSelection).
      subscribe(res => {
        console.log("complaintPIViewDetails : ", res),
          this.complaintPIViewDetails = res;
          this.busySpinner.busy = false;//stop spinner
      },
      err => {
        console.log(err);
        this.busySpinner.busy = false;//stop spinner
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of service call method  by service call

  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  public onClick(val) {
    console.log("clicked value : " + val);
    if (this.sortSelection.sortData == val) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.getcomplaintPIViewDetailsValues(this.sortSelection);
    this.selectedData = [];//removing the array
  }//end of onclick method

  //creating method to get complaint details by single check
  public complaintDetailsByCheckbox(complaintDetail) {
    this.getComplaintDetailsByCheckbox(complaintDetail);

  }
  getComplaintDetailsByCheckbox(complaintDetail: any) {
    console.log("checked : ", complaintDetail);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push complaintDetail obj to selectedData array
      this.selectedData.push(complaintDetail);
      console.log("complaint selected data : ", this.selectedData);
    } else {
      let indexCount: number = 0;
      let removeFlag:boolean = false;
      for (let selectedData of this.selectedData) {
        if (selectedData.complaintReferenceNo == complaintDetail.complaintReferenceNo) {
          this.selectedData.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("complaint selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("complaint selected data after pushing: ", this.selectedData);
    }//end of else
  }//end of method of getcomplaintDetailByCheckbox


  //creating a method to check selectAll checkbox
  selectAllCheck() {
    this.checkAll = !this.checkAll;
    this.selectedData = (this.checkAll) ? this.complaintPIViewDetails.details : [];
    console.log("this.selectedData on selectAllCheck method : ", this.selectedData);
    if (this.checkAll == true) {
      this.otherCheck = true;
    } else {
      this.otherCheck = false;
    }
  }//end of selectAllCheck method
  
  //method for edit capa actn pi
  editComplaint(){    
    for(let capaActnDet of this.selectedData){
      this.modifyReso = capaActnDet.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify reso pi: ",this.modifyReso);      
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyComplaintResolutionPI,this.modifyReso]);
  }//end of add user method


  
 
}//end of class
