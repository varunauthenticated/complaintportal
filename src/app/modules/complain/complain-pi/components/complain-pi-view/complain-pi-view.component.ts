import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { ViewComplaintPIDataService } from "../../services/complaint-pi-view-data.service";
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { TilesInteractionService } from '../../../../dashboard/services/tiles-interaction.service';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { SessionErrorService } from "../../../../shared/services/session-error.service";
@Component({
  selector: 'ispl-complain-pi-view',
  templateUrl: 'complain-pi-view.component.html',
  styleUrls: ['complain-pi-view.component.css']
})
export class ComplainPIViewComponent implements OnInit {

  public complaintPIViewDetails: any = {}//to show the complaint det in html page
  public  modifyComplaint: string;//for modify complaint id
  public facetedDataDetails: any[] = [];//to show faceted data in html
  //close complaint var to check complaint is logged or not in html
  public complaintLoggedActivityId: number = this.localStorageService.appSettings.complaintRegistrationActivityId;
  
  //for sorting and orderType activity id parameters
  public sortSelection: any = {
    plantType: 'PI',
    sortData: '',
    orderType: '',
    facetedArray: [],
    fileActivityId: this.complaintLoggedActivityId
  };
  
  //reset filter for faceted nav for quick fix..
  public resetFilter: any = {
    plantType: 'PI',
    sortData: '',
    orderType: '',
    facetedArray: [],
    fileActivityId: this.complaintLoggedActivityId
  };
  //reset filter for faceted nav for quick fix..
  public dashboardResetFilter: any = {
    plantType: 'PI',
    sortData: '',
    orderType: '',
    facetedArray: [],
    fileActivityId: this.localStorageService.appSettings.complaintRegistrationActivityId
  };
  //takin arr for selectedData
  public selectedData: any[] = [];
  public searchFormGroup: FormGroup;
  //checkbox
  public checkAll: boolean = false;
  public otherCheck: boolean = false;
  // Page Config
  public pageConfig: any = {};
  //taking var for filter
  public filterOption: string = '';
  //taking var for previous filter
  public previousFilter: string = '';
  //taking any array for faceted
  public facetedArray: any[] = [];
  public dashboardParameter: string = '';

  //for busy spinner
  public busySpinner: any = {
    gridBusy: true,
    facetedNavBusy: true,
    busy: true
  };
  public fromDate: string;
  public commSetlmntLevel: number = 0;//taking a var to maintain the user access
  constructor(
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private viewComplaintPIDataService: ViewComplaintPIDataService,
    private router: Router,
    private datePipe: DatePipe,
    private tilesInteractionService: TilesInteractionService,
    private sessionErrorService: SessionErrorService,
    private activatedroute: ActivatedRoute//route parameter    
  ) {
    console.log("View PI Complain Class");
     // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
    this.commSetlmntLevel = this.localStorageService.user.commSetlmntLevel;//for comm sett
    let currentDate = new Date();
    this.fromDate = this.datePipe.transform(currentDate,'yyyy-MM-dd');    
  }//end of constructor

  ngOnInit(): void {
    console.log("OnInit PI View Complain Class");
    console.log("OnInit View Complain Class");

    //new add for view complaint according to parameter
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => { 
      this.dashboardParameter = params.activitytype ? params.activitytype : '';
    });
    console.log("view complaint according to parameter: ",this.dashboardParameter);
    this.parameterCheck(this.dashboardParameter);
  }//end of onInit

   //checking if parameter have value or not
  private parameterCheck(routeParameter: string){
    if(this.dashboardParameter == ''){
      this.complaintViewWsCall(this.sortSelection);
      this.getfacetedValues(this.sortSelection);
      console.log("without dashboard calling part");
      console.log("without dashboard sortselection json : ",this.sortSelection);
    }else{
      console.log("ws tiles from dashboard::::::: ",this.tilesInteractionService.wsFilter);
      this.sortSelection = this.tilesInteractionService.wsFilter;//from dashboard
      this.sortSelection.fileActivityId = this.tilesInteractionService.wsFilter.fileActivityId;
      this.sortSelection.facetedArray = [];
      //fordashboard reset filter
      this.dashboardResetFilter.filter = this.tilesInteractionService.wsFilter.filter;//from dashboard
      this.dashboardResetFilter.fileActivityId = this.tilesInteractionService.wsFilter.fileActivityId;
      this.dashboardResetFilter.facetedArray = [];
      //end of dashboard reset filter
      this.complaintViewWsCall(this.sortSelection);//from dashboard
      this.getfacetedValues(this.sortSelection);
      console.log("with dashboard calling part");
    }
  }//end of checking if parameter have value or not

  //method for showing the user details
  private complaintViewWsCall(viewDetParaJson: any) {
    //method to check facet array blank or not
     let wsCallComplaintView: any;
     if( this.facetedArray.length > 0){
        wsCallComplaintView =   this.viewComplaintPIDataService.getComplaintViewDetails(this.sortSelection);
      }else{
        if(this.dashboardParameter){//check whether its called from dashboard
          if( this.facetedArray.length > 0){
          wsCallComplaintView = 
            this.viewComplaintPIDataService.getComplaintViewDetails(this.sortSelection);
          }else{
            if(this.sortSelection.sortData || this.sortSelection.orderType){
              this.dashboardResetFilter.sortData = this.sortSelection.sortData;
              this.dashboardResetFilter.orderType = this.sortSelection.orderType;
              // wsCallComplaintView =  this.viewComplaintPIDataService.getComplaintViewDetails(this.dashboardResetFilter);
            }else{
              this.dashboardResetFilter.sortData = '';
              this.dashboardResetFilter.orderType = '';
            }
            wsCallComplaintView = 
             this.viewComplaintPIDataService.getComplaintViewDetails(this.dashboardResetFilter);            
          }//end of else array length is greater than 0
        }else{//if dashboard parameter is blank
          if(this.sortSelection.sortData || this.sortSelection.orderType){
            this.resetFilter.sortData = this.sortSelection.sortData;
            this.resetFilter.orderType = this.sortSelection.orderType;
            // wsCallComplaintView =  this.viewComplaintPIDataService.getComplaintViewDetails(this.resetFilter);
          }else{
            this.resetFilter.sortData = '';
            this.resetFilter.orderType = '';
          }
          wsCallComplaintView = 
           this.viewComplaintPIDataService.getComplaintViewDetails(this.resetFilter);
        }
     }
    wsCallComplaintView.
      subscribe(res => {
        console.log("complaintPIViewDetails : ", res),
          this.complaintPIViewDetails = res;
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

  //method to fetch facted data at the time of page loading by service call
  private getfacetedValues(facetedJsonBody: any) {
    this.sortSelection.facetedArray = this.facetedArray;
    //method to check facet array blank or not
     let wsCallFacet: any;
     if( this.facetedArray.length > 0){
        wsCallFacet =  this.viewComplaintPIDataService.getfacetedData(this.sortSelection);
     }else{
      if(this.dashboardParameter){//check whether its called from dashboard
        if( this.facetedArray.length > 0){
          wsCallFacet = this.viewComplaintPIDataService.getfacetedData(this.sortSelection);
        }else{
          if(this.sortSelection.sortData || this.sortSelection.orderType){
            this.dashboardResetFilter.sortData = this.sortSelection.sortData;
            this.dashboardResetFilter.orderType = this.sortSelection.orderType;
          }else{
            this.dashboardResetFilter.sortData = '';
            this.dashboardResetFilter.orderType = '';
          }
          wsCallFacet = this.viewComplaintPIDataService.getfacetedData(this.dashboardResetFilter);
        }//end of else array length is greater than 0
      }else{//if dashboard parameter is blank
        if(this.sortSelection.sortData || this.sortSelection.orderType){
          this.resetFilter.sortData = this.sortSelection.sortData;
          this.resetFilter.orderType = this.sortSelection.orderType;
        }else{
          this.resetFilter.sortData = '';
          this.resetFilter.orderType = '';
        }
        wsCallFacet = this.viewComplaintPIDataService.getfacetedData(this.resetFilter);
      }
     }//end of array check
    wsCallFacet.
      subscribe(res => {
        console.log("faceted data for complaint view pi page : ", res);
        this.facetedDataDetails = res.facetedNav;
        this.sortSelection.prevFilter = res.prevFilter;
        console.log("res.facetedNav for complaint view pi page : ", this.facetedDataDetails);
        this.busySpinner.facetedNavBusy = false;
        this.updateBusySpinner();
      },
      err => {
        console.log(err);
        this.busySpinner.facetedNavBusy = false;
        this.updateBusySpinner();
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of method to fetch facted data at the time of page loading

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
      //push userDetails obj to selectedData array
      this.selectedData.push(complaintDetail);
      console.log("selected data : ", this.selectedData);
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
      console.log("selected data after deleting: ", this.selectedData);
      if (!removeFlag) {
        this.selectedData.push(complaintDetail);
      }//end of if
      console.log("selected data after pushing: ", this.selectedData);
    }//end of else
  }//end of method of getUserDetailsByCheckbox


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

  //method for add user
  addComplaint(){
     this.selectedData = [];//removing the array 
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteComplainPIRegister]);
  }//end of add user method

  //method for edit user
  editComplaint(){    
    for(let compPI of this.selectedData){
      this.modifyComplaint = compPI.complaintReferenceNo;
    }//end of for
    console.log("complaintRefId for modify : ",this.modifyComplaint);        
     // Not authenticated
    this.router.navigate([ROUTE_PATHS.RouteModifyPIComplaint,this.modifyComplaint]);
  }//end of add user method

  //method to get filter value
  public onClickFilter(header, checkedValue , checkedBoolean) {
    this.selectedData = [];//removing the array
    console.log("checkedHeader: ", header);
    console.log("checkedValue: ", checkedValue);
    console.log("checkedBoolean: ",checkedBoolean);
    //checking the length of selectedData by clicking on checkbox
    if (this.facetedArray.length == 0) {
      //push complaintDetail obj to selectedData array
      this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      console.log("complaint pi view facetedArray : ", this.facetedArray);
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedData of this.facetedArray) {
        if (selectedData.facetedData == checkedValue) {
          this.facetedArray.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      console.log("complaint pi view facetedArray data after deleting: ", this.facetedArray);
      if (!removeFlag) {
        this.facetedArray.push({ facetedGrp: header, facetedData: checkedValue });
      }//end of if
      console.log("complaint pi view facetedArray after pushing: ", this.facetedArray);
    }//end of else
    // let facetQuery: string = '';//for faceted query
    console.log("facetedArray: ", this.facetedArray);
    if (this.facetedArray && this.facetedArray.length > 0) {
      let facetTree: any = {};
      for (let facetNode of this.facetedArray) {
        let facetQuery: string = '';
        if (facetTree[facetNode.facetedGrp]) {
          facetQuery += facetTree[facetNode.facetedGrp] + ' OR ';
          facetQuery += facetNode.facetedGrp + '=' +'\''+ facetNode.facetedData +'\'';
        }  else {
          facetQuery = facetNode.facetedGrp + '=' +'\''+ facetNode.facetedData +'\'';
        }
        facetTree[facetNode.facetedGrp] = facetQuery;
      }
      let facetQryString: string = ''; 
      if (facetTree) {
        for (let facetNodeIndex in facetTree) {
          facetQryString ? facetQryString += ' AND ' : null;
          facetQryString += facetTree[facetNodeIndex];
        }
      }
      console.log('facetTree: ', facetTree);
      console.log('facetQuery: ', facetQryString);
      this.filterOption = facetQryString;
    //end of if arr length check
    }else{
      this.filterOption = '';
    }
    console.log("facetQuery for filter : ",this.filterOption);
    //checking dashboard parameter and build the query according to dashboardParameter parameter
    if(this.dashboardParameter){
      if(this.tilesInteractionService.wsFilter.filter == ''){
        this.sortSelection.filter = this.filterOption;
      }else{
        let dashboardFilter: string = this.dashboardResetFilter.filter;
        this.sortSelection.filter = dashboardFilter + " AND " +  this.filterOption;
      }
    }else{
    this.sortSelection.filter = this.filterOption;
    }   
  //check the checkboolean is true or false then set the header to the obj
  if (checkedBoolean == true ){
    this.sortSelection.callingFromFacet = '';
  }else if (checkedBoolean == false){
   this.sortSelection.callingFromFacet = header;
  }  
   console.log("this.sortselection after filteration....",this.sortSelection);
    this.busySpinner.gridBusy = true;//busy spinner
   this.busySpinner.facetedNavBusy = true;//busy spinner
   this.updateBusySpinner();
   //calling the method to fetch the grid data
   if ( this.facetedArray.length > 0){
    this.complaintViewWsCall(this.sortSelection);//view grid data
    this.getfacetedValues(this.sortSelection);//for faceted nav
   }else{
    this.complaintViewWsCall(this.resetFilter);//view grid data
    this.getfacetedValues(this.resetFilter);//for faceted nav
   }
  } //end of method to get filter value


  //to load the spinner
  private updateBusySpinner() {
    if (this.busySpinner.gridBusy || this.busySpinner.facetedNavBusy) { 
      this.busySpinner.busy = true;
    } else if(this.busySpinner.gridBusy== false && this.busySpinner.facetedNavBusy == false){
      this.busySpinner.busy = false;
    }//end of else if
  }//end of busy spinner method

  public onClickCompRefNo(val){
    let refNo: string = val.complaintReferenceNo;
    this.router.navigate([ROUTE_PATHS.RouteComplainPIRegDetailsView,refNo]);
  }//end of method

  public onClickCommSetLinkClick(complaintSelectedRowVal: any){
    let compRefNo: string = complaintSelectedRowVal.complaintReferenceNo;
    let commSettCount: number = complaintSelectedRowVal.commercialSettCount;
    this.router.navigate([ROUTE_PATHS.RouteCommercialSettlementPI,compRefNo, commSettCount]);
  }//end of method

}//end of class
