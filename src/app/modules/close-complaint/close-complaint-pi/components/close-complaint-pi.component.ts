import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CloseComplaintPIService } from "../services/close-complaint-pi.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-close-complaint-pi-form',
  templateUrl: 'close-complaint-pi.component.html',
  styleUrls: ['close-complaint-pi.component.css']
})
export class CloseComplaintPIComponent implements OnInit {
    public title: string = "Close Complaint";
    public complaintPIViewDetails: any = {}//to show the complaint det in html page
    public  modifyCloseComplaint: string;//for modify complaint id

  //for sorting and orderType
  public sortSelection: any = {
    plantType: 'PI',
    sortData: '',
    orderType: '',
    filter:this.localStorageService.appSettings.complaintLoggedByFieldName +"='"+this.localStorageService.user.userId+"'",
    fileActivityId: this.localStorageService.appSettings.closeComplaintActivityId
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private closeComplaintPIService: CloseComplaintPIService,
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
    this.complaintViewWsCall(this.sortSelection);//grid view
  }//end of onInit

  //method for showing the user details
  complaintViewWsCall(viewDetParaJson: any) {
    console.log("this.sortselection of close complaint pi............... : ",this.sortSelection);
    this.closeComplaintPIService.getcomplaintViewDetails(this.sortSelection).
      subscribe(res => {
        console.log("complaintPIViewDetails : ", res),
          this.complaintPIViewDetails = res;
      },
      err => {
        console.log(err);
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of service call method

  //creating a method for getting the value of heading and sorting all data accordin to ordertype
  onClick(val) {
    console.log("clicked value : " + val);
    if (this.sortSelection.sortData == val) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = val;
    console.log("sortSelection : ", this.sortSelection);
    this.complaintViewWsCall(this.sortSelection);
    this.selectedData = [];//removing the array
  }//end of onclick method

  //creating method to get complaint details by single check
  complaintDetailsByCheckbox(complaintDetail) {
    this.getComplaintDetailsByCheckbox(complaintDetail);

  }
  getComplaintDetailsByCheckbox(complaintDetail: any) {
    console.log("checked : ", complaintDetail);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push complaintDetail obj to selectedData array
      this.selectedData.push(complaintDetail);
      console.log("complaint di selected data : ", this.selectedData);
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
      console.log("complaint di selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("complaint di selected data after pushing: ", this.selectedData);
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

  //method for edit user
  editComplaint(){    
    for(let user of this.selectedData){
      this.modifyCloseComplaint = user.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify : ",this.modifyCloseComplaint);      
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyCloseCoimplaintPI,this.modifyCloseComplaint]);
  }//end of add user method
    
}//end of class