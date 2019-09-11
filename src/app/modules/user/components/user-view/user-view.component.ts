import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { ViewUserDataService } from "../../services/view-user-data.service";
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { SessionErrorService } from "../../../shared/services/session-error.service";



@Component({
  selector: 'ispl-user-view',
  templateUrl: 'user-view.component.html',
  styleUrls: ['user-view.component.css']
})
export class ViewUserComponent implements OnInit {

  public userViewDetails: any = {}//to show the user det in html page

  public modifyUsers: string;//for modify user id

  //for error msg
  public resErrFlag: boolean = false;
  public resErrorMsg: string;

  //for sorting and orderType
  public sortSelection: any = {
    sortData: '',
    orderType: 'NA'
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll: boolean = false;
  public otherCheck: boolean = false;

  //for busy spinner
  public busySpinner: any = {
    submitBusy: false,//for submit spinner
    busy: true
  };


  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private viewUserDataService: ViewUserDataService,
    private sessionErrorService: SessionErrorService,
    private router: Router

  ) {
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }

  ngOnInit(): void {
    this.getUserViewDetailsValues();
  }//end of onInit

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.submitBusy == false) {
      this.busySpinner.busy = false;
    }
  }//end of busy spinner method

  //method for showing the user details
  getUserViewDetailsValues(sortData?: string, orderType?: string) {
    //spinner
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();//load spinner
    this.viewUserDataService.getUserViewDetails(this.sortSelection.sortData, this.sortSelection.orderType).
      subscribe(res => {
        console.log("userViewDetail : ", res);
        if (res.msgType === "Info") {
          this.userViewDetails = res;
          this.resErrFlag = false;          
        } else {
          this.resErrFlag = true;
          this.resErrorMsg = "Netowrk/Server Problem. Please try again.";
        }
        //spinner
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
      },
      err => {
        console.log(err);
        this.resErrFlag = true;
        this.resErrorMsg = "Unable to load data!";
        //spinner
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
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
    this.getUserViewDetailsValues(this.sortSelection.sortData,
      this.sortSelection.orderType);
    this.selectedData = [];//removing the array
  }//end of onclick method

  //creating method to get user details by single check
  userDetailsByCheckbox(userDetail) {
    this.getUserDetailsByCheckbox(userDetail);

  }
  getUserDetailsByCheckbox(userDetail: any) {
    console.log("checked : ", userDetail);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push userDetails obj to selectedData array
      this.selectedData.push(userDetail);
      console.log("selected data : ", this.selectedData);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedData of this.selectedData) {
        if (selectedData.userId == userDetail.userId) {
          this.selectedData.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(userDetail);
      }//end of if
      console.log("selected data after pushing: ", this.selectedData);
    }//end of else
  }//end of method of getUserDetailsByCheckbox


  //creating a method to check selectAll checkbox
  selectAllCheck() {
    this.checkAll = !this.checkAll;
    this.selectedData = (this.checkAll) ? this.userViewDetails.details : [];
    console.log("this.selectedData on selectAllCheck method : ", this.selectedData);
    if (this.checkAll == true) {
      this.otherCheck = true;
    } else {
      this.otherCheck = false;
    }
  }//end of selectAllCheck method


  //creating a method to delete user
  deactivateEmployee() {
    console.log("deactivate method.. ");
    if (confirm("Are you sure, want to deactivate the record(s) ? ") == true) {
      // spinner
      this.busySpinner.submitBusy = true;
      this.updateBusySpinner();;//load spinner
      let deactivateEmployees: string[] = [];
      for (let user of this.selectedData) {
        deactivateEmployees.push(user.userId);
      }//end of for
      console.log("employeeId for deactivate array : ", deactivateEmployees);
      this.selectedData = [];//removing the array
      //method call from service class
      this.viewUserDataService.deactivateEmployee(deactivateEmployees).
      subscribe(res => {
        console.log("employeeViewDetail : ", res);
        if (res.msgType === "Info") {
          // this.userViewDetails = res;
          this.getUserViewDetailsValues();
          this.resErrFlag = false;  
          this.checkAll = true;
          this.selectAllCheck();//to uncheck all 
        } else {
          this.checkAll = true;
          this.selectAllCheck();//to uncheck all;
          this.resErrFlag = true;
          this.resErrorMsg = res.msg;
          //  "Netowrk/Server Problem. Please try again.";
        }
          // spinner
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();;//load spinner
        },
        err => {
          console.log(err);
          this.resErrFlag = true;
          this.resErrorMsg = "Unable to deactivate data!";
          this.checkAll = true;
          this.selectAllCheck();//to uncheck all;
          // spinner
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();//load spinner
          this.sessionErrorService.routeToLogin(err._body);
        });
    }//end of if confirm
  }//end of user deletion method

  //start method for activate user
  public activateEmployee() {
    console.log("activate method.. ");
    if (confirm("Are you sure, want to activate the record(s) ? ") == true) {
      // spinner
      this.busySpinner.submitBusy = true;
      this.updateBusySpinner();;//load spinner
      let activateEmployees: string[] = [];
      for (let user of this.selectedData) {
        activateEmployees.push(user.userId);
      }//end of for
      console.log("employeeId for activate array : ", activateEmployees);
      this.selectedData = [];//removing the array
      //method call from service class
      this.viewUserDataService.activateEmployee(activateEmployees).
      subscribe(res => {
        console.log("employeeViewDetail : ", res);
        if (res.msgType === "Info") {
          // this.userViewDetails = res;
          this.resErrFlag = false;  
          this.checkAll = true;
          this.selectAllCheck();//to uncheck all;
          this.getUserViewDetailsValues();
          } else {
            this.resErrFlag = true;
            this.checkAll = true;
            this.selectAllCheck();//to uncheck all;
            this.resErrorMsg = res.msg;
            //  "Netowrk/Server Problem. Please try again.";
            // res.msg;
            // "Netowrk/Server Problem. Please try again.";
          }
          // spinner
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();//load spinner
        },
        err => {
          console.log(err);
          this.resErrFlag = true;
          this.checkAll = true;
          this.selectAllCheck();//to uncheck all;
          this.resErrorMsg = "Unable to activate data!";
          // spinner
          this.busySpinner.submitBusy = false;
          this.updateBusySpinner();;//load spinner
          this.sessionErrorService.routeToLogin(err._body);
        });
    }//end of if confirm
  }//end of method for activate user
  // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick() {
    this.resErrFlag = false;
  }//method to delete error msg

  //method for add user
  addUser() {
    this.selectedData = [];//removing the array 
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteAddUser]);
  }//end of add user method

  //method for edit user
  editUser() {

    for (let user of this.selectedData) {
      this.modifyUsers = user.userId;
    }//end of for
    console.log("userId for modify : ", this.modifyUsers);

    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyUser, this.modifyUsers]);
  }//end of add user method




}//end of class
