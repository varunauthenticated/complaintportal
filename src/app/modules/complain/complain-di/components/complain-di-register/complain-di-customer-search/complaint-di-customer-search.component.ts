import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../../../router/router-paths';
// import { LocalStorageService } from "../../../../../shared/services/local-storage.service";
import { ComplaintDIRegisterDataService } from "../../../services/complaint-di-register-data.service";
import { ComplaintDIRegisterEmitService } from "../../../services/complaint-di-register-emit.service";
import { ComplaintDIInvoiceDetailsService } from "../../../services/complaint-di-invoice-details.service";
import { SessionErrorService } from "../../../../../shared/services/session-error.service";

@Component({
    selector: 'ispl-complaint-di-customer-search-form',
    templateUrl: 'complaint-di-customer-search.component.html',
    styleUrls: ['complaint-di-customer-search.component.css']
})
export class ComplaintDICustomerSearchComponent implements OnInit {

    public searchFormGroup: FormGroup;
    public complaintDICustDetails: any = {};
    public title: string = "";
    public custCode: string = "";
    public custName: string = "";
    public salesGroup: string = "";
    public salesOffice: string = "";
    public custDetArr: any[] = [];
    public errorMsgObj: any = {//to show error msg in html
        errorMsgShowFlag: false,
        errorMsg: ''
    };

    //for busy spinner
    public busySpinner: any = {
        busy: true
    };

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private complaintDIRegisterDataService: ComplaintDIRegisterDataService,
        private sessionErrorService: SessionErrorService,
        private complaintDIInvoiceDetailsService: ComplaintDIInvoiceDetailsService       
    ) {
    }//end of constructor

    ngOnInit(): void {

        this.title = this.complaintDIInvoiceDetailsService.title;


        this.getCustomerDetails();

        this.searchFormGroup = this.formBuilder.group({
            'gridSearch': ''
        });
    }

    //start method getCustomerDetails for getting Customer Details from webservices
    private getCustomerDetails() {
        this.complaintDIRegisterDataService.getCustomerDet("").
            subscribe(res => {
                this.complaintDICustDetails = res;
                console.log(" this.complaintDICustDetails ", this.complaintDICustDetails);                    
                if(res.msgType === 'Info'){
                }else{
                    this.errorMsgObj.errorMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                }
                this.busySpinner.busy = false;//to stop busy spinner

            },
            err => {
                console.log(err);
                this.errorMsgObj.errorMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner.busy = false;//to stop busy spinner
                this.sessionErrorService.routeToLogin(err._body);
            });
    }//end of the method getCustomerDetails

    //start method onCancel
    onCancel() {
        this.router.navigate([ROUTE_PATHS.RouteComplainDIRegister]);
    }//end method onCancel


    // start method onCustCodeChoose for choosing a customer code
    onCustCodeChoose() {
        for (let custDet of this.custDetArr) {
            this.custCode = custDet.custCode;
            this.custName = custDet.custName;
            this.salesGroup = custDet.salesGroup;
            this.salesOffice = custDet.salesOffice;
        }
        console.log(" custCode ", this.custCode);
        console.log(" custName ", this.custName);
        console.log(" salesGroup ", this.salesGroup);
        console.log(" salesOffice", this.salesOffice);

        this.complaintDIInvoiceDetailsService.custCode = this.custCode;
        this.complaintDIInvoiceDetailsService.custName = this.custName;
        this.complaintDIInvoiceDetailsService.salesGroup = this.salesGroup;
        this.complaintDIInvoiceDetailsService.salesOffice = this.salesOffice;

        this.router.navigate([ROUTE_PATHS.RouteComplaintDIInvoiceSearch]);


    }//end of the method onCustCodeChoose



    // start method onCustomerNameCheck
    onCustomerNameCheck(custCodeParam, custNameParam, salesGroupParam, salesOfficeParam) {
        if (this.custDetArr.length == 0) {
            this.custDetArr.push({ custCode: custCodeParam, custName: custNameParam, salesGroup: salesGroupParam, salesOffice: salesOfficeParam });
        } else {
            let indexCount: number = 0;
            let removeFlag: boolean = false;
            for (let custDet of this.custDetArr) {
                if (custDet.custCode == custCodeParam && custDet.custName == custNameParam) {
                    this.custDetArr.splice(indexCount, 1);
                    removeFlag = true;
                    break;
                }//end of if
                indexCount++;
            }//end of for 
            if (!removeFlag) {
                this.custDetArr.push({ custCode: custCodeParam, custName: custNameParam, salesGroup: salesGroupParam, salesOffice: salesOfficeParam });
            }//end of if
        }//end of else
    }//end of the method onCustomerNameCheck

}