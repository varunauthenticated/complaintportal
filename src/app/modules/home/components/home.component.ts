import { Component, NgModule, Output, EventEmitter, ViewContainerRef, OnInit, AfterViewInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import {Observable} from 'rxjs';//for a method call in every 2 min
import 'rxjs/add/observable/interval';
import { ROUTE_PATHS, ROUTER_PATHS } from '../../router/router-paths';
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { UserModel } from "../../shared/models/user-model"; 
import { MenuWsMapModel } from "../models/menu-ws-map.model";
import { HomeDataService } from "../services/home.services";
import { ComplaintDIInvoiceDetailsService } from "../../complain/complain-di/services/complaint-di-invoice-details.service";
import { InvoiceSearchDetailsModel } from "../../complain/complain-pi/models/invoice-search-details.model";
import { SessionErrorService } from "../../shared/services/session-error.service";
import { ChartReportComponent } from '../../widget/chart-report/components/chart-report.component';
@Component({
    selector: 'ispl-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']

})
export class HomeComponent implements OnInit, AfterViewInit {
  private tempPlantTypeForNotification: string;//to check plant type and 
  private timeInterval: number = this.localStorageService.appSettings.notificationInMilliSecond;//set the time limit//set the time limit for service call
  public notificationNumber: number;//to show notification number
  public tempRoleMenu: string = '';
  public loggedInUser: UserModel;
  public pageNavigation: any; 
  public menuIcons:any;
  public navMenuList:any;
  public tempPlantType: string = '';//for change plant type menu
  public booleanToCheckAllocateUser: boolean = true;//for show/hide allocate alert div
  public allocateJson: any = {
    plantType: 'DI',
    sortData: '',
    orderType: '',
    filter:
    this.localStorageService.appSettings.siteVisitByFieldName 
    +"='"+this.localStorageService.user.employeeId+"' AND "+
    this.localStorageService.appSettings.activityIdFieldName 
    +"="+this.localStorageService.appSettings.siteVisitActivityId +" AND "+
    this.localStorageService.appSettings.allocationOfComplaintReadFieldName 
    +"= 'N' "
    
  }
  public xcountForNotification: number;//
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private homeDataService: HomeDataService,
    private complaintDIInvoiceDetailsService: ComplaintDIInvoiceDetailsService,
    private sessionErrorService: SessionErrorService,
    private invoiceSearchDetailsModel: InvoiceSearchDetailsModel
  ) {

    this.tempRoleMenu = this.localStorageService.user.roleName;
    this.loggedInUser = this.localStorageService.user;   
  }

  ngOnInit() {
    // this.toastrService.success('You have successfully logged in!', 'Congratulation!');
    console.log("home component..........................................");
    this.setMenu();//method to set menu
    // this.getAllocateWS();
    // this.functioncallInEveryMin();//call a function to check wheather the user is allocated or not

    console.log(" employee id", this.localStorageService.user.employeeId);
  }//end of onInit

  ngAfterViewInit(){
  }
  //start method to set the menus
  private setMenu() {
    console.log("set menu method/////////////////////");
    this.pageNavigation = new MenuWsMapModel().userMenu;
    console.log(" pageNavigation ===>>",this.pageNavigation);
    this.menuIcons = new MenuWsMapModel().userMenuIcons;
    this.navMenuList = this.localStorageService.appSettings.getMenuDetails;
    this.tempPlantType = this.localStorageService.user.plantTypeForBoth;//to show change plant sub menu
    //console.log("App Menu Response" ,this.navMenuList);
    if(this.localStorageService.user.plantType === "BOTH"){
      this.router.navigate([ROUTE_PATHS.RouteDashboardBoth]);
    }
  }//end of menu set method
  //start logout method
  logout() {
    console.log("Log out");
  }//end of logout

  // //start method to call a function in every 10 sec
  // public functioncallInEveryMin() {//10000= 10 sec.     
  //   Observable.interval(this.timeInterval).takeWhile(() => true).subscribe(() => this.getAllocateWS());
  // }//end of functioncalleverymin method to call a function in every 10 sec 

  // start service call method to get allocate details of logged in user  
  // private getAllocateWS() {
  //   console.log("in getAllocateWS method");
  //   this.tempPlantTypeForNotification = this.localStorageService.user.plantType;
  //   console.log("allocateJson ===>>>>", this.allocateJson);
  //   this.homeDataService.getUserAllocationReport(this.allocateJson).
  //   subscribe(res => {
  //     console.log("test service call success:::: ", res);
  //     if(res.msgType === 'Info'){
  //       if(this.tempPlantTypeForNotification === 'DI'){
  //         this.notificationNumber = res.xCountAllocateComplanitNotRead;
  //       }else if(this.tempPlantTypeForNotification === 'PI'){
  //         this.notificationNumber = 0;
  //       }
  //     }else{
  //       this.notificationNumber = 0;
  //     }
  //     //check if xcount of di or pi have atlst 1 value
  //     if(this.notificationNumber>0){
  //       // this.toastrService.success('Please Check The Menu!','You have Notifications!');
  //       this.booleanToCheckAllocateUser = false;
  //     }else{
  //       this.booleanToCheckAllocateUser = true;
  //     }
  //     console.log("this.booleanToCheckAllocateUser::::", this.booleanToCheckAllocateUser);
  //   },
  //   err => {
  //     console.log("err of test service call:::",err);
  //     this.booleanToCheckAllocateUser = true;
  //     this.sessionErrorService.routeToLogin(err._body);
  //   });
  // }// end of service call method to get allocate details of logged in user

  // // start method of deleteResErrorMsgOnClick
  // public deleteResErrorMsgOnClick() {
  //   this.booleanToCheckAllocateUser = true;
  //   this.router.navigate([ROUTE_PATHS.RouteAllocateComplaint+"/Alert"])
  // }//method to delete error msg

  setLocalStoragevariable(subId:string){
    console.log(" subId =======>>>>>>>>>",subId);
    if(subId == "SSM0000038" || subId == "SSM0000033" || subId == 'SSM0000036'){
      let chartType: string  = '';
      switch(subId){
        case 'SSM0000033':
        chartType = "pareto";
        break;
        case 'SSM0000038':
        chartType = 'bar';
        break;
        case 'SSM0000036':
        chartType = 'pie';
        break;
      }
      let url = '/chart/'+chartType;//ROUTER_PATHS.ChartRouter+ '/'+chartType;
      this.router.navigateByUrl(url, {skipLocationChange: true}).then(()=>
      this.router.navigate([ROUTE_PATHS.RouteChartComponentFull,chartType]));//ChartReportComponent
    }
    if(subId === "SSM0000002" || subId === "SSM0000026"){//for add complaint di\view submenu
      this.complaintDIInvoiceDetailsService.testVar ="";
    }else if( subId === "SSM0000012" || subId === "SSM0000011"){//for add complaint pi\view submenu
      this.invoiceSearchDetailsModel.testVar = "";
    }
  }//end of method

  //====== file download=====
  //to download file
  public onClickForFileDownload(val: string) {
    console.log("clicked value : ", val);
    let fileDownloadJson: any = {};
    if(val === 'User Manual'){
      fileDownloadJson.fileDesc = "User Manual";
    }
    this.homeDataService.downloadFile(fileDownloadJson).
      subscribe(res => {
        console.log("onClickForFileDownload: ", res);

        if (res.msgType === 'Info') {
          let byteCharacters = atob(res.valueSub);
          let byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);
          let blob = new Blob([byteArray], { "type": "application/octet-stream" });

          if (navigator.msSaveBlob) {
            let fileName = res.value;
            navigator.msSaveBlob(blob, fileName);
          } else {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute('visibility', 'hidden');
            link.download = res.value;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }//end else
        }
     
      },
        err => {
          console.log(err);
          // this.sessionErrorService.routeToLander(err._body);
          
        });

  }//end of method


}//end of class
