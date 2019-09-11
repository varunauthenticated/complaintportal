import { OnInit, Component, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ActiivityTrackingModel } from '../models/activity-tracking-di.model';
import { ActivityTrackingDIService } from '../services/activity-tracking-di.services';
import { ComplaintDIHeaderParamModel } from '../../../shared/models/complaint-di-header-param.model';
import { ComplaintDIService } from '../../../shared/services/complaint-di.service';
import { ROUTE_PATHS } from '../../../router/router-paths';

@Component({
    selector: 'ispl-activity-tracking-di',
    templateUrl: './activity-tracking-di.component.html',
    styleUrls: ['./activity-tracking-di.component.css']
})

export class ActivityTrackingDIComponent implements OnInit {
    private headerParams: ComplaintDIHeaderParamModel;//model

    public activityTrackingFormGroup: FormGroup;
    public facetedFormGroup: FormGroup;
    public gridConfigModel: any = {};//to store the grid model 
    public compDIStatusRes: any[] = [];//to store comp status 
    public facetedDataModel: any[] = [];//to store faceted data model
    public busySpinner: boolean = false;//spinner
    //pagination var
    pager: any = {};
    datacount: number;
    //for local search
    public searchFormGroup: FormGroup;
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private formBuilder: FormBuilder,
        private activityTrackingDIService: ActivityTrackingDIService,
        private complaintDIService: ComplaintDIService
    ) {
      // this.gridSearch = new FormControl('');
      this.searchFormGroup = this.formBuilder.group({
        'gridSearch': ''
      });
        let formGroup: any = {};
        formGroup['commercialCheck'] = new FormControl();
        this.activityTrackingFormGroup = new FormGroup(formGroup);
        this.facetedDataModel = new ActiivityTrackingModel().facetedDataModel;
        this.buildFormForFaceted();
    }

    ngOnInit(): void {
        console.log("onInit of ActivityTrackingDIComponent..");
        // this.busySpinner = true;//to load spinner
        this.gridConfigModel = new  ActiivityTrackingModel().activityTrackingGridConfigWithOutCommSet;
        
        this.headerParams = new ComplaintDIHeaderParamModel();//for pagination
        // this.getCompStatusWSCall();
        this.setPagination();
    }//end of on init

    //method to build formcontrol
    private buildFormForFaceted() {
      let formGroup: any = {};
      this.facetedDataModel.forEach((el)=>{
        formGroup[el.activityId] = new FormControl(false);
        this.facetedFormGroup = new FormGroup(formGroup);
      });
      this.facetedFormGroup.valueChanges.subscribe(()=> this.facetValueChanges());
    }//end of method

    //method to faceted value changes
    private facetValueChanges() {
      let facetedData: string = '';
      for(let facetVal in this.facetedFormGroup.value){
       if(this.facetedFormGroup.controls[facetVal].value){
         facetedData = facetedData? facetedData + "," + facetVal : facetVal;
        }       
      }
      let filterParam: string = facetedData? "LAST_ACTIVITY_ID IN ("+ facetedData + ")": '';
      this.headerParams.filter = filterParam;
      this.setPagination();
    }//end of method

    //method to get comp-status details by ws call
    private getCompStatusWSCall(){
        // this.busySpinner = true;
        this.activityTrackingDIService.getComStatusDet(this.headerParams).
        subscribe(res =>{
            console.log(res);
            this.compDIStatusRes = res;
            this.busySpinner = false;
        },
        err => {
            console.log(err);
            this.busySpinner = false;
        });
        
    }//end of method

    // new add for pagination
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
        // this.getlistofschoole(this.pager.currentPage - 1, 10);
        this.headerParams.pageNo = (this.pager.currentPage - 1).toString();
        this.headerParams.perPage = '20';
        this.getCompStatusWSCall();
        this.changeDetectorRef.detectChanges();
      }
    
      setPagination() {
        this.busySpinner = true;
        // let header: ComplaintDIHeaderParamModel;
        // header.filter = '';
        this.complaintDIService.getHeadercount(this.headerParams, 'DI').subscribe((res) => {
          console.log(res);
          this.datacount = res.xCount;
          this.setPage(1);
        }, (err) => {
          console.log(err);
        })
      }
    // end of pagination

    //method to route comp page by comp ref id click
    public onClickCompRefNo(compResEl: any){
        let routePath: string = '';
        let complainNo = compResEl.complainRefNo;
        let complainStatusId = compResEl.currentStatus;
        switch (complainStatusId) {
          case 10: {
            //viewcomplaindi/DI000009/10
            routePath = ROUTE_PATHS.RouteInvestigationReportDiAdd + '/' + complainNo + '/' + 40;
            break;
          };
          case 40: {
            routePath = ROUTE_PATHS.RouteAddRCADI + '/' + complainNo + '/' + 50;
            break;
          };
          case 50: {
            routePath = ROUTE_PATHS.RouteAddCADI + '/' + complainNo + '/' + 60;
            break;
          };
          case 60: {
            routePath = ROUTE_PATHS.RouteAddPADI + '/' + complainNo + '/' + 70;
            break;
          };
          case 70: {
            routePath = ROUTE_PATHS.RouteAddCloseComplainDI + '/' + complainNo + '/' + 80;
            break;
          };
          case 80: {
            routePath = ROUTE_PATHS.RouteViewDetailsCloseComplainDI + '/' + complainNo + '/' + 85;
            break;
          }
        }    
        this.router.navigate([routePath]);
    }//end of method route by comp ref id

    public onClickCommSetLinkClick(activityTrackingSelectedRowVal: any){
      let compRefNo: string = activityTrackingSelectedRowVal.complainRefNo;
      let lastActivityId = activityTrackingSelectedRowVal.currentStatus;
      this.router.navigate([ROUTE_PATHS.RouteCommercialSettlementDI,compRefNo,lastActivityId]);
    }//end of method
   
    //modal------------------------------------>>
    comSetFlag: boolean = false;
    private compRefNoOfCommSet: string = '';
    private toggleModalBtn(){
        this.comSetFlag = this.comSetFlag ? false : true;
    }
    onCommSetSwitchBtnClick(compRefNo: string){
        this.compRefNoOfCommSet = compRefNo;
        this.toggleModalBtn();
    }
    cancelModal(){
        this.activityTrackingFormGroup.controls['commercialCheck'].reset();//to reset the control value
        this.toggleModalBtn();
    }
    onCommSetModalSubmitClick(btnVal){
            this.compDIStatusRes.forEach((el,index)=>{
                if(el.complainRefNo == this.compRefNoOfCommSet){
                    if(btnVal === 'Y'){
                        this.busySpinner = true;
                        // this.updateComSetWSCall();
                        let updateComSetBody: any = {};
                        updateComSetBody.complainRefNo = this.compRefNoOfCommSet;
                        updateComSetBody.commercialSett = true;
                        this.activityTrackingDIService.updateComSetFromCompStatusGrid(updateComSetBody).
                        subscribe(res=>{
                            el.commercialSett = true;
                            this.busySpinner = false;
                        },err=>{
                            el.commercialSett = false;
                            console.log(err);
                            this.busySpinner = false;
                        })
                    }else if(btnVal === 'N'){
                        el.commercialSett = false;
                        this.activityTrackingFormGroup.controls['commercialCheck'].setValue(false);
                    }
                }
            });
        this.toggleModalBtn();
    }  

}