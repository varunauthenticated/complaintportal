import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../../../router/router-paths';
import { LocalStorageService } from "../../../../../shared/services/local-storage.service";
import { ComplaintPIRegisterDataService } from "../../../services/complaint-pi-register-data.service";
import { InvoiceSearchDetailsModel } from "../../../models/invoice-search-details.model";
import { ComplaintPIRegisterEmitService } from "../../../services/complaint-pi-register-emit.service";
import { SessionErrorService } from "../../../../../shared/services/session-error.service";

@Component({
    selector: 'ispl-complaint-pi-customer-search-form',
    templateUrl: 'complaint-pi-customer-search.component.html',
    styleUrls: ['complaint-pi-customer-search.component.css']
})
export class ComplaintPICustomerSearchComponent implements OnInit {

    public searchFormGroup: FormGroup;
    public complaintPICustDetails: any = {};
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
        private invoiceSearchDetailsModel: InvoiceSearchDetailsModel,
        private formBuilder: FormBuilder,
        private router: Router,
        private sessionErrorService: SessionErrorService,
        private complaintPIRegisterDataService: ComplaintPIRegisterDataService,
    ) {
    }//end of constructor

    ngOnInit(): void {

        this.title = this.invoiceSearchDetailsModel.title;


        this.getCustomerDetails();

        this.searchFormGroup = this.formBuilder.group({
            'gridSearch': ''
        });
    }

    //start method getCustomerDetails for getting Customer Details from webservices
    private getCustomerDetails() {
        this.complaintPIRegisterDataService.getCustomerDet("").
            subscribe(res => {
                this.complaintPICustDetails = res;
                console.log(" this.complaintDICustDetails ", this.complaintPICustDetails);                    
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
        this.router.navigate([ROUTE_PATHS.RouteComplainPIRegister]);
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

        this.invoiceSearchDetailsModel.custCode = this.custCode;
        this.invoiceSearchDetailsModel.custName = this.custName;
        this.invoiceSearchDetailsModel.salesGroup = this.salesGroup;
        this.invoiceSearchDetailsModel.salesOffice = this.salesOffice;

        this.router.navigate([ROUTE_PATHS.RouteComplaintPIInvoiceSearch]);


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