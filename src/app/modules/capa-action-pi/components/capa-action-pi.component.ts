/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
// import { ToastService } from "../../home/services/toast-service";
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
import { CAPAActionPIService } from "../services/capa-action-pi.service";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { SessionErrorService } from "../../shared/services/session-error.service";


@Component({
  selector: 'ispl-capa-action-pi-form',
  templateUrl: 'capa-action-pi.component.html',
  styleUrls: ['capa-action-pi.component.css']
})
export class CAPAActionPIComponent implements OnInit {

  public title: string = "CAPA";
  public complaintPIViewDetails: any = {}//to show the complaint det in html page
  public  modifyCAPAPI: string;//for modify capa pi

  //for sorting and orderType
  public sortSelection: any = {
   plantType: 'PI',
    sortData: '',
    orderType: '',
    filter: this.localStorageService.appSettings.validComplaintFieldName+"='Y'",
    fileActivityId: this.localStorageService.appSettings.analyseCustomerComplaintsAndActionPlanActivityId
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;
  //close complaint var to check complaint is matched with capaactivityId or not in html
  public capaActivityId: number = this.localStorageService.appSettings.analyseCustomerComplaintsAndActionPlanActivityId;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private capaActionPIService: CAPAActionPIService,
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
    this.getcomplaintViewDetailsValues(this.sortSelection);//grid view
  }//end of onInit

  //method for showing the user details
  getcomplaintViewDetailsValues(viewDetParaJson: any) {
    console.log("this.sortselection of capa-action pi ............: ",this.sortSelection);
    this.capaActionPIService.getcomplaintViewDetails(this.sortSelection).
      subscribe(res => {
        console.log("complaintPIViewDetails for capa actn pi : ", res),
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
    this.getcomplaintViewDetailsValues(this.sortSelection);
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
      console.log("complaint pi selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("complaint pi selected data after pushing: ", this.selectedData);
    }//end of else
  }//end of method of getcomplaintDetailByCheckbox

  //method for edit capa actn pi
  editComplaint(){    
    for(let capaActnDet of this.selectedData){
      this.modifyCAPAPI = capaActnDet.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify capa PI: ",this.modifyCAPAPI);
      
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyCAPAActionPI,this.modifyCAPAPI]);
  }//end of add user method

  
}//end of class
