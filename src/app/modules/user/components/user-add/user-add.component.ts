import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl,FormArray } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { AddUserDataService } from "../../services/add-user-data.service";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { Subscription } from 'rxjs/Subscription';//to get route param
import {forkJoin} from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { NgbdModalComponent } from '../../../widget/modal/components/modal-component';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-user-add',
  templateUrl: 'user-add.component.html',
  styleUrls: ['user-add.component.css']
})
export class AddUserComponent implements OnInit {

  public title : string = '';
  public userAddFormGroup: FormGroup;
  public designationVal: any = {};//to store designation val
  public departmentVal: any = {};//to store department Val
  public plantTypeVal: any = {};//to store plant type vals
  public roleNames: any = {};
  public mobileNo: string = '';
  public emailId: string = '';

  //to store report to val
  public reportToVal: any[] = [];

  //employeeId for modify
   public employeeId: string = '';
   public userDetails: any = [];//for userDetails

  //to store the maxlength for localstorage
  public employeeIdLength: number = this.localStorageService.dbSettings.employeeId;
  public employeeNameLength: number = this.localStorageService.dbSettings.employeeName;
  public employeeMobileNoLength: number = this.localStorageService.dbSettings.employeeMobileNo;
  public employeeEmailIdLength: number = this.localStorageService.dbSettings.employeeEmailId;
  
  public commercialSettlementLevel: any[] = [
    {Key : '', Value: "--Select--"},
    {Key:0,Value:"Unauthorised Member"},
    {Key:1,Value:"Viewer"},
    {Key:2,Value:"CAM"},
    {Key:3,Value:"COS"},
    {Key:4,Value:"EVP"},
    {Key:5,Value:"FICO"}   
  ];
  //  public userModifyRoleId: string;
  //for error msg
  public resMsgType: string = "Info";
  public resErrorMsg: string;
  public errorConst: string = "Error";
  //busySpinner 
  public busySpinner: any = {
    submitBusy: false,//for submit spinner
    busy: true,
    reportToBusy: true
  }
  
  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private addUserDataService : AddUserDataService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private modalService: NgbModal,//modal
    // private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    let routeSubscription: Subscription;
        routeSubscription = this.activatedroute.params.subscribe(params => {
          this.employeeId = params.userId ? params.userId : '';
    });
    console.log("user id for modify in add-user-component: ",this.employeeId);
    
    this.buildForm();
    this.getSelectValues();
    this.getUserViewDetailsValues();
    this.selectedUserId(this.employeeId);//method to get user details by user id
    this.title = this.employeeId ? 'Modify User' : 'Add User';//set the title according to the employeeId
  }//end of ngOnInit

  

  private getSelectValues() {

    //forkjoin
    let userDetData: any[] = [];
    userDetData.push(this.addUserDataService.getSelectValRoleName());
    userDetData.push(this.addUserDataService.getSelectValDepartmentDet());
    userDetData.push(this.addUserDataService.getSelectValDesignationDet());
    userDetData.push(this.addUserDataService.getSelectValPlantTypeDet());

     forkJoin(userDetData).
      subscribe(res => {
        console.log("res array: ", res);
        this.roleNames = res[0];
        console.log(" rolenames", this.roleNames.details);
        this.departmentVal = res[1];
        this.designationVal = res[2];
        this.plantTypeVal = res[3];
        this.busySpinner.busy = false;
      },
      err => {
        console.log(err);
        this.busySpinner.busy = false;
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of service call method


   //method for showing the user details
   getUserViewDetailsValues() {
     let reportToResVal: any = {};
    this.addUserDataService.getUserViewDetails().
      subscribe(res => {
        console.log("userViewDetail : ", res),
        reportToResVal = res.details;
        console.log(" reportToResVal ",reportToResVal);
        this.createReportToMap(reportToResVal);
        this.busySpinner.reportToBusy = false;
      },
      err => {
        console.log(err);
        this.busySpinner.reportToBusy = false;
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of service call method

  //start method to create reportTo dropdown 
  createReportToMap(reportToResValParam: any){
    this.reportToVal.push({reportToEmployeeId: '', reportToEmployeeName: '-- Select --'})
    let reportToAll: any = reportToResValParam;
    for(let reprtTo of reportToAll){
      if(reprtTo.active == "YES"){
        // if(this.userDetails.reportToEmployeeId == null){
        //   this.userDetails.reportToEmployeeId = '';
        //   this.userAddFormGroup.controls["reportToEmployeeId"].setValue(this.userDetails.reportToEmployeeId);
        // }
        this.reportToVal.push({reportToEmployeeId: reprtTo.employeeId, reportToEmployeeName: reprtTo.employeeName});
      }
    }
    console.log("reportToVal ===> ",this.reportToVal);
  }//end of the method


  //onOpenModal for opening modal from modalService
  private onOpenModal(addModifyUserId) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
  
  modalRef.componentInstance.modalMessage =
  this.employeeId ? 
    "Employee Id "+addModifyUserId + " updated successfully."
    : "Employee Id "+ addModifyUserId + " created successfully.";
  }
  //end of method onOpenModal


  private buildForm(): void {
    this.userAddFormGroup = this.formBuilder.group({
      'employeeId':[''
        ,[
          Validators.required
          // Validators.pattern("[a-zA-Z][a-zA-Z ]+")

        ]
      ],//for add
      'employeeName':[''
        ,[
          Validators.required
        ]
      ],
      'designationName':[''
        ,[
          Validators.required
        ]
      ],
      'departmentName':[''
        ,[
          Validators.required
        ]
      ],
      'mobileNo':[''
        ,[
          Validators.required
        ]
      ],
      'emailId':[''
        ,[
          Validators.required
        ]
      ],
      'plantType':[''
        ,[
          Validators.required
        ]
      ],
      'roleId':[''
        ,[
          Validators.required
        ]
      ],
      //modify employee id
      'employeeIdForModify':[''],
      'reportToEmployeeId': [''],
      'commSettLevel':[''
        ,[
          Validators.required
        ]
      ]

      // 'newlyRegistered':[''],
      // 'roleIdForModify':['']
    });
  }
  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.submitBusy ) {
      this.busySpinner.busy = true;
      this.busySpinner.reportToBusy = true;
    } else if(this.busySpinner.submitBusy== false){
      this.busySpinner.busy = false;
      this.busySpinner.reportToBusy = false;
    }//end of else if
  }//end of busy spinner method
  //submit add user data
  public addUserSubmit(): void {

    console.log("user Details value",this.userAddFormGroup.value);
    let user: any = {};
    user.employeeId = this.employeeId ? this.userAddFormGroup.value.employeeIdForModify : this.userAddFormGroup.value.employeeId;
    user.employeeName = this.userAddFormGroup.value.employeeName;
    user.designationId = this.userAddFormGroup.value.designationName;
    user.departmentId = this.userAddFormGroup.value.departmentName;
    user.employeeMobileNo = this.userAddFormGroup.value.mobileNo;
    user.employeeEmailId = this.userAddFormGroup.value.emailId;
    user.plantType = this.userAddFormGroup.value.plantType;
    user.roleId =  this.userAddFormGroup.value.roleId;
    user.reportToEmployeeId = this.userAddFormGroup.value.reportToEmployeeId;
    user.commSetlementLevel = parseInt(this.userAddFormGroup.value.commSettLevel);
    // user.employeeId = this.userAddFormGroup.value.employeeId;

    // user.isNew = this.employeeId ?   this.userAddFormGroup.value.newlyRegistered : '';
    console.log("User Details for add/modify: ", user);
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();

    let methodOfServiceCall: any;//for add or modify service call
    //checking add or modify user
    methodOfServiceCall = 
    this.employeeId ? 
    this.addUserDataService.userModifyDetailsSubmit(user)
    : this.addUserDataService.authenticate(user);

    methodOfServiceCall.
    subscribe(res => {
        console.log("Add/Modify User Success Response: ",res);
        let modifiedUserId = res.value;
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        this.resMsgType = res.msgType;
        if (res.msgType == "Info") {
          //calling the onOpenModal method to open the modal and passing the complaint reference no to it
          this.onOpenModal(modifiedUserId);
          this.router.navigate([ROUTE_PATHS.RouteHome]);
        } else {
          this.resMsgType = this.errorConst;
          this.resErrorMsg = res.msg;
          // "Netowrk/Server Problem. Please try again.";
        }
      },
      err => {
        this.busySpinner.submitBusy = false;
        this.updateBusySpinner();
        if (err.status == 401) {
          this.resErrorMsg = "Invalid User Credentials";
        } else {
          this.resErrorMsg = "Netowrk/Server Problem";
        }
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of method addUserSubmit

  //method to show the selected user id details
    selectedUserId(employeeId){
      console.log("selected employeeId : " +this.employeeId);
      if(this.employeeId == ''){

      }else{
        this.getUserDetailsByUserId(this.employeeId);
      }

    }//end of selectedUserId method

    //to get modify user details by employeeId
    getUserDetailsByUserId(employeeId:string){
    this.busySpinner.busy = true;
    this.addUserDataService.getUserDetailsByUserId(this.employeeId).
    subscribe( res =>{
        console.log("userDetailByUserId : ",res);
        this.userDetails = res.details[0];
        console.log("userDetailByUserId in array format: ",this.userDetails);
        if (res.msgType == "Info") {
        //itrate for selected data
          this.userAddFormGroup.controls["employeeId"].setValue(this.employeeId);//for button disable function in html
          this.userAddFormGroup.controls["employeeIdForModify"].setValue(this.employeeId);//set the value of employeeId for modify user
          this.userAddFormGroup.controls["employeeName"].setValue(this.userDetails.employeeName.trim());//set employee id for modify user
          this.userAddFormGroup.controls["designationName"].setValue(this.userDetails.designationId.trim());
          this.userAddFormGroup.controls["departmentName"].setValue(this.userDetails.departmentId.trim());          
          this.userAddFormGroup.controls["commSettLevel"].setValue(this.userDetails.commSetlementLevel);          
          this.userAddFormGroup.controls["mobileNo"].setValue(this.userDetails.employeeMobileNo.trim());
          this.userAddFormGroup.controls["emailId"].setValue(this.userDetails.employeeEmailId.trim());
          this.userAddFormGroup.controls["plantType"].setValue(this.userDetails.plantType);
          this.userAddFormGroup.controls["roleId"].setValue(this.userDetails.roleId.trim());//set the value of role id for modify user
          this.userAddFormGroup.controls["reportToEmployeeId"].setValue(this.userDetails.reportToEmployeeId.trim());
        } else {
          // show error msg on html page
          this.resMsgType = this.errorConst;
          this.resErrorMsg = res.msg;
        }//end of else 
      this.busySpinner.busy = false;//to stop spinner
    
      },
      err =>{
        console.log(err);
        this.busySpinner.busy = false;//to stop spinner
        this.sessionErrorService.routeToLogin(err._body);
      });
    }//end of method getUserDetailsByUserId
    // start method of deleteResErrorMsgOnClick
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }
  }//method to delete error msg

  //on cancel button click
  onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }
}
