import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl , FormBuilder} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { DatePipe } from '@angular/common';
import { ROUTE_PATHS } from '../../../../router/router-paths';
import { ComplaintPIRegisterDataService } from "../../services/complaint-pi-register-data.service";
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { PIPolygonModel } from "../../../../shared/components/process-flow/complain-pi-polygon.model";
import { SessionErrorService } from "../../../../shared/services/session-error.service";

@Component({
    selector: 'ispl-complaint-pi-register-details-view-form',
    templateUrl: 'complaint-pi-register-details-view.component.html',
    styleUrls: ['complaint-pi-register-details-view.component.css']
})
export class ComplaintPIRegisterDetailsViewComponent implements OnInit {

    public title: string = "Complaint Register";
    public complaintRegisterFormGroup: FormGroup;
    //to store  selected items grid row
    public selectedItemsGrid: any[] = [];
    //to store the itemsHeader
    public itemsHeader: any = {};
    public custCode: string = "";
    public custName: string = "";
    public custSegment: string = "";
    public salesGroup: string = "";
    public salesOffice: string = "";

    //var to check index for process flow
    public processFlowPageIndex: number = 0;
    public processFlowData: string[] = [];
    //for busy spinner
    public busySpinner: boolean = false;
    public selectedComplaintReferenceDetails: any = {};//to get selected complaint values
    public errorObj: any = {
        errorMsgShowFlag: false,
        errorMsg: ''
    };

    constructor(
        private activatedroute: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private complaintPIRegisterDataService: ComplaintPIRegisterDataService,
        private datePipe: DatePipe,
        private localStorageService: LocalStorageService,
        private sessionErrorService: SessionErrorService,
    ) {
    }

    ngOnInit(): void {
        let routeSubscription: Subscription;
        let complaintReferenceNo: string = '';
        routeSubscription = this.activatedroute.params.subscribe(params => {
            complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
        });
        console.log("complaintReferenceNo for view Complaint pi: ", complaintReferenceNo);
        this.getComplaintReferenceDetailsWSCall(complaintReferenceNo,10);
        this.processFlowData = new PIPolygonModel().validRootCaus;//set the process flow step from model            
        this.buildForm();
    }//end of onInit

    //a method named buildform for creating the complaintRegisterFormGroup and its formControl
    private buildForm(): void {       
        this.complaintRegisterFormGroup = new FormGroup({
            complaintReferenceNo: new FormControl(''),
            modeId: new FormControl(''),
            complaintReferenceDt: new FormControl(''),
            modeReferenceNo: new FormControl(''),
            custCode: new FormControl(''),
            custName: new FormControl(''),
            salesGroup: new FormControl(''),
            salesOffice: new FormControl(''),
            invoiceNo: new FormControl(''),
            contactPersonName: new FormControl(''),
            contactPersonPhoneNo: new FormControl(''),
            contactPersonEmailId: new FormControl(''),
            loggedBy: new FormControl(''),
            loggedOnDt: new FormControl(''),
            complaintTypeId: new FormControl(''),
            natureOfComplaintId: new FormControl(''),
            severityIndexRating: new FormControl(''),
            complaintReceivedById: new FormControl(''),
            // departmentNameOther: new FormControl(''),
            complaintReceivedByName: new FormControl(''),
            complaintReceivedByPhoneNo: new FormControl(''),
            complaintDetails: new FormControl(''),
            itemNos: new FormControl(''),
            repeatedComplaint: new FormControl({value:'N',disabled:true}),
            previousComplaintReferenceNo: new FormControl(''),
            commercialSettlementRadioBtn: new FormControl({value:'N',disabled:true})            
        });
    }//end of method buildForm

    public getComplaintReferenceDetailsWSCall(complaintReferenceNo: string, fileActivityId: number) {
        this.busySpinner = true;
        this.complaintPIRegisterDataService.getComplaintReferenceDetails(complaintReferenceNo, fileActivityId)
            .subscribe(res => {
                //getting the comp ref details from webservice
                this.selectedComplaintReferenceDetails = res.details[0];
                this.itemsHeader = res.itemsHeader;
                console.log("res for view comp: ", res);
                console.log("comprefdetobj for edit comp: ", this.selectedComplaintReferenceDetails);
                console.log("this.selectedComplaintReferenceDetails.activityId: ", this.selectedComplaintReferenceDetails.activityId);
                console.log("this.localStorageService.appSettings.complaintRegistrationActivityId :", this.localStorageService.appSettings.complaintRegistrationActivityId);
                if (res.msgType == 'Info') {
                    let invItems: any[] = this.selectedComplaintReferenceDetails.itemNos.items;
                    let customerDet: any = this.selectedComplaintReferenceDetails.customerDetails;
                    this.setFormValueFromRes(invItems,customerDet,this.selectedComplaintReferenceDetails);                   
                } else {
                    this.errorObj.errorMsgShowFlag = true;
                    this.errorObj.errorMsg = res.msg;
                    this.busySpinner = false;
                }
            },
                err => {
                    console.log(err);
                    this.busySpinner = false;
                    this.sessionErrorService.routeToLogin(err._body);
                });
    }//end of method

    private setFormValueFromRes(invItems:any[],customerDet:any,selectedComplaintReferenceDetails:any) {
        this.complaintRegisterFormGroup.controls['custCode'].setValue(customerDet.customerCode);
        this.complaintRegisterFormGroup.controls['custName'].setValue(customerDet.customerName);
        this.complaintRegisterFormGroup.controls['salesGroup'].setValue(customerDet.salesGroup);
        this.complaintRegisterFormGroup.controls['salesOffice'].setValue(customerDet.salesOffice);
        if (invItems.length > 0) {                                  
            for (let selItm of invItems) {
                this.selectedItemsGrid.push(selItm);
            }
        }//end of if
        //set all data to form 
        this.complaintRegisterFormGroup.controls['complaintReferenceNo'].setValue(selectedComplaintReferenceDetails.complaintReferenceNo);
        this.complaintRegisterFormGroup.controls['complaintReceivedById'].setValue(selectedComplaintReferenceDetails.complaintReceivedBy);
        // this.complaintRegisterFormGroup.controls['departmentNameOther'].setValue(selectedComplaintReferenceDetails.departmentNameOther);
        this.complaintRegisterFormGroup.controls['complaintReceivedByName'].setValue(selectedComplaintReferenceDetails.complaintReceivedByName);
        this.complaintRegisterFormGroup.controls['complaintReceivedByPhoneNo'].setValue(selectedComplaintReferenceDetails.complaintReceivedByPhoneNo);
        this.complaintRegisterFormGroup.controls['complaintReferenceDt'].setValue(this.datePipe.transform(selectedComplaintReferenceDetails.complaintReferenceDt,'yyyy-MMM-dd'));
        this.complaintRegisterFormGroup.controls['modeId'].setValue(selectedComplaintReferenceDetails.modeDesc);
        this.complaintRegisterFormGroup.controls['contactPersonName'].setValue(selectedComplaintReferenceDetails.contactPersonName);
        this.complaintRegisterFormGroup.controls['contactPersonPhoneNo'].setValue(selectedComplaintReferenceDetails.contactPersonPhoneNo);
        this.complaintRegisterFormGroup.controls['contactPersonEmailId'].setValue(selectedComplaintReferenceDetails.contactPersonEmailId);
        let loggedByName: string =         
        selectedComplaintReferenceDetails.categoryDesc?
        selectedComplaintReferenceDetails.loggedByName + '['+selectedComplaintReferenceDetails.categoryDesc+']':
        selectedComplaintReferenceDetails.loggedByName;
        this.complaintRegisterFormGroup.controls['loggedBy'].setValue(loggedByName);
        this.complaintRegisterFormGroup.controls['loggedOnDt'].setValue(this.datePipe.transform(selectedComplaintReferenceDetails.loggedOnDt,'yyyy-MMM-dd'));
        this.complaintRegisterFormGroup.controls['complaintTypeId'].setValue(selectedComplaintReferenceDetails.complaintTypeDesc);
        this.complaintRegisterFormGroup.controls['natureOfComplaintId'].setValue(selectedComplaintReferenceDetails.natureOfComplaintDesc);
        this.complaintRegisterFormGroup.controls['complaintDetails'].setValue(selectedComplaintReferenceDetails.complaintDetails);
        this.complaintRegisterFormGroup.controls['severityIndexRating'].setValue(selectedComplaintReferenceDetails.severityIndexRatingDesc);
        this.complaintRegisterFormGroup.controls['repeatedComplaint'].setValue(selectedComplaintReferenceDetails.repeatedComplaint);
        this.complaintRegisterFormGroup.controls['previousComplaintReferenceNo'].setValue(selectedComplaintReferenceDetails.previousComplaintReferenceNo);
        let customerRequiredCommsettradioVal: string = selectedComplaintReferenceDetails.requiredCommercialSettlementInComplaintRegistration;
        this.complaintRegisterFormGroup.controls['commercialSettlementRadioBtn'].setValue(customerRequiredCommsettradioVal.substring(0,1));
        this.busySpinner = false;//to stop the spinner
    }
    //for clicking cancel button this method will be invoked
    public onCancel(): void {
        this.router.navigate([ROUTE_PATHS.RouteComplainPIView]);
    }// end of onCancel method

    //method to delete error msg by cross click
    public deleteResErrorMsgOnClick(){
        this.errorObj.errorMsgShowFlag = false;
        this.errorObj.errorMsg = '';
    }//end of method

}//end of class