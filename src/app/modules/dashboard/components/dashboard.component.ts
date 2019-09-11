import { Component, Input, Compiler, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormControl } from '@angular/forms';
import { APP_DASHBOARD_ANIMATIONS } from "../../shared/components/animations/app-animations";
import { ViewComplaintDIDataService } from "../../complain/complain-di/services/complaint-di-view-data.service";
import { ViewComplaintPIDataService } from "../../complain/complain-pi/services/complaint-pi-view-data.service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { TilesFilterModel } from "../models/tiles-filter.model";
import { ViewUserDataService } from "../../user/services/view-user-data.service";
import { ViewRoleDataService } from "../../role/services/view-role-data.service";
import { ROUTE_PATHS } from '../../router/router-paths';
import { ComplaintDIService } from '../../shared/services/complaint-di.service';
import { DashboardConfigTilesModel } from '../models/dashboard-config-tiles.model';

@Component({
  selector: 'ppr-dashboard-batch',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css'],
  animations: APP_DASHBOARD_ANIMATIONS
})
export class DashboardComponent implements OnInit {
  //date
  private fromDate: string;
  private toDate: string;

  private openDIPIComplaintService: any;//for common service
  public tempPlantType: string = '';//for rolename
  //taking a var to show error msg obj
  public modalErrorMsgObj: any = {
    modalErrorMsg: '',
    modalErrMsgShowFlag: false
  };//for common button link
  //from group for date range
  public dateRangeFormGroup: FormGroup;
  public dashboardConfigTilesModel: any = {};//dashboard config tiles model

  result: Array<any>;
  tiles1: any = {
    tilesHeader: 'Registered Complaints',
    tilesBodyText: 'Total Registered Complaints',
    tilesBodyNumber: '-',
    color: '#3078be',//'#747988',//'#3078be',//blue
    // ,
    buttonText: 'View Details',
    buttonLink: 'filtered'

  };

  tiles2: any = {
    tilesHeader: 'Closed Complaints',
    tilesBodyText: 'Total Closed Complaints',
    tilesBodyNumber: '-',
    color: '#00ad21',//grey '#3078BE',
    buttonText: 'View Details',
    buttonLink: '80'

  };
  tiles3: any = {
    tilesHeader: 'Open Complaints',
    tilesBodyText: 'Total Open Complaints',
    tilesBodyNumber: '-',
    color: '#3078be',// '#00ad21',//'#9d89b3',//purple//
    buttonText: 'View Details',
    buttonLink: '10'

  };

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    private complaintDIService: ComplaintDIService,
    private viewComplaintPIDataService: ViewComplaintPIDataService,
    private viewUserDataService: ViewUserDataService,
    private viewRoleDataService: ViewRoleDataService,
  ) {

    this.tempPlantType = this.localStorageService.user.plantType;

    this.dashboardConfigTilesModel = new DashboardConfigTilesModel().dashboardConfigTilesModel;
    //new add for date range
    let dateRangeFormGroup: any = {};
    dateRangeFormGroup['configType'] = new FormControl(this.dashboardConfigTilesModel[0].key);
    dateRangeFormGroup['fromDate'] = new FormControl();
    dateRangeFormGroup['toDate'] = new FormControl();
    this.dateRangeFormGroup = new FormGroup(dateRangeFormGroup);

    // let date = new Date();
    // let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
    // let fDateForShow: string = '2018-01-01';
    let toDate = this.localStorageService.user.toDate;
    let fDateForShow = this.localStorageService.user.fromDate;
    let fDate = this.datePipe.transform(fDateForShow, 'yyyy-MM-dd');//'dd-MMM-yyyy'
    this.fromDate = this.datePipe.transform(fDateForShow, 'dd-MMM-yyyy');//to show the from date
    this.toDate = this.datePipe.transform(toDate, 'dd-MMM-yyyy');//to show the to date//date,'dd-MMM-yyyy'
    this.dateRangeFormGroup.controls['fromDate'].setValue(fDate);
    this.dateRangeFormGroup.controls['toDate'].setValue(toDate);



    //end of new add for date range
    console.log("Dashboard Batch Constructor...");
    console.log("tempPlantType : ", this.tempPlantType);
  }

  ngOnInit() {
    if (this.tempPlantType != 'BOTH') {
      this.getDataTile1();//registered complaint
      this.getDataTile2();//closed complaint
      this.getDataTile3();//open complaint
      this.sendChartData();
    }
  }//end of oninit
 
  chartData: any = {};
  sendChartData(){
    let filterforPI: string = 
    "CMPLNT_LOGD_ON BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
      + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";
    let filterforDI = "CMPLNT_LOGD_ON_ACTUAL BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
      + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";
   let filter: string = '';
    switch (this.tempPlantType) {
    case 'DI':
      filter = filterforDI;
      break;

      case 'PI':
      filter = filterforPI;
      break;
    }
    let period: string = '[from '+this.fromDate+' to ' + this.toDate+']';

    this.chartData = {
      filter: filter,
      period: period,
      plantType : this.tempPlantType
    }
  }
  //for view complaint -- DI registered complaint
  private getDataTile1() {
    let tilesFilter: any = {
      plantType: '',
      sortData: '',
      orderType: '',
      //filter: "CMPLNT_LOGD_ON BETWEEN \'" + this.fromDate + " 00:00:00\' AND \'" + this.toDate + " 23:59:59\'",
      filter: "CMPLNT_LOGD_ON BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
        + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)",

      fromDate: this.fromDate,
      toDate: this.toDate,
      fileActivityId: this.localStorageService.appSettings.defaultActivityId
    };
    //set filter to get di total complaint  
    let diTilesFilter: any = {
      //filter: "CMPLNT_LOGD_ON BETWEEN \'" + this.fromDate + " 00:00:00\' AND \'" + this.toDate + " 23:59:59\'",
      filter: "CMPLNT_LOGD_ON_ACTUAL BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
        + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)",

      fromDate: this.fromDate,
      toDate: this.toDate
    };
    // plant type checking
    if (this.tempPlantType === 'DI') {
      this.tiles1.tilesHeader = "Total Complaints";
      this.tiles1.tilesBodyText = "Total logged complaints";
      this.tiles1.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;

      // tilesFilter.plantType = 'DI';
      this.openDIPIComplaintService = this.complaintDIService.getHeadercount(diTilesFilter, 'DI');
      // this.viewComplaintDIDataService.getcomplaintDIViewDetails(tilesFilter);
      this.tiles1.wsFilter = diTilesFilter;//set tiles filter for di tiles
    } else if (this.tempPlantType === 'PI') {
      tilesFilter.plantType = 'PI';
      this.tiles1.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;
      this.openDIPIComplaintService =
        this.viewComplaintPIDataService.getComplaintViewDetails(tilesFilter);
      this.tiles1.wsFilter = tilesFilter;
    } else if (this.tempPlantType === 'ADMN') {
      this.tiles1.tilesHeader = "User Details";
      this.tiles1.tilesBodyText = "Total User Details";
      this.tiles3.buttonLink = "user";
      this.openDIPIComplaintService =
        this.viewUserDataService.getUserViewDetails();
    }
    // this.tiles1.wsFilter = tilesFilter;

    this.openDIPIComplaintService
      .subscribe(res => {
        console.log("res of reg complaint for tiles1..", res);
        this.tiles1.tilesBodyNumber = res.xCount;

      },
        error => {
          if (error.status == 401) {
          }
        });
  }//end of method DI view complaint

  //for view complaint -- DI CLOSED complaint
  private getDataTile2() {
    let tilesFilter: any = {
      plantType: '',
      sortData: '',
      orderType: '',
      filter: '',
      fromDate: this.fromDate,
      toDate: this.toDate,
      fileActivityId: this.localStorageService.appSettings.defaultActivityId
    };
    tilesFilter.filter = this.localStorageService.appSettings.activityIdFieldName + " = "
      + this.localStorageService.appSettings.closeComplaintActivityId
      //+ " AND CMPLNT_LOGD_ON BETWEEN '" + this.fromDate + " 00:00:00' AND '" + this.toDate + " 23:59:59'"
      + " AND CMPLNT_LOGD_ON BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
      + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";

    tilesFilter.fileActivityId = this.localStorageService.appSettings.closeComplaintActivityId;

    //set filter for di
    let diTilesFilter: any = {
      filter: this.localStorageService.appSettings.lastActivityIdFieldName + '=' + 80//close activity id
        //+ " AND CMPLNT_LOGD_ON BETWEEN '" + this.fromDate + " 00:00:00' AND '" + this.toDate + " 23:59:59'",
        + " AND CMPLNT_LOGD_ON_ACTUAL BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
        + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)",
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    // plant type checking
    if (this.tempPlantType === 'DI') {
      this.tiles2.tilesHeader = "Closed Complaints";
      this.tiles2.tilesBodyText = "Total closed complaints";
      this.tiles2.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;
      // tilesFilter.plantType = 'DI';
      this.openDIPIComplaintService = this.complaintDIService.getHeadercount(diTilesFilter, 'DI');
      this.tiles2.wsFilter = diTilesFilter;//set filter for di tiles
      //this.viewComplaintDIDataService.getcomplaintDIViewDetails(tilesFilter);
    } else if (this.tempPlantType === 'PI') {
      tilesFilter.plantType = 'PI';
      this.tiles2.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;
      this.openDIPIComplaintService = this.viewComplaintPIDataService.getComplaintViewDetails(tilesFilter);
      this.tiles2.wsFilter = tilesFilter;
    }

    if (this.tempPlantType === 'ADMN') {

    } else {
      console.log("dashboard parameter for close complaint : ", tilesFilter);
      this.openDIPIComplaintService
        .subscribe(res => {
          console.log("res of close complaint for tiles2..", res);
          this.tiles2.tilesBodyNumber = res.xCount;
        },
          error => {
            if (error.status == 401) {
            }
          });
    }
  }//end of method DI view complaint

  //for view complaint -- DI open complaint
  private getDataTile3() {
    let tilesFilter: any = {
      plantType: '',
      sortData: '',
      orderType: '',
      filter: '',
      fromDate: this.fromDate,
      toDate: this.toDate,
      fileActivityId: this.localStorageService.appSettings.defaultActivityId
    };
    tilesFilter.filter = this.localStorageService.appSettings.activityIdFieldName + " >= "
      + this.localStorageService.appSettings.complaintRegistrationActivityId
      + " AND " + this.localStorageService.appSettings.activityIdFieldName + " < "
      + this.localStorageService.appSettings.closeComplaintActivityId
      //+ " AND CMPLNT_LOGD_ON BETWEEN \'" + this.fromDate + " 00:00:00\' AND \'" + this.toDate + " 23:59:59\'";
      + " AND CMPLNT_LOGD_ON BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
      + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";

    tilesFilter.fileActivityId = this.localStorageService.appSettings.pendingComplaintActivityId;

    //set filter for di
    let diTilesFilter: any = {
      filter: this.localStorageService.appSettings.lastActivityIdFieldName + '=' + 10
        //+ " AND CMPLNT_LOGD_ON BETWEEN \'" + this.fromDate + " 00:00:00\' AND \'" + this.toDate + " 23:59:59\'",
        + " AND CMPLNT_LOGD_ON_ACTUAL BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
        + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)",
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    //plant type checking
    if (this.tempPlantType === 'DI') {
      //set the label of tiles
      this.tiles3.tilesHeader = "Newly Reg. Complaints";
      // this.tiles3.tilesHeaderInfo ="(Investigation Report pending for submission)";
      this.tiles3.tilesBodyText = "Pending for Investigation Report";
      this.tiles3.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;
      // tilesFilter.plantType = 'DI';
      this.openDIPIComplaintService = this.complaintDIService.getHeadercount(diTilesFilter, 'DI');
      this.tiles3.wsFilter = diTilesFilter;//set ti;es filter
    } else if (this.tempPlantType === 'PI') {
      tilesFilter.plantType = 'PI';
      this.tiles3.tilesBodyDateRange = "from " + this.fromDate + " to " + this.toDate;
      this.openDIPIComplaintService = this.viewComplaintPIDataService.getComplaintViewDetails(tilesFilter);
      this.tiles3.wsFilter = tilesFilter;//set tiles filter
    } else if (this.tempPlantType === 'ADMN') {
      this.tiles3.tilesHeader = "Role Details";
      this.tiles3.tilesBodyText = "Total Role Details";
      this.tiles3.buttonLink = "role";
      this.openDIPIComplaintService =
        this.viewRoleDataService.getRoleViewDetails();
    }


    console.log("dashboard parameter for pending complaint: ", tilesFilter);
    this.openDIPIComplaintService
      .subscribe(res => {
        console.log("res of open complaint by tiles3..", res);
        this.tiles3.tilesBodyNumber = res.xCount;
      },
        error => {
          if (error.status == 401) {
          }
        });

  }//end of method DI view complaint

  //method to quick links icon click route
  public onQuickLinkIconClick(iconinfo: string) {
    if (iconinfo === 'add') {
      this.router.navigate([ROUTE_PATHS.RouteComplainDIRegister]);
    } else if (iconinfo === 'view') {
      this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
    } else if (iconinfo === 'viewstatus') {
      this.router.navigate([ROUTE_PATHS.RouteViewComplainDIStatus]);
    }
  }//end of method

  //start date range modal
  public dateRangeModalFlag: boolean = false;
  toogleDateRange() {
    this.dateRangeModalFlag = this.dateRangeModalFlag ? false : true;
  }
  openDateRangeModal() {
    this.toogleDateRange();
  }
  cancelModal() {
    this.toogleDateRange();
  }
  //method to date range modal submit
  onDateRangeModalSubmit() {
    this.fromDate = this.dateRangeFormGroup.controls.fromDate.value;
    this.toDate = this.dateRangeFormGroup.controls.toDate.value;
    if (this.fromDate && this.toDate) {
      this.localStorageService.user.fromDate = this.fromDate;//set the date to localstorage service
      this.localStorageService.user.toDate = this.toDate;//set todate to localstorage service

      // dashboard date update ws call
      let jsonBody: any = {};
      jsonBody.userId = this.localStorageService.user.userId;
      jsonBody.dashboardSelectedFromDate = this.fromDate;
      jsonBody.dashboardSelectedToDate = this.toDate;
      this.complaintDIService.updateDashboardDate(jsonBody).
        subscribe(res => {
          if (res.msgType === 'Info') {
            this.fromDate = this.transform(this.fromDate);
            this.toDate = this.transform(this.toDate);
            console.log("FromDate::", this.fromDate);
            console.log("toDate::", this.toDate);

            //new add for number spinner
            this.tiles1.tilesBodyNumber = '-';
            this.tiles2.tilesBodyNumber = '-';
            this.tiles3.tilesBodyNumber = '-';

            this.getDataTile1();
            this.getDataTile2();
            this.getDataTile3();
            this.toogleDateRange();
            this.modalErrorMsgObj.modalErrMsgShowFlag = false;
            this.modalErrorMsgObj.modalErrorMsg = "";
          } else {
            this.modalErrorMsgObj.modalErrMsgShowFlag = true;
            this.modalErrorMsgObj.modalErrorMsg = res.msg;
          }
        }, err => {
          this.modalErrorMsgObj.modalErrMsgShowFlag = true;
          this.modalErrorMsgObj.modalErrorMsg = err.msg;
        });

    } else {
      this.modalErrorMsgObj.modalErrMsgShowFlag = true;
      this.modalErrorMsgObj.modalErrorMsg = "Please Select Dates";
    }
  }

  transform(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd-MMM-yyyy');
    return value;
  }

  //method for Complaint Logged On and Compliant Reference Date validation 
  public compareTwoDates(controlName: string) {
    let fromDate = new Date(this.dateRangeFormGroup.controls['fromDate'].value);
    let toDate = new Date(this.dateRangeFormGroup.controls['toDate'].value);
    if (controlName === 'fromDate') {
      if (fromDate > toDate) {
        console.log("fromDate Date error.");
        this.modalErrorMsgObj.modalErrMsgShowFlag = true;
        this.modalErrorMsgObj.modalErrorMsg = "From Date should be less than or equals to To Date!";
      } else {
        this.modalErrorMsgObj.modalErrMsgShowFlag = false;
        this.modalErrorMsgObj.modalErrorMsg = "";
      }
    } else if (controlName === 'toDate') {
      if (toDate < fromDate) {
        console.log("toDate Date error.");
        this.modalErrorMsgObj.modalErrMsgShowFlag = true;
        this.modalErrorMsgObj.modalErrorMsg = "To Date should be greater than or equals to From Date!";
      } else {
        this.modalErrorMsgObj.modalErrMsgShowFlag = false;
        this.modalErrorMsgObj.modalErrorMsg = "";
      }
    }//end of else if
  }//end of method

}//end of class
