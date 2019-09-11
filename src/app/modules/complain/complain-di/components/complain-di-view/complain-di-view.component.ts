import { Component, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ViewComplaintDIDataService } from '../../services/complaint-di-view-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS, ROUTER_PATHS } from '../../../../router/router-paths';
import { ComplainDIViewModel } from '../../models/complain-di-view.model';
import { TilesInteractionService } from '../../../../dashboard/services/tiles-interaction.service';
import { SessionErrorService } from '../../../../shared/services/session-error.service';
import { ProcessFlowStatusDetailsModel } from '../../../../shared/components/process-flow/process-flow-status-details.model';
import { ComplaintDIService } from '../../../../shared/services/complaint-di.service';
import { ComplaintDIHeaderParamModel } from '../../../../shared/models/complaint-di-header-param.model';

@Component({
  selector: 'ispl-complain-di-view',
  templateUrl: 'complain-di-view.component.html',
  styleUrls: ['complain-di-view.component.css']
})
export class ComplainDIViewComponent implements OnInit, OnChanges {
  private compHeaderTableColumnNames: any = {};//to get header table column names
  public complaintDIViewDetails: any = []//to show the complaint det in html page
  public facetedDataDetails: any[] = [];//to show faceted data in html
  public processFlowStatusDet: string[] = [];

  //for sorting and orderType activity id parameters
  public sortSelection: any = {
    plantType: 'DI',
    sortData: '',
    orderType: '',
    facetedArray: [],
    fileActivityId: this.localStorageService.appSettings.complaintRegistrationActivityId
  };
  //for local search
  public searchFormGroup: FormGroup;
  //for comm sett switch button
  public commSettFormGroup: FormGroup;
  // Page Config
  public dashboardParameter: string = '';

  public gridHeader: any = {
    complaintReferenceNo: 'Complaint Number',
    customerName: 'Customer Name',
    complaintTypeDesc: 'Complaint Type',
    natureOfComplaintDesc: 'Nature of Complaint',
    lastStatus: 'Complaint Status',
    commercialSettlement: 'Commercial Settlement'
  }

  //for busy spinner
  public busySpinner: boolean = true;
  public title: string = '';
  //complaint register var to check complaint is registered or not in html
  public complaintLoggedActivityId: number = this.localStorageService.appSettings.complaintRegistrationActivityId;
  public headerparams: ComplaintDIHeaderParamModel;

  public facetedNavData: any = {};
  //formgroup
  public changeStattusGroup: FormGroup;
  public complanTypeFormgroup: FormGroup;
  public natureOfComplainGroup: FormGroup;
  pager: any = {};
  datacount: number;
  // paged items
  //server search formgroup
  public serverSearchModalFormGroup: FormGroup;
  public fromDate: string;
  public commSetlmntLevel: number = 0;//taking a var to maintain the user access

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private localStorageService: LocalStorageService,
    private viewComplaintDIDataService: ViewComplaintDIDataService,
    private router: Router,
    private complaintdIservice: ComplaintDIService,
    private tilesInteractionService: TilesInteractionService,
    private sessionErrorService: SessionErrorService,
    private activatedroute: ActivatedRoute,//route parameter,
    private cd: ChangeDetectorRef
  ) {
    console.log("View DI Complain Class");
    // this.gridSearch = new FormControl('');
    this.searchFormGroup = this.formBuilder.group({
      'gridSearch': ''
    });
    //for commercial switch button
    this.commSetlmntLevel = this.localStorageService.user.commSetlmntLevel;
    let formGroup: any = {};
    formGroup['commercialCheck'] = new FormControl();
    this.commSettFormGroup = new FormGroup(formGroup);
    //end of comm sett switch button
    //serverSearchModalFormGroup
    let serverSearchFormGroup: any = {}
    serverSearchFormGroup['anyTypeSearch'] = new FormControl();
    serverSearchFormGroup['complaintNumber'] = new FormControl();
    serverSearchFormGroup['customerName'] = new FormControl();
    serverSearchFormGroup['complaintType'] = new FormControl();
    serverSearchFormGroup['natureOfComplaint'] = new FormControl();
    serverSearchFormGroup['complaintStatus'] = new FormControl();
    this.serverSearchModalFormGroup = new FormGroup(serverSearchFormGroup);

    let currentDate = new Date();
    this.fromDate = this.datePipe.transform(currentDate,'yyyy-MM-dd');
  }//end of constructor

  ngOnChanges(changes: any) {
    console.log("onchanges of complainDiVIew class");
    // this.headerparams = new ComplaintDIHeaderParamModel();
  }

  ngOnInit(): void {
    console.log("OnInit View Complain Class");
    this.busySpinner = true;
    this.compHeaderTableColumnNames = new ComplainDIViewModel().compHeaderTableFieldNames;
  
    this.headerparams = new ComplaintDIHeaderParamModel();
    this.getParamFromRoute();//to get route param
    console.log("view complaint according to parameter [dashboard]: ", this.dashboardParameter);
    this.getcomplaindetails();
    this.loadFacetedNav();

    this.setPagination();
  }//end of onInit

  //method to get route param
  private getParamFromRoute() {
    let routeSubscription: Subscription;
    routeSubscription = this.activatedroute.params.subscribe(params => {
      this.dashboardParameter = params.activitytype ? params.activitytype : '';//get param from dashboard
      this.title = "View Complaints";
    });
    if(this.dashboardParameter){
      console.log("dashboard filter::::::::::",this.tilesInteractionService.wsFilter);
    }
  }
  //end of method to get route param

  /**
   * @description get compliant data
   */
  private getcomplaindetails() {
    // this.busySpinner = true;
    // new add for dashboard param check
    if(this.dashboardParameter){
      this.headerparams.filter = 
        this.tilesInteractionService.wsFilter.filter;
    }
    this.headerparams.filter;
    this.complaintdIservice.getHeader(this.headerparams).subscribe((res: any) => {
      console.log('get data all', JSON.parse(res.mapDetails));
      this.complaintDIViewDetails = JSON.parse(res.mapDetails);
      setTimeout(() => { this.busySpinner = false }, 2000);

    }, (err: any) => {
      this.busySpinner = false;
      this.sessionErrorService.routeToLogin(err._body);
    });
  }

  private loadFacetedNav() {
    this.loadComplainStatusFacet('initial');
    this.loadComplainTypeFacet('initial');
    this.loadNatureOfComplainFacet('initial');
  }

  private loadComplainStatusFacet(callType?: string) {
    let complainStatusParam: ComplaintDIHeaderParamModel = new ComplaintDIHeaderParamModel();
    complainStatusParam.filter = this.headerparams.filter;
    complainStatusParam.fields = 'distinct LAST_ACTIVITY_ID, ACTIVITY_DESC';
    complainStatusParam.sortData = 'LAST_ACTIVITY_ID';

    this.complaintdIservice.getHeader(complainStatusParam).subscribe((res: any) => {
      this.facetedNavData.complainStatus = JSON.parse(res.mapDetails);
      if (callType && callType == 'initial') {
        this.changeStattusGroup = this.buildComplainStatusFacetFormGroup();
        this.changeStattusGroup.valueChanges.subscribe(() => this.changeFacetElement('complainStatus'));
      }
    }, (err: any) => {
      // this.busySpinner = false;
    });
  }

  private loadComplainTypeFacet(callType?: string) {
    let complainStatusParam: ComplaintDIHeaderParamModel = new ComplaintDIHeaderParamModel();
    complainStatusParam.filter = this.headerparams.filter;
    complainStatusParam.fields = 'distinct CMPLNT_TYPE_ID , CMPLNT_TYPE_DESC';
    complainStatusParam.sortData = 'CMPLNT_TYPE_ID';

    this.complaintdIservice.getHeader(complainStatusParam).subscribe((res: any) => {
      this.facetedNavData.complainType = JSON.parse(res.mapDetails);
      if (callType && callType == 'initial') {
        this.complanTypeFormgroup = this.buildComplainTypeFacetFormGroup();
        this.complanTypeFormgroup.valueChanges.subscribe(() => this.changeFacetElement('complainType'));
      }
    }, (err: any) => {
      // this.busySpinner = false;
    });
  }

  private loadNatureOfComplainFacet(callType?: string) {
    let complainStatusParam: ComplaintDIHeaderParamModel = new ComplaintDIHeaderParamModel();
    complainStatusParam.filter = this.headerparams.filter;
    complainStatusParam.fields = 'distinct NAT_CMPLNT_ID, NAT_CMPLNT_DESC';
    complainStatusParam.sortData = 'NAT_CMPLNT_ID';

    this.complaintdIservice.getHeader(complainStatusParam).subscribe((res: any) => {
      this.facetedNavData.natureOfComplain = JSON.parse(res.mapDetails);
      if (callType && callType == 'initial') {
        this.natureOfComplainGroup = this.buildNatureOfComplainFacetFormGroup();
        this.natureOfComplainGroup.valueChanges.subscribe(() => this.changeFacetElement('natureOfComplain'));
      }
    }, (err: any) => {
      // this.busySpinner = false;
    });
  }
  /**
   * changestatus form group
   */
  private buildComplainStatusFacetFormGroup() {
    let Changestattusgroup: any = {};
    this.facetedNavData.complainStatus.forEach((element, index) => {
      Changestattusgroup[element.lastActivityId] = new FormControl(false);
    });
    // console.log(Changestattusgroup)
    return new FormGroup(Changestattusgroup);
  }
  /**
   * @description complintype group
   */
  private buildComplainTypeFacetFormGroup() {
    let CoplanTypegroup: any = {};
    this.facetedNavData.complainType.forEach((element, index) => {
      CoplanTypegroup[element.complaintTypeId] = new FormControl(false);
    });
    //console.log(this.CoplanTypegroup)
    return new FormGroup(CoplanTypegroup);
  }
  private buildNatureOfComplainFacetFormGroup() {
    let NatureOfComplainGroup: any = {};
    this.facetedNavData.natureOfComplain.forEach((element, index) => {
      NatureOfComplainGroup[element.natureOfComplaintId] = new FormControl(false);
    });
    //console.log(NatureOfComplainGroup)
    return new FormGroup(NatureOfComplainGroup);
  }
  /**
   * @description change status dettect 
   */
  changeFacetElement(callingFacet: string) {
    this.dashboardParameter = '';//set dashboard param blank to reset the filter
    this.changeStattusGroup;
    this.busySpinner = true;
    console.log(this.changeStattusGroup);

    let filter: string = '';
    let cmpStatusFilter: string = '';
    for (let statusCtrl in this.changeStattusGroup.value) {
      if (this.changeStattusGroup.value[statusCtrl]) {
        cmpStatusFilter += cmpStatusFilter ?
          " OR LAST_ACTIVITY_ID='" + statusCtrl + "'" :
          "LAST_ACTIVITY_ID='" + statusCtrl + "'";
      }
    }

    if (cmpStatusFilter) {
      cmpStatusFilter = '(' + cmpStatusFilter + ")"
      filter ? filter += " AND " + cmpStatusFilter : filter = cmpStatusFilter;
    }

    let cmpTypeFilter: string = '';
    for (let typeCtrl in this.complanTypeFormgroup.value) {
      if (this.complanTypeFormgroup.value[typeCtrl]) {
        cmpTypeFilter += cmpTypeFilter ?
          " OR CMPLNT_TYPE_ID='" + typeCtrl + "'" :
          "CMPLNT_TYPE_ID='" + typeCtrl + "'";
      }
    }

    if (cmpTypeFilter) {
      cmpTypeFilter = '(' + cmpTypeFilter + ")"
      filter ? filter += " AND " + cmpTypeFilter : filter = cmpTypeFilter;
    }

    let natOfCmpfacetFilter: string = '';
    for (let natCtrl in this.natureOfComplainGroup.value) {
      if (this.natureOfComplainGroup.value[natCtrl]) {
        natOfCmpfacetFilter += natOfCmpfacetFilter ?
          " OR NAT_CMPLNT_ID='" + natCtrl + "'" :
          "NAT_CMPLNT_ID='" + natCtrl + "'";
      }
    }

    if (natOfCmpfacetFilter) {
      natOfCmpfacetFilter = '(' + natOfCmpfacetFilter + ")"
      filter ? filter += " AND " + natOfCmpfacetFilter : filter = natOfCmpfacetFilter;
    }

    this.selectFacet(callingFacet, filter);
  }

  public selectFacet(facetName: string, selectedFacet: string) {
    //console.log(this.changeStattusGroup.value);
    console.log(facetName + " :: " + selectedFacet);
    switch (facetName) {
      case 'complainStatus': {
        this.headerparams.filter = selectedFacet;
        this.loadComplainTypeFacet();
        this.loadNatureOfComplainFacet();
        break;
      }
      case 'complainType': {
        this.headerparams.filter = selectedFacet;
        this.loadComplainStatusFacet();
        this.loadNatureOfComplainFacet();
        break;
      }
      case 'natureOfComplain': {
        this.headerparams.filter = selectedFacet;
        this.loadComplainStatusFacet();
        this.loadComplainTypeFacet();
        break;
      }
    }

    this.setPagination();
  }

  public getComplaintDetailsOnSelect(complaintDetail: any, viewParam?: string) {

    this.processFlowStatusDet = new ProcessFlowStatusDetailsModel().statusDetails;

    let complainNo: string = complaintDetail.complaintReferenceNo;
    let complainStatusId: string = complaintDetail.lastActivityId;

    // RegisterAdd -> ROUTE_PATHS.RouteComplainDIRegister + '/' + complainNo;
    // RegisterView -> ROUTE_PATHS.RouteComplainDIView + '/' + complainNo + '/' + complainStatusId;

    // InvestigationRepAdd -> RouteInvestigationReportDiAdd
    // InvestigationRepView -> RouteViewDetailsInvestigationReportDi

    // RCA Add -> RouteAddRCADI
    // RCA View -> RouteViewDetailsRCADI

    // CA Add -> RouteAddCADI
    // CA View -> RouteViewDetailsCADI

    // PA Add -> RouteAddPADI
    // PA View -> RouteViewDetailsPADI

    // Closed Add -> RouteAddCloseComplainDI
    // Closed VIew -> RouteViewDetailsCloseComplainDI

    let routePath: string = '';
    switch (complainStatusId) {
      case '10': {
        //viewcomplaindi/DI000009/10
        routePath = ROUTE_PATHS.RouteInvestigationReportDiAdd + '/' + complainNo + '/' + 40;
        break;
      };
      case '40': {
        routePath = ROUTE_PATHS.RouteAddRCADI + '/' + complainNo + '/' + 50;
        break;
      };
      case '50': {
        routePath = ROUTE_PATHS.RouteAddCADI + '/' + complainNo + '/' + 60;
        break;
      };
      case '60': {
        routePath = ROUTE_PATHS.RouteAddPADI + '/' + complainNo + '/' + 70;
        break;
      };
      case '70': {
        routePath = ROUTE_PATHS.RouteAddCloseComplainDI + '/' + complainNo + '/' + 80;
        break;
      };
      case '80': {
        routePath = ROUTE_PATHS.RouteViewDetailsCloseComplainDI + '/' + complainNo + '/' + 85;
        break;
      }
    }

    this.router.navigate([routePath]);

    //TODO: Need to add route logic

  }//end of method of getcomplaintDetailByCheckbox


  /**
   * 
   * @param val 
   */
  sortdata(sortItem) {
    console.log("clicked value : " + sortItem);
    if (this.sortSelection.sortData == sortItem) {
      this.sortSelection.orderType = "DESC";
    } else {
      this.sortSelection.orderType = "ASC";
    }
    this.sortSelection.sortData = sortItem;
    this.headerparams.sortData = this.sortSelection.sortData ? this.sortSelection.sortData : '';
    this.headerparams.orderBy = this.sortSelection.orderType && this.sortSelection.orderType == 'DESC'
      ? this.sortSelection.orderType : '';
    // console.log("sortSelection : ", this.sortSelection);
    this.busySpinner = true;
    this.getcomplaindetails();

  }//end of onclick method

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
  /**
   * 
   * @param page 
   * @param term 
   */
  setPage(page: number) {
    // get current page of items this is for local paginate
    console.log(this.datacount);
    this.pager = this.getPager(this.datacount, page, 20);
    //// this.getlistofschoole(this.pager.currentPage - 1, 10);
    if((this.pager.currentPage - 1) <0){
      this.headerparams.pageNo = "0";
    }else{
      this.headerparams.pageNo = (this.pager.currentPage - 1).toString();
    }
    this.headerparams.perPage = '20';
    this.getcomplaindetails();
    this.cd.detectChanges();
    //use to do for local pagination
    // this.pagedItems = this.allschooldata.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }

  setPagination() {
    // let header: ComplaintDIHeaderParamModel;
    // header.filter = '';
    this.complaintdIservice.getHeadercount(this.headerparams, 'DI').subscribe((res) => {
      console.log(res);
      this.datacount = res.xCount;
      this.setPage(1);
    }, (err) => {
      console.log(err);
    })
  }//end of method

  //new add for commercial sett
  public onClickCommSetLinkClick(complaintSelectedRowVal: any){
    let compRefNo: string = complaintSelectedRowVal.complaintReferenceNo;
    let lastActivityId = complaintSelectedRowVal.lastActivityId;
    let commSettCount: number = complaintSelectedRowVal.commercialSettCount;
    this.router.navigate([ROUTE_PATHS.RouteCommercialSettlementDI,compRefNo,lastActivityId, commSettCount]);
  }//end of method

  //modal------------------------------------>>
  comSetFlag: boolean = false;
  private compRefNoOfCommSet: string = '';
  private toggleCommSettModalBtn(){
      this.comSetFlag = this.comSetFlag ? false : true;
  }
  onCommSetSwitchBtnClick(compRefNo: string){
      this.compRefNoOfCommSet = compRefNo;
      this.toggleCommSettModalBtn();
  }
  cancelModal(){
      this.commSettFormGroup.controls['commercialCheck'].reset();//to reset the control value
      this.toggleCommSettModalBtn();
  }
  onCommSetModalSubmitClick(btnVal){
    this.complaintDIViewDetails.forEach((el,index)=>{
        if(el.complaintReferenceNo == this.compRefNoOfCommSet){
            if(btnVal === 'Y'){
                this.busySpinner = true;
                // this.updateComSetWSCall();
                let updateComSetBody: any = {};
                updateComSetBody.complaintReferenceNo = this.compRefNoOfCommSet;
                updateComSetBody.commercialSett = "Y";
                this.complaintdIservice.updateComSetFromCompStatusGrid(updateComSetBody).
                subscribe(res=>{
                    el.commercialSett = "Y";
                    this.busySpinner = false;
                },err=>{
                    el.commercialSett = "N";
                    console.log(err);
                    this.busySpinner = false;
                })
            }else if(btnVal === 'N'){
                el.commercialSett = "N";
                this.commSettFormGroup.controls['commercialCheck'].setValue(false);
            }
        }
    });
      this.toggleCommSettModalBtn();  
  }
  //end of commercial settlement

  //===== server search =====
  //new add for server search modal
  public serverSearchModal: boolean = false;
  //array to store searched value
  public serverSearchArr: any[] = [];
  public anyValue: string = '';//to show the any value of search modal
  //method to open server search modal
  public onClickFullSearchBtn() {
    this.toggleServerSearchModal();
  }//end of method
  //method to open/close modal
  private toggleServerSearchModal() {
    this.serverSearchModal = this.serverSearchModal ? false : true;
  }//end of method
  //method to cancel modal
  cancelServerSearchModal() {
    this.toggleServerSearchModal();
  }//end of method
  //on search modal submit
  public onClickSearchModalSubmit() {
    this.dashboardParameter = '';//to reset the filter
    this.serverSearchArr = [];//clear the arr
    let searchQuery: string;
    this.anyValue = this.serverSearchModalFormGroup.value.anyTypeSearch;
    let complaintNumberValue = this.serverSearchModalFormGroup.value.complaintNumber;
    let customerNameValue = this.serverSearchModalFormGroup.value.customerName;
    let complaintTypeValue = this.serverSearchModalFormGroup.value.complaintType;
    let natureOfComplaintValue = this.serverSearchModalFormGroup.value.natureOfComplaint;
    let complaintStatusValue = this.serverSearchModalFormGroup.value.complaintStatus;

    if (this.anyValue) {
      this.anyValue = this.anyValue.trim();
      searchQuery =
        this.compHeaderTableColumnNames.complaintNumber + " LIKE \'%" + this.anyValue + "%\' OR "
        + this.compHeaderTableColumnNames.customerName + " LIKE \'%" + this.anyValue + "%\' OR "
        + this.compHeaderTableColumnNames.complaintType + " LIKE \'%" + this.anyValue + "%\' OR "
        + this.compHeaderTableColumnNames.natureOfComplaint + " LIKE \'%" + this.anyValue + "%\' OR "
        + this.compHeaderTableColumnNames.complaintStatus + " LIKE \'%" + this.anyValue + "%\'";
    } else {
      this.anyValue = '';//clear the any value
      if (complaintNumberValue) {
        this.serverSearchArr.push({ dbColName: this.compHeaderTableColumnNames.complaintNumber, value: complaintNumberValue.trim(), htmlLblName: 'Complaint Number'});
      }  
      if (customerNameValue) {
        this.serverSearchArr.push({ dbColName: this.compHeaderTableColumnNames.customerName, value: customerNameValue.trim(), htmlLblName: 'Customer Name'});
      }  
      if (complaintTypeValue) {
        this.serverSearchArr.push({ dbColName: this.compHeaderTableColumnNames.complaintType, value: complaintTypeValue.trim(), htmlLblName: 'Complaint Type'});
      }  
      if (natureOfComplaintValue) {
        this.serverSearchArr.push({ dbColName: this.compHeaderTableColumnNames.natureOfComplaint, value: natureOfComplaintValue.trim(), htmlLblName: 'Nature of Complaint'});
      }  
      if (complaintStatusValue) {
        this.serverSearchArr.push({ dbColName: this.compHeaderTableColumnNames.complaintStatus, value: complaintStatusValue.trim(), htmlLblName: 'Complaint Status'});
      }     

      searchQuery = this.buildQueryFromSearchArr();
    }//end of else
  
    console.log("search query::", searchQuery);
    this.headerparams.filter = searchQuery;//set the filter to the param
    this.busySpinner = true;
    this.setPagination();//to get the data and set paginations
    // this.getcomplaindetails();//to get the data
    this.loadFacetedNav();
    this.toggleServerSearchModal();//to close the modal

  }//end of method

  private buildQueryFromSearchArr(): string{
    let searchQuery: string  = '';
    let filterQuery: string = '';
    if (this.serverSearchArr.length > 1) {
      this.serverSearchArr.forEach((el, index) => {
        filterQuery = el.dbColName + " LIKE \'%~" + el.value + "%~\'";
        searchQuery = searchQuery ? searchQuery + " AND " + filterQuery: filterQuery;
      });
    } else if(this.serverSearchArr.length == 1) {
      this.serverSearchArr.forEach((el, index) => {
        filterQuery = el.dbColName + " LIKE \'%~" + el.value + "%~\'";
        searchQuery = filterQuery;
      });
    }
    return searchQuery;
  }

  enableSearchModalBtn() {
    if (this.serverSearchModalFormGroup.value.anyTypeSearch ||
      this.serverSearchModalFormGroup.value.complaintNumber ||
      this.serverSearchModalFormGroup.value.customerName ||
      this.serverSearchModalFormGroup.value.complaintType ||
      this.serverSearchModalFormGroup.value.natureOfComplaint ||
      this.serverSearchModalFormGroup.value.complaintStatus) {

      return false;
    } else {
      return true;
    }
  }

  //to reset all search form value
  private resetServerSeachModalForm(){
    this.serverSearchModalFormGroup.controls['anyTypeSearch'].setValue('');
    this.serverSearchModalFormGroup.controls['complaintNumber'].setValue('');
    this.serverSearchModalFormGroup.controls['customerName'].setValue('');
    this.serverSearchModalFormGroup.controls['complaintType'].setValue('');
    this.serverSearchModalFormGroup.controls['natureOfComplaint'].setValue('');
    this.serverSearchModalFormGroup.controls['complaintStatus'].setValue('');
  }

  //method to delete by close click
  deleteSearchedValOnClick(){
    let searchQuery: string = '';
    this.anyValue = '';
    this.serverSearchArr = [];
    this.resetServerSeachModalForm();  
    console.log("search query::", searchQuery);
    this.headerparams.filter = searchQuery;//set the filter to the param
    this.busySpinner = true;
    this.setPagination();//to get the data and set paginations
    // this.getcomplaindetails();//to get the data
    this.loadFacetedNav();
  }
}//end of class
