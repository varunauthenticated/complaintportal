import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../../../router/router-paths';
import { LocalStorageService } from "../../../../../shared/services/local-storage.service";
import { ComplaintDIRegisterDataService } from "../../../services/complaint-di-register-data.service";
import { ComplaintDIRegisterEmitService } from "../../../services/complaint-di-register-emit.service";
import { ComplaintDIInvoiceDetailsService } from "../../../services/complaint-di-invoice-details.service";
import { SessionErrorService } from "../../../../../shared/services/session-error.service";

@Component({
  selector: 'ispl-complaint-di-invoice-search-form',
  templateUrl: 'complaint-di-invoice-search.component.html',
  styleUrls: ['complaint-di-invoice-search.component.css']
})
export class ComplaintDIInvoiceSearchComponent implements OnInit {
  public custName: string = "";
  public title: string = "";
  public custCode: string = "";
  public salesGroup: string = "";
  public salesOffice: string = "";
  public compRefNo: string = "";

  public allInvDetails: any[] = [];//array for showing all invoice dets


  public complaintPIInvoiceDetails: any = {};//to show the complaint det in html page

  public invDetailsItemsHeader: any = {};

  public selectedInvDet: any[] = [];// array for showing selected invoice dets

  public searchFormGroup: FormGroup;

  //for busy spinner
  public busySpinner: any = {
    itemHeaderSpinner: true,//for grid itemHeaders
    gridBusy: true,//for grid
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


    this.getItemsHeader("ispl");


    this.title = this.complaintDIInvoiceDetailsService.title;
    this.custCode = this.complaintDIInvoiceDetailsService.custCode;
    this.custName = this.complaintDIInvoiceDetailsService.custName;
    this.salesGroup = this.complaintDIInvoiceDetailsService.salesGroup;
    this.salesOffice = this.complaintDIInvoiceDetailsService.salesOffice;
    this.compRefNo = this.complaintDIInvoiceDetailsService.compRefNo;
    if(this.compRefNo == undefined){
      this.compRefNo = "";
    }
    console.log(" this.compRefNo ===>",this.compRefNo);


    let itemNos: any = {};
    itemNos = this.complaintDIInvoiceDetailsService.selectedItemDetails;
    let items: any[] = itemNos.items;

    for(let selItm of items){
      this.selectedInvDet.push(selItm);
    }

    if (this.selectedInvDet.length > 0) {
        for (let selItm of this.selectedInvDet) {
            if (selItm.customerCode != this.custCode) {
                this.selectedInvDet = [];
                break;
            }
        }
    }
    
    this.getCustomerInvDet();
   


  }//end of onInit


  //start method getItemsVal
  public getItemsHeader(invoiceNo) {
    this.complaintDIRegisterDataService.getInvoiceDetails(invoiceNo).
      subscribe(res => {
        this.invDetailsItemsHeader = res.invoiceDetails.itemsHeader;
        this.busySpinner.itemHeaderSpinner = false;//to stop busy spinner
        this.updateBusySpinner();//to stop busy spinner
      },
      err => {
        console.log(err);
        this.busySpinner.itemHeaderSpinner = false;//to stop busy spinner
        this.updateBusySpinner();//to stop busy spinner
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end method of getItemsVal

  getCustomerInvDet() {
    this.complaintDIRegisterDataService.getCustomerInvDet(this.custCode).
    subscribe(res => {
      this.complaintPIInvoiceDetails = res;
      if (this.selectedInvDet.length == 0) {
        this.allInvDetails = res.invoiceDetails.items;
        this.invDetailsItemsHeader = this.complaintPIInvoiceDetails.invoiceDetails.itemsHeader;
      } else if (this.selectedInvDet.length > 0) {
        let allItemDet = res.invoiceDetails.items;
        let flag: boolean = false;
        for (let alItm of allItemDet) {
          flag = this.selectedItemDetails(alItm.invoiceNo, alItm.itemCode, alItm.customerCode);
          if (flag == false) {
            this.allInvDetails.push(alItm);
          }//end of if flag == false
        }//end of for
      }//end of else if      
      console.log(" this.allInvDetails ========> ", this.allInvDetails);
      console.log(" complaintPIInvoiceDetails ", this.complaintPIInvoiceDetails);
      this.busySpinner.gridBusy = false;//to stop the spinner
      this.updateBusySpinner();//method to stop spinner
      },
      err => {
        console.log(err);
        this.busySpinner.gridBusy = false;//to stop the spinner
        this.updateBusySpinner();//method to stop spinner
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end of method 

  //start method updateBusySpinner to stop the spinner
  private updateBusySpinner(){
    if(this.busySpinner.gridBusy == false && this.busySpinner.itemHeaderSpinner == false){
      this.busySpinner.busy = false;
    }//end of if
  }//end of method update busy spinner

  //start method for getting distinct items row
  private selectedItemDetails(invoiceNo: string, itemCode: string, customerCode: string): boolean {
    let flag: boolean = false;
    for (let selItmDet of this.selectedInvDet) {
      if (selItmDet.invoiceNo == invoiceNo && selItmDet.itemCode == itemCode && selItmDet.customerCode == customerCode) {
        flag = true;
        break;
      }//end of if 
    }//end of for
    return flag;
  }//end of the method selectedItemDetails


  //start method deleteSelInvDetFromAllInvDetArr for deleting the ivoice details from all invoice data grid array
  private deleteSelInvDetFromAllInvDetArr(invoiceNoParam?: string, itemCodeParam?: string) {
    console.log(" allInvDetails before splice ", this.allInvDetails);
    let indexCount: number = 0;
    let allInvDetailsSplice: any[] = [];
    allInvDetailsSplice = this.allInvDetails;
    for (let allInvDet of allInvDetailsSplice) {
      if (allInvDet.invoiceNo == invoiceNoParam && allInvDet.itemCode == itemCodeParam) {
        allInvDetailsSplice.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for
    this.allInvDetails = [];
    this.allInvDetails = allInvDetailsSplice;
    console.log(" allInvDetails after splice ", this.allInvDetails);

  }//end of the method deleteSelInvDetFromAllInvDet

  //start method deleteSelInvDetFromAllInvDetArr for deleting the ivoice details from selected invoice data grid array
  private deleteSelInvDetFromSelInvDetArr(invoiceNoParam?: string, itemCodeParam?: string) {
    console.log(" SelInvDetails before splice ", this.selectedInvDet);
    let indexCount: number = 0;
    for (let selInvDet of this.selectedInvDet) {
      if (selInvDet.invoiceNo == invoiceNoParam && selInvDet.itemCode == itemCodeParam) {
        this.selectedInvDet.splice(indexCount, 1);
        break;
      }//end of if
      indexCount++;
    }//end of for
    console.log(" SelInvDetails after splice ", this.selectedInvDet);
    // let selectedInvDetReturn = this.selectedInvDet;

    // return selectedInvDetReturn;

  }//end of the method deleteSelInvDetFromSelInvDet

  //start method insertSelInvDetToAllInvDetArr for inserting selected inv details into selected inv detais array
  private insertSelInvDetToAllInvDetArr(selInvDetParam?: any, invoiceNoParam?: string, itemCodeParam?: string) {
    if (this.allInvDetails.length == 0) {
      this.allInvDetails.push(selInvDetParam);
    } else {
        for (let allInvDet of this.allInvDetails) {
          if (allInvDet.invoiceNo == invoiceNoParam && allInvDet.itemCode != itemCodeParam) {
            this.allInvDetails.push(selInvDetParam);
            break;
          } else if (allInvDet.invoiceNo != invoiceNoParam) {
            this.allInvDetails.push(selInvDetParam);
            break;
          }//end of else if
        }//end of for
    }//end of else

    //let allInvDetailsReturn = this.allInvDetails;
    //return allInvDetailsReturn;
  }// end of the method insertSelInvDetToSelInvDetArr

  //start method insertSelInvDetToSelInvDetArr for inserting selected inv details into all inv detais array
  private insertSelInvDetToSelInvDetArr(selInvDetParam?: any, invoiceNoParam?: string, itemCodeParam?: string) {
    if (this.selectedInvDet.length == 0) {
      this.selectedInvDet.push(selInvDetParam);
    } else {
        for (let selInvDet of this.selectedInvDet) {
          if (selInvDet.invoiceNo == invoiceNoParam && selInvDet.itemCode != itemCodeParam) {
            this.selectedInvDet.push(selInvDetParam);
            break;
          } else if (selInvDet.invoiceNo != invoiceNoParam) {
            this.selectedInvDet.push(selInvDetParam);
            break;
          }//end of else if
        }//end of for
    }//end of else
    
  }// end of the method insertSelInvDetToAllInvDetArr


  //start method onCheckInvoiceNo method for checking a selected item code and creating selected invoice grid
  onCheckInvoiceNo(selInvDetParam, invoiceNoParam, itemCodeParam) {
    //calling the method deleteSelInvDetFromAllInvDetArr
    this.deleteSelInvDetFromAllInvDetArr(invoiceNoParam, itemCodeParam);
    //calling the method insertSelInvDetToSelInvDetArr
    this.insertSelInvDetToSelInvDetArr(selInvDetParam, invoiceNoParam, itemCodeParam);


    console.log(" selectedInvDet", this.selectedInvDet);
  }//end of the method onCheckInvoiceNo


  //for editing customer name
  onCustNameClick() {
    // let selItmsDet = this.invoiceSearchDetailsModel.selectedItemDetails;
    this.router.navigate([ROUTE_PATHS.RouteComplaintDICustomerSearch]);
  }//end of the method onCustNameClick

  //start method onCloseInvoiceNo for deleting selected invoice details
  onCloseInvoiceNo(selectedInvDet, invoiceNoParam, itemCodeParam) {
    //calling method deleteSelInvDetFromSelInvDetArr
    this.deleteSelInvDetFromSelInvDetArr(invoiceNoParam, itemCodeParam);
    //calling the method insertSelInvDetToAllInvDetArr
    this.insertSelInvDetToAllInvDetArr(selectedInvDet, invoiceNoParam, itemCodeParam);
  }//end of the method onCloseInvoiceNo



  //start method onSubmitSelectedInvDet
  onSubmitSelectedInvDet() {
    let prevSelItmDet: any = {};
    let items: any = [];
    if (this.selectedInvDet.length > 0) {
      items = this.selectedInvDet;
    }
    prevSelItmDet.items = items;

    this.complaintDIInvoiceDetailsService.selectedItemDetails = prevSelItmDet;

    this.router.navigate([ROUTE_PATHS.RouteComplainDIRegister]);    
  }//end of the method onSubmitSelectedInvDet

  onCancel() {
    console.log(" this.complaintDIInvoiceDetailsService.selectedItemDetails ",this.complaintDIInvoiceDetailsService.selectedItemDetails)
    this.router.navigate([ROUTE_PATHS.RouteComplainDIRegister]);
  }

}//end of class


