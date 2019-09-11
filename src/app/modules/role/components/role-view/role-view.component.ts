import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { ViewRoleDataService } from "../../services/view-role-data.service";
import { Router } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-role-view',
  templateUrl: 'role-view.component.html',
  styleUrls: ['role-view.component.css']
})
export class ViewRoleComponent implements OnInit {

  public userViewDetails: any = {}//to show the user det in html page

  public  modifyRoles: string;//for modify user id




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
  public checkAll : boolean = false;
  public otherCheck : boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private viewRoleDataService: ViewRoleDataService,
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
  }

  //method for showing the user details
  getUserViewDetailsValues(sortData?: string, orderType?: string) {
    this.viewRoleDataService.getRoleViewDetails(this.sortSelection.sortData, this.sortSelection.orderType).
      subscribe(res => {
        console.log("roleViewDetail : ", res),
          this.userViewDetails = res;
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
      let removeFlag:boolean = false;
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


  
  //method for add user
  addUser(){
     this.selectedData = [];//removing the array 
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteAddRole]);
  }//end of add user method

  //method for edit user
  editUser(){
    
    for(let user of this.selectedData){
      this.modifyRoles = user.roleId;
    }//end of for
    console.log("userId for modify : ",this.modifyRoles);
        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyRole,this.modifyRoles]);
  }//end of add user method


  

}//end of class
