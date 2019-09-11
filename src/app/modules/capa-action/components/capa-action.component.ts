/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
// import { ToastService } from "../../home/services/toast-service";
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../router/router-paths';
import { CAPAActionService } from "../services/capa-action.service";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { SessionErrorService } from "../../shared/services/session-error.service";

@Component({
  selector: 'ispl-capa-action-form',
  templateUrl: 'capa-action.component.html',
  styleUrls: ['capa-action.component.css']
})
export class CAPAActionComponent implements OnInit {

  public title: string = "CAPA";
  public complaintDIViewDetails: any = {}//to show the complaint det in html page

  public  modifyCAPADI: string;//for modify complaint id
  public viewEditParam: string;

  //for sorting and orderType
  public sortSelection: any = {
    plantType: 'DI',
    sortData: '',
    orderType: '',
    fileActivityId: this.localStorageService.appSettings.analyseCustomerComplaintsAndActionPlanActivityId
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;

  //checkbox
  public checkAll : boolean = false;
  public otherCheck : boolean = false;
  //capa complaint var to check complaint capa is done or not in html
  public capaActivityId: number = this.localStorageService.appSettings.changeInQapOrwiOrisoProceedureActivityId;

  constructor(
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private capaActionService: CAPAActionService,
    private modalService: NgbModal,
    private sessionErrorService: SessionErrorService,
    private router: Router
  ) {
    console.log("CAPAActionComponent Class");
     // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit CAPAActionComponent Class");
    this.getParamFromRoute();//get route param
    this.complaintViewWsCall(this.sortSelection);//grid view
  }//end of onInit

   //method to get route param
   private getParamFromRoute(){
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.viewEditParam = params.viewEditParam ? params.viewEditParam : '';//get the viewEditParam to check wheather its edit or not
      console.log("this. view edit param: ",this.viewEditParam);
      this.selectedData = [];//removing the array 
    });
  }
  //end of method to get route param

  //method for showing the user details
  complaintViewWsCall(viewDetParaJson: any) {
    console.log("this.sortselection of capa-action : ",this.sortSelection);
    this.capaActionService.getcomplaintViewDetails(this.sortSelection).
      subscribe(res => {
        console.log("complaintDIViewDetails for capa actn di : ", res),
          this.complaintDIViewDetails = res;
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
  complaintDetailsByCheckbox(complaintDetail, viewParam?: string) {
    this.getComplaintDetailsByCheckbox(complaintDetail,viewParam);

  }
  getComplaintDetailsByCheckbox(complaintDetail: any, viewParam?: string) {
    console.log("checked capa: ", complaintDetail);
    console.log("param to check the click from view::",viewParam);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push complaintDetail obj to selectedData array
      this.selectedData.push(complaintDetail);
      console.log("complaint di selected data for capa: ", this.selectedData);
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
      console.log("complaint di selected data after deleting for capa: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("complaint di selected data after pushing for capa: ", this.selectedData);
    }//end of else
    //check the param is view then call the view method
    if(viewParam === 'view'){
      this.viewComplaint();
    }
  }//end of method of getcomplaintDetailByCheckbox


  //creating a method to check selectAll checkbox
  selectAllCheck() {
    this.checkAll = !this.checkAll;
    this.selectedData = (this.checkAll) ? this.complaintDIViewDetails.details : [];
    console.log("this.selectedData on selectAllCheck method for capa: ", this.selectedData);
    if (this.checkAll == true) {
      this.otherCheck = true;
    } else {
      this.otherCheck = false;
    }
  }//end of selectAllCheck method
  //method for edit capa actn di
  editComplaint(){    
    for(let capaActnDet of this.selectedData){
      this.modifyCAPADI = capaActnDet.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify capa PI: ",this.modifyCAPADI); 
    this.viewEditParam = "modify";     
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyCAPAActionDI,this.viewEditParam,this.modifyCAPADI]);
  }//end of add user method

  //method for view capa actn di
  viewComplaint(){    
    for(let capaActnDet of this.selectedData){
      this.modifyCAPADI = capaActnDet.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify capa PI: ",this.modifyCAPADI); 
    this.viewEditParam = "view";     
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyCAPAActionDI,this.viewEditParam,this.modifyCAPADI]);
  }//end of method for view capa di


  
}//end of class
