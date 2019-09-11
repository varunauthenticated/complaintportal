import { Component, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Observable } from 'rxjs';
import { LocalStorageService } from "../../../../../shared/services/local-storage.service";
// import { AppUrlsConst, WebServiceConst } from "../../../../app-config';
import { ComplaintDIRegisterDataService } from "../../../services/complaint-di-register-data.service";
import { ComplaintDIRegisterEmitService } from "../../../services/complaint-di-register-emit.service";
import { ComplaintDIInvoiceDetailsService } from "../../../services/complaint-di-invoice-details.service";
import { ROUTE_PATHS } from '../../../../../router/router-paths';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionErrorService } from "../../../../../shared/services/session-error.service";

@Component({
  selector: 'ngbd-di-register-modal-component',
  templateUrl: 'complaint-di-register-modal.component.html',
  styleUrls: ['complaint-di-register-modal.component.css']
})
export class NgbdComplaintDIRegisterModalComponent implements OnInit {
  @Input() modalTitle;
  @Input() invoiceNo: string;
  @Input() custName: string;
  @Input() custCode: string;
  private headers: Headers;
  public items: any = {};
  //Array for selected Item
  public checkedItemArr: any[] = [];
  public selectedItemDetails: any[] = [];
  public itemDets: any = {};
  public itemsHeader: any = {}; // to store the item header
  public customerCodeError: boolean = false;//for codetomercode error
  public msgType: string;
  public complaintDIInvoiceDetails: any = {};//to show the complaint det in html page

  //spinner
  public busySpinner: any = {
    busy: true
  }

  constructor(public activeModal: NgbActiveModal,
    private http: Http, private el: ElementRef,
    private router: Router,
    private localStorageService: LocalStorageService,
    private complaintDIRegisterDataService: ComplaintDIRegisterDataService,
    private complaintDIInvoiceDetailsService: ComplaintDIInvoiceDetailsService,
    private sessionErrorService: SessionErrorService,
    private complaintDIRegisterEmitService: ComplaintDIRegisterEmitService) {
  }//end of constructor

  ngOnInit(): void {
    if (this.invoiceNo != '') {
      this.complaintDIInvoiceDetails = [];
      this.getItemsVal(this.invoiceNo);
      //this.invoiceSearchDetailsModel.invNo = this.invoiceNo;
    } else if (this.invoiceNo == '') {
      this.complaintDIInvoiceDetails = [];
      this.items = [];
      this.msgType = "Error";
      this.busySpinner.busy = false;
    }//end of if
  }//end of onInit

  //start method getDistinctItemsForInv 1.11.17
  private getDistinctItemsForInv(itmDetResParam) {
    let flag: boolean = false;
    for (let itmDetRes of itmDetResParam) {
      flag = this.getDistinctItmRow(itmDetRes);
      if (flag == false) {
        this.items.push(itmDetRes);
      }// end of if
    }//end of for
    this.checkBoxEnableDisableForItem();
  }//end of the method getDistinctItemsForInv

  //start method for setting checkbox checked or unchecked 1.11.17
  private checkBoxEnableDisableForItem() {
    let allItemsInPiRegGrid: any[] = this.complaintDIInvoiceDetailsService.selectedItemDetails;
    let prevCustCode = this.complaintDIInvoiceDetailsService.custCode;
    for (let itmInModal of this.items) {
      if (prevCustCode != itmInModal.customerCode && prevCustCode != undefined && prevCustCode != "") {
        this.items = [];
        this.customerCodeError = true;
        break;
      } else {
        for (let itmInPiReg of allItemsInPiRegGrid) {
          if (itmInModal.invoiceNo == itmInPiReg.invoiceNo && itmInModal.itemCode == itmInPiReg.itemCode) {
            itmInModal.complaintQtyInMtrs = itmInPiReg.complaintQtyInMtrs;
            itmInModal.uiCheckItmFlag = true;
            this.checkedItemArr.push(itmInModal);
            break;
          } else if (itmInModal.invoiceNo == itmInPiReg.invoiceNo && itmInModal.itemCode != itmInPiReg.itemCode) {
            itmInModal.uiCheckItmFlag = false;
          }//else if 
        }//end of for
      }//end of else
    }//end of for
  }//end of the method checkBoxEnableDisableForItem

  //start method for getting distinct items row 1.11.17
  private getDistinctItmRow(itmDetResParam: any): boolean {
    let flag: boolean = false;
    for (let itm of this.items) {
      if (itm.itemCode == itmDetResParam.itemCode) {
        flag = true;
        break;
      }//end of if 
    }//end of for
    return flag;
  }//end of the method getDistinctItmRow



  //start method getItemsVal
  public getItemsVal(invoiceNo, selectedItemsId?: any[]) {
    this.complaintDIRegisterDataService.getInvoiceDetails(invoiceNo).
      subscribe(res => {
        //getting the items object array for webservice and initialing it to a publically defind array named items 
        this.complaintDIInvoiceDetails = res.invoiceDetails;
        this.busySpinner.busy = false;
        this.items = [];
        let itmDetRes: any[] = res.invoiceDetails.items;
        this.getDistinctItemsForInv(itmDetRes);
        this.msgType = res.invoiceDetails.msgType;
        console.log(" msgType==>", this.msgType);
        console.log(" this.complaintDIInvoiceDetails ", this.complaintDIInvoiceDetails);
        if (this.msgType == 'Error') {
          this.complaintDIInvoiceDetails = [];
          this.busySpinner.busy = false;
        }
      },
      err => {
        console.log(err);
        this.busySpinner.busy = false;
        this.sessionErrorService.routeToLogin(err._body);
      });
  }//end method of getItemsVal

  //method for clicking single checkbox
  public onCheckboxClick(checkedItemId) {
    if (this.checkedItemArr.length == 0) {
      for (let items of this.complaintDIInvoiceDetails.items) {
        if (checkedItemId == items.itemCode) {
          this.checkedItemArr.push(items)
          console.log(" this.checkedItemArr ", this.checkedItemArr);
        }
      }
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let checkedItm of this.checkedItemArr) {
        if (checkedItm.itemCode == checkedItemId) {
          this.checkedItemArr.splice(indexCount, 1);
          console.log(" this.checkedItemArr ", this.checkedItemArr);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for
      if (!removeFlag) {
        for (let items of this.complaintDIInvoiceDetails.items) {
          if (checkedItemId == items.itemCode) {
            this.checkedItemArr.push(items)
          }
        }
      }//end of if
    }//end of else
  }//end of onCheckboxClick method

  public chooseItem() {
    this.activeModal.dismiss('Cross click');
    let itemDets: any = {};
    itemDets.selectedItem = this.checkedItemArr;
    if (this.selectedItemDetails.length == 0) {
      this.selectedItemDetails.push({ key: this.invoiceNo, value: itemDets })
    } else {
      let indexCount: number = 0;
      let removeFlag: boolean = false;
      for (let selectedDet of this.selectedItemDetails) {
        if (selectedDet.key == this.invoiceNo) {
          this.selectedItemDetails.splice(indexCount, 1);
          removeFlag = true;
          break;
        }//end of if
        indexCount++;
      }//end of for 
      if (!removeFlag) {
        this.selectedItemDetails.push({ key: this.invoiceNo, value: itemDets })
      }//end of if
    }//end of else
    // this.selectedItemDetails = this.checkedItemArr;

    console.log(" selectedItemDetails ===>", this.selectedItemDetails);
   //passing the itemsHeader through eventemitter
   this.complaintDIRegisterEmitService.emitItemsHeader(this.itemsHeader);
   console.log(" selectedItemDetails ===>", this.selectedItemDetails);
   //passing items details grid row through eventemitter
   this.complaintDIRegisterEmitService.emitModalResult(this.selectedItemDetails);
  }//end of the method of chooseItem

  // start method onRedirectInvoiceSearch for redirecting to invoice search page
  onRedirectInvoiceSearch() {
    let selItmsDet: any = {};
    let items: any[] = [];
    let compRefNo : string = "";
    if (this.complaintDIInvoiceDetailsService && this.complaintDIInvoiceDetailsService.selectedItemDetails) {
      selItmsDet = this.complaintDIInvoiceDetailsService.selectedItemDetails;
    } else {
      selItmsDet.items = [];
    }
    compRefNo = this.complaintDIInvoiceDetailsService.compRefNo;
    if(compRefNo == undefined){
      compRefNo = "";
    }
    items = selItmsDet.items;

    if (items.length == 0 && compRefNo == "") {
      this.router.navigate([ROUTE_PATHS.RouteComplaintDICustomerSearch]);
    } else if (items.length > 0 || (items.length == 0 && compRefNo != "")) {

      this.router.navigate([ROUTE_PATHS.RouteComplaintDIInvoiceSearch]);
    }
    this.activeModal.close('Close click');
  }//end of the method onRedirectInvoiceSearch

}//end of class



