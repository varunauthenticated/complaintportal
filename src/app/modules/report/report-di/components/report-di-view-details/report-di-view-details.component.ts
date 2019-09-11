/* tslint:disable: member-ordering forin */
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';//to get route param
// import { ToastService } from "../../../../home/services/toast-service";
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { ComplaintDIRegisterDataService } from "../../../../complain/complain-di/services/complaint-di-register-data.service";
import { NgbdModalComponent } from '../../../../widget/modal/components/modal-component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReportsDIDataService } from "../../services/report-di-view-data.service";
import { SessionErrorService } from "../../../../shared/services/session-error.service";

@Component({
    selector: 'ispl-report-di-view-details-form',
    templateUrl: 'report-di-view-details.component.html',
    styleUrls: ['report-di-view-details.component.css']
  })

  export class ReportDIViewDetailsComponent implements OnInit {
    public complaintReferenceNo: string;//to get route param n complaint details
    public complaintDIViewDetails: any = {};//to show the report det in html page
    public custCode: string = "";
    public custName: string = "";
    public salesGroup: string = "";
    public salesOffice: string = "";
    public title:string="";
    //for busy spinner
    public busySpinner: any = {
        complaintDIReportBusy: true,
        busy: true
    };

    constructor(
        private activatedroute: ActivatedRoute,
        private router: Router,
        private localStorageService: LocalStorageService,
        private sessionErrorService: SessionErrorService,
        private reportsDIDataService: ReportsDIDataService) {
      }
    
    ngOnInit(): void {
        console.log("onInit of ReportDIViewDetailsComponent component..");
       this.getRouteParam();//to get route param
       this.getcomplaintDetailsWS();//service call method
    }//end of onInit
    //method to get route param
    private getRouteParam(){
        let routeSubscription: Subscription;
        routeSubscription = this.activatedroute.params.subscribe(params => {
            this.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
        });
        console.log("complaintReferenceNo for report Complaint di: ", this.complaintReferenceNo);
    }//end of method get route param

    public getcomplaintDetailsWS(){
        console.log("ws method for complaint details report");
        this.reportsDIDataService.getComplaintReferenceDetails(this.complaintReferenceNo).
        subscribe(res => {
            console.log("complaintDIViewDetails : ", res),
              this.complaintDIViewDetails = res.details[0];
              for(let customerdet of this.complaintDIViewDetails.customerDetails){
                
                this.custCode = customerdet.customerCode;
                this.custName = customerdet.customerName;
                this.salesGroup = customerdet.salesGroup;
                this.salesOffice = customerdet.salesOffice;
                console.log("customer details this.custCode:: ",this.custCode);
                console.log("customer details this.custName:: ",this.custName);
                console.log("customer details this.salesGroup:: ",this.salesGroup);
                console.log("customer details this.salesOffice:: ",this.salesOffice);
              }
              this.busySpinner.complaintDIReportBusy = false;
              this.updateBusySpinner();
          },
          err => {
            console.log(err);
            this.busySpinner.complaintDIReportBusy = false;
            this.updateBusySpinner();
            this.sessionErrorService.routeToLogin(err._body);
          });

    }//end of service call method

    //to load the spinner
    private updateBusySpinner() {
        if (this.busySpinner.complaintDIReportBusy) { 
        this.busySpinner.busy = true;
        } else if(this.busySpinner.complaintDIReportBusy== false){
        this.busySpinner.busy = false;
        }//end of else if
    }//end of busy spinner method

  }