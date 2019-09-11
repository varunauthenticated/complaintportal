import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../router/router-paths';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AllocateComplaintDIDataService } from '../../services/allocate-complaint-data.services';
import { LocalStorageService } from "../../../shared/services/local-storage.service";
import { SessionErrorService } from "../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-allocate-complaint-add',
  templateUrl: 'allocate-complaint.component.html',
  styleUrls: ['allocate-complaint.component.css']
})

export class AllocateComplaintComponent implements OnInit {
  public title: string = '';//for title
  //for sorting and orderType
  public sortSelection: any = {
   plantType: 'DI',
    sortData: '',
    orderType: '',
    filter: ''
  };

  //takin arr for selectedData
  public selectedData: any[] = [];
  
  public searchFormGroup: FormGroup;
  // public gridSearch: FormControl;
  public modifyAllocateComplaint: string;//for modify complaint id
  public viewEditParam: string = "";
  public allocateComplaintDIViewDetails: any = {};//to get allocateComplaintDI ViewDetails

  //check complaint is preli done or not in html
  public preliActivityId: number = this.localStorageService.appSettings.preliminaryInvestigationActivityId;
  //reso done or not
  public resoActivityId: number = this.localStorageService.appSettings.resolutionOfComplaintsAtCustomerPlaceActivityId;

  public siteVisitByActivityId: number;// to  siteVisitByActivityId from local storage


  constructor(
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,//modal
    private localStorageService: LocalStorageService,
    private sessionErrorService: SessionErrorService,
    private allocateComplaintDIDataService: AllocateComplaintDIDataService,

  ) {
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
  }//end of constructor

  ngOnInit(): void {
    console.log("onInit of AllocateComplaintComponent");
    this.siteVisitByActivityId = this.localStorageService.appSettings.siteVisitActivityId;
    // this.getParamFromRoute();//calling the method to get param from route
    // this.getAllocationComplaintDIViewDetailsValues(this.sortSelection);//grid view
    this.getParamFromRoute();//calling the method to get param from route
    this.allocationWSAcordingToRouteParam();//method to call allocate ws according to route param
  }//end of onInit

  ngOnChanges(): void {
    this.getParamFromRoute();//calling the method to get param from route
    this.allocationWSAcordingToRouteParam();//method to call allocate ws according to route param
  }

  //method for showing the user details
  getAllocationComplaintDIViewDetailsValues(viewDetParaJson: any, viewEditParam: string) {
    
    this.allocateComplaintDIDataService.getAllocateComplaintDIViewDetails(this.sortSelection, viewEditParam).
      subscribe(res => {
        console.log("allocateComplaintViewDetails : ", res),
          this.allocateComplaintDIViewDetails = res;
      },
      err => {
        console.log(err);
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of service call method

  //start service method for alert
  getAlertMethod(viewEditParam: string){
    this.allocateComplaintDIDataService.getAlertMethod(viewEditParam).
    subscribe(res => {
      console.log("allocateComplaintViewDetails : ", res)
        if( res.msgType === 'Info' || res.msgType ===  'Error'){
          this.getAllocationComplaintDIViewDetailsValues(this.sortSelection,this.viewEditParam);
        }
    },
    err => {
      console.log(err);
      this.sessionErrorService.routeToLogin(err._body);
    });
  }//end of the method 

  //method to get route param
  private getParamFromRoute(){
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.viewEditParam = params.viewEditParam ? params.viewEditParam : '';//get the viewEditParam to check wheather its edit or not
    
      console.log("route viewEditParam in allocate complaint site visit class..",this.viewEditParam);      
    });
  }
  //end of method to get route param

  private allocationWSAcordingToRouteParam() {
    //to check view or edit n set the json
    if(this.viewEditParam === 'Alert'){
      this.title = "View Allocation For Site Visit";
      this.sortSelection.filter =
        this.localStorageService.appSettings.siteVisitByFieldName 
        +"='"+this.localStorageService.user.employeeId+"' AND "+
        this.localStorageService.appSettings.activityIdFieldName 
        +"="+this.localStorageService.appSettings.siteVisitActivityId;
      
        // +" AND "+
        // this.localStorageService.appSettings.allocationOfComplaintReadFieldName 
        // +"= 'N' "

        console.log("json parameter of allocation view:::",this.sortSelection);
        this.getAlertMethod(this.viewEditParam);
        //this.getAllocationComplaintDIViewDetailsValues(this.sortSelection, this.viewEditParam);//grid view
        this.selectedData = [];//removing the array

    }else if(this.viewEditParam ==='View'){
      this.title = "View Allocation For Site Visit";
      this.sortSelection.filter =
      this.localStorageService.appSettings.siteVisitByFieldName 
      +"='"+this.localStorageService.user.employeeId+"'";
      console.log("json parameter of allocation view:::",this.sortSelection);
      this.getAllocationComplaintDIViewDetailsValues(this.sortSelection, this.viewEditParam);//grid view
      this.selectedData = [];//removing the array
    }else if(this.viewEditParam==='Edit') {
      this.title = "Allocation For Site Visit";
      this.sortSelection.filter = 
      this.localStorageService.appSettings.siteVisitRequiredFieldName +
      " = 'Y' AND "+ 
      this.localStorageService.appSettings.activityIdFieldName+
      " <= "+this.localStorageService.appSettings.siteVisitActivityId;
      console.log("json parameter of allocation edit:::",this.sortSelection);
      this.getAllocationComplaintDIViewDetailsValues(this.sortSelection, this.viewEditParam);//grid view
      this.selectedData = [];//removing the array
    }
  }//end of method



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
    this.getAllocationComplaintDIViewDetailsValues(this.sortSelection, this.viewEditParam);
    this.selectedData = [];//removing the array
  }//end of onclick method

  //creating method to get complaint details by single check
  complaintDetailsByCheckbox(complaintDetail,param?: string) {
    this.getComplaintDetailsByCheckbox(complaintDetail,param);
  }
  getComplaintDetailsByCheckbox(complaintDetail: any, param?: string) {
    console.log("checked : ", complaintDetail);
    console.log("param to check the click from view::",param);
    //checking the length of selectedData by clicking on checkbox
    if (this.selectedData.length == 0) {
      //push complaintDetail obj to selectedData array
      this.selectedData.push(complaintDetail);
      console.log("allocate complaint selected data : ", this.selectedData);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedData of this.selectedData) {
        if (selectedData.complaintReferenceNo == complaintDetail.complaintReferenceNo) {
          this.selectedData.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("allocate complaint selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("allocate complaint selected data after pushing: ", this.selectedData);
    }//end of else
    //check the param is view then call the view method
    if(param === 'View'){
      this.editAllocateComplaint(param);
    }
  }//end of method of getcomplaintDetailByCheckbox

  editAllocateComplaint(viewEditParam: string) {
    let viewEditVar: string = viewEditParam;
    for (let select of this.selectedData) {
      this.modifyAllocateComplaint = select.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify : ", this.modifyAllocateComplaint);
    // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyAllocateComplaint, this.modifyAllocateComplaint, viewEditVar]);
  }//end of method editAllocateComplaint  

}//end of class

