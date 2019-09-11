import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../router/router-paths';
import { AddRoleDataService } from "../../services/add-role-data.service";
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { UserModel } from "../../../shared/models/user-model";
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Observable } from 'rxjs/Observable';
import { NgbdModalComponent } from '../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-role-add',
  templateUrl: 'role-add.component.html',
  styleUrls: ['role-add.component.css']
})
export class AddRoleComponent implements OnInit {

  public title: string = '';
  public roleAddFormGroup: FormGroup;
  public menuList: any = [];
  public roleId: string = "";
  public roleName: string = "";
 //busySpinner 
 public busySpinner: any = {
  roleNameBusy: true,
  submitBusy: false,//for submit spinner
  busy: true
}
public resMsgType: string = "Info";//for showing error msg in html page
public errorConst: string = "Error";//error constant
public resErrorMsg: string;
//to store the maxlength for localstorage
public roleNameLength: number = this.localStorageService.dbSettings.roleName;

  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private addRoleDataService: AddRoleDataService,
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private modalService: NgbModal,//modal
    // private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.roleId = params.roleId ? params.roleId : '';
    });
    if(this.roleId == ''){
      this.roleId = 'DEFAULT';
      this.title = 'Add Role';
    }else{
      this.title = 'Modify Role';
    }
    this.getAdminRoleName(this.roleId);
    this.buildForm();
  }//end of ngOnInit

  //start method buildForm
  private buildForm(): void {
    this.roleAddFormGroup = this.formBuilder.group({
      'roleName': [''
        , [
          Validators.required
        ]
      ]
    });
  }//end of the method buildForm

  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.roleNameBusy  || this.busySpinner.submitBusy) {
      this.busySpinner.busy = true;
    } else if (this.busySpinner.roleNameBusy == false && this.busySpinner.submitBusy== false) {
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  //start method getAdminRoleName
  private getAdminRoleName(roleIdParam: string) {
    this.addRoleDataService.getAdminRoleName(roleIdParam).
      subscribe(res => {
        this.busySpinner.roleNameBusy = false;
        this.updateBusySpinner();
        console.log("get role menu", res);
        this.roleName = res.roleName;
        this.roleAddFormGroup.controls["roleName"].setValue(this.roleName);
        this.menuList = res.menuDetails;
      },
      err => {
        this.busySpinner.roleNameBusy = false;
        this.updateBusySpinner();
        console.log(err);
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of the method getAdminRoleName


  //on cancel button click
  onCancel(): void {
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteHome]);
  }

  // start method mainMenuCheck
  public mainMenuCheck(applnIdParam?: string) {
    let mainMenuChecked: boolean;
    for (let mList of this.menuList) {
      if (mList.applnId == applnIdParam) {
        if (mList.selected == false) {
          mList.selected = true;
        } else if (mList.selected == true) {
          mList.selected = false;
        }//end of else
        mainMenuChecked = mList.selected;
        for (let subList of mList.subMenuDetails) {
          subList.selected = mainMenuChecked;
          for (let nestedSubList of subList.subMenuDetails) {
            nestedSubList.selected = mainMenuChecked;
          }//end of for
        }//end of for
      }//end of if
    }// end of outer for
  }//end of the method main menu check

  //start method subMenuCheck
  public subMenuCheck(subApplnId: string) {
    let subMenuChecked: boolean;
    for (let mList of this.menuList) {
      for (let subList of mList.subMenuDetails) {
        if (subApplnId == subList.subId) {
          if (subList.selected == false) {
            subList.selected = true;
          } else if (subList.selected == true) {
            subList.selected = false;
          }//end of else if
          subMenuChecked = subList.selected;
          for (let nestedSubList of subList.subMenuDetails) {
            nestedSubList.selected = subMenuChecked;
          }//end of for
        }//end of if
      }//end of for
    }//end of for
  }//end of the method subMenuCheck

  nestedSubMenuCheck(nestedSubId: string) {
    for (let mList of this.menuList) {
      for (let subList of mList.subMenuDetails) {
        for (let nestedSubList of subList.subMenuDetails) {
          if (nestedSubId == nestedSubList.subId) {
            if (nestedSubList.selected == true) {
              nestedSubList.selected = false;
            } else if (nestedSubList.selected == false) {
              nestedSubList.selected = true;
            }//end of else if
          }//end of if
        }//end of for
      }//end of if
    }//end of for
  }

  public addRoleSubmit() {
    let role: any = {};
    if(this.roleId == 'DEFAULT'){
      this.roleId = "";
    }
    role.roleId = this.roleId;
    role.roleName = this.roleAddFormGroup.value.roleName;
    console.log(" menulist ", this.menuList);
    let applnId: string;
    let subId: string;
    let menuListParam: string[] = [];
    for (let mList of this.menuList) {
      applnId = "";
      if (mList.selected == true) {
        applnId = mList.applnId;
        for (let subList of mList.subMenuDetails) {
          subId = "";
          if (subList.selected == true) {
            subId = subList.subId;
            for (let nestedSubList of subList.subMenuDetails) {
              if (nestedSubList.selected == true) {
                menuListParam.push(nestedSubList.subId);
              }//end of if
            }//end of for
            menuListParam.push(subId)
          }//end of if
        }//end of for
        menuListParam.push(applnId);
      }//end of if
    }//end of for
    role.attributes = menuListParam;
    console.log(" role json ", role);
    let methodForAddOrEditRoleName: any;
    methodForAddOrEditRoleName = this.roleId ?
    this.addRoleDataService.modifyRoleName(role):
    this.addRoleDataService.submitRoleName(role);
    this.busySpinner.submitBusy = true;
    this.updateBusySpinner();
    methodForAddOrEditRoleName.
    subscribe(res => {
      console.log("add role Success Response: ", res);
      this.busySpinner.submitBusy = false;
      this.updateBusySpinner();
        if (res.msgType == "Info") {
        this.onOpenModal(role.roleId,role.roleName);
        this.router.navigate([ROUTE_PATHS.RouteHome]);
        }else {
          this.resMsgType = this.errorConst;
          this.resErrorMsg = "Sorry! Save data fail. Please try again";
        }
    },
    err => {
      console.log(err);
      this.busySpinner.submitBusy = false;
      this.updateBusySpinner();
        if (err.status == 401) {
         // this.resErrorMsg = "Sorry! Unable to save data.Please try again";
        } else {
          //this.resErrorMsg = "Netowrk/Server Problem";
        }
        this.sessionErrorService.routeToLogin(err._body);
    });
  }

  // method to delete error msg
  public deleteResErrorMsgOnClick(resMsgType) {
    if (resMsgType == 'Error') {
      this.resMsgType = "Info";
    }//end of if
  }//end of method to delete error msg

  //onOpenModal for opening modal from modalService
  private onOpenModal(roleId: string, roleName: string) {
    const modalRef = this.modalService.open(NgbdModalComponent);
    modalRef.componentInstance.modalTitle = 'Information';
    modalRef.componentInstance.modalMessage =
      roleId ?
        "Role Name " + roleName + " updated successfully."
        : "Role Name " + roleName + " created successfully.";
  }
  //end of method onOpenModal

}
