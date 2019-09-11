import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { ROUTE_PATHS } from '../../../router/router-paths';
import { ComplaintDIService } from '../../../shared/services/complaint-di.service';
import { SessionErrorService } from '../../../shared/services/session-error.service';
import { CommercialSettlementDIDataService } from '../services/commercial-settlement-di-data.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
@Component({
    selector: 'ispl-comm-set',
    templateUrl: './commercial-settlement-di.component.html',
    styleUrls: ['./commercial-settlement-di.component.css']
})

export class CommercialSettlementDIComponent implements OnInit {

    private routeParam: any = {
        complaintReferenceNo: '',//
        complaintStatus: '',
        commsettcount: 0
    };

    // form data for file upload
    @ViewChild('fileInput')
    fileInputVariable: any;
    private formData: FormData = new FormData();
    private totalFileSize: number = 0;//file upload error
    private fileSizeLimit: number = 104857600;
    private fileData: FormData;
    public fileList: FileList;
    public fileArr: any[] = [];//to store file details from file upload response

    public prevFileArr: any[] = [];//to store prev file from comm sett

    private totalCompensationAmount: number = 0;
    public commerCialSettlementFromGroup: FormGroup;
    public errorMsgObj: any = {
        errMsgShowFlag: false,
        errorMsg: ''
    }
    public itemDetails: any[] = [];// to store item deatils from response
    public busySpinner: boolean = false;//to load n stop the spinner
    public invoiceItemErrFlag: boolean = false;//to check invoice item have error or not 
    public itemListFormGroup: FormGroup;//to create dynamic formControl for compensation qty n rate
    public commSetlmntLevel: number = 0;//taking a var to maintain the user access

    public previousCommSettDetArr: any[] = [];//to store previous commercial settlement details

    constructor(
        private datePipe: DatePipe,
        private router: Router,
        private activatedroute: ActivatedRoute,
        private complaintDIService: ComplaintDIService,
        private sessionErrorService: SessionErrorService,
        private localStorageService: LocalStorageService,
        private commercialSettlementDIDataService: CommercialSettlementDIDataService
    ) {
        console.log("constructor of CommercialSettlementComponent class");
        this.commSetlmntLevel = this.localStorageService.user.commSetlmntLevel;
        this.initForm();//init form
        if (this.commSetlmntLevel == 3 || this.commSetlmntLevel == 4) {
            this.commerCialSettlementFromGroup.controls['compensation'].setValidators(Validators.required);
        }
    }//end of constructor

    ngOnInit(): void {
        console.log("Oninit of CommercialSettlementComponent class");
        this.getRouteParam();
    }//end of on init

    /**
     * @description
     */
    private initForm() {
        this.commerCialSettlementFromGroup = new FormGroup({
            complaintReferenceNo: new FormControl(''),
            date: new FormControl(''),
            totalCompensationAmount: new FormControl(''),
            customerCode: new FormControl(''),
            customerName: new FormControl(''),
            salesGroup: new FormControl(''),
            salesOffice: new FormControl(''),
            compensation: new FormControl(''),
            remarks: new FormControl('', Validators.required)
        });

        // creating initial formcontrol for itemListFormGroup 
        this.itemListFormGroup = new FormGroup({
            dummyformcontrol: new FormControl(''),
        });
    }//end of method

    private getRouteParam() {
        let routeSubscription: Subscription;
        routeSubscription = this.activatedroute.params.subscribe(params => {
            this.routeParam.complaintReferenceNo = params.complaintReferenceNo ? params.complaintReferenceNo : '';
            this.routeParam.complaintStatus = params.complaintStatus ? params.complaintStatus : '';
            this.routeParam.commsettcount = params.commsettcount ? params.commsettcount : 0;
        });
        this.commerCialSettlementFromGroup.controls["complaintReferenceNo"].setValue(this.routeParam.complaintReferenceNo);

        if (this.routeParam.commsettcount > 0) {
            this.getcommSetViewWSCall();
        } else if (this.routeParam.commsettcount == 0) {
            let currentDate = this.generateDate();
            this.commerCialSettlementFromGroup.controls["date"].setValue(this.datePipe.transform(currentDate, 'dd-MMM-yyyy'));
            this.getviewComplainReferenceDetailsWSCall();
        }
    }//end of method route param

    //method to generate date
    private generateDate(): string {
        let date = new Date();
        let currentDate: string = this.datePipe.transform(date, 'yyyy-MM-dd');
        return currentDate;
    }//end of method

    //method to file upload
    private fileUploadWSCall(plantType: string, fileJsonBody: any) {
        this.commercialSettlementDIDataService.postFile(plantType, fileJsonBody).
            subscribe(res => {
                if (res.msgType === 'Info') {
                    console.log("files uploaded successfully");
                }
            }, err => {
                console.log(err);
            });
    }//end of method

    //method to get commercial settlement details
    private getcommSetViewWSCall() {
        this.busySpinner = true;//to load spinner
        this.commercialSettlementDIDataService.getCommercialSettlementHeaderDetails(this.routeParam.complaintReferenceNo, "DI").
            subscribe(res => {
                if (res.msgType == 'Info') {
                    let json: any = JSON.parse(res.mapDetails);
                    console.log("comm sett header det json::::", json);
                    let lastIndex: number = json ? json.length - 1 : 0;
                    this.commerCialSettlementFromGroup.controls['customerCode'].setValue(json[lastIndex].customerCode);
                    this.commerCialSettlementFromGroup.controls['customerName'].setValue(json[lastIndex].customerName);
                    this.commerCialSettlementFromGroup.controls['salesGroup'].setValue(json[lastIndex].salesGroup);
                    this.commerCialSettlementFromGroup.controls['salesOffice'].setValue(json[lastIndex].salesOffice);
                }
            }, err => {
                console.log(err);
            });
        this.commercialSettlementDIDataService.getCommercialSettlementViewDetails(this.routeParam.complaintReferenceNo, this.routeParam.complaintStatus, "DI").
            subscribe(res => {
                if (res.msgType == 'Info') {
                    let json: any = JSON.parse(res.mapDetails);
                    console.log("comm sett view det json::::", json);
                    json.forEach(el => {
                        let prevCommSettJson: any = {};
                        prevCommSettJson.remarks = el.remarks;
                        prevCommSettJson.commercialSettlementDate = this.datePipe.transform(el.commercialSettlementDate, 'dd-MMM-yyyy');
                        prevCommSettJson.makerName = el.makerName;
                        prevCommSettJson.commercialSettlementAutoId = el.commercialSettlementAutoId;
                        switch (el.status) {
                            case 'C': {
                                prevCommSettJson.action = "Request";
                                prevCommSettJson.makerLabelName = "Requested By: ";
                                break;
                            }
                            case 'A': {
                                prevCommSettJson.action = "Accept";
                                prevCommSettJson.makerLabelName = "Accepted By: ";
                                break;
                            }
                            case 'R': {
                                prevCommSettJson.action = "Reject";
                                prevCommSettJson.makerLabelName = "Rejected By: ";
                                break;
                            }
                            case 'Q': {
                                prevCommSettJson.action = "Query";
                                prevCommSettJson.makerLabelName = "Query raised By: ";
                                break;
                            }
                            case 'M': {
                                prevCommSettJson.action = "Comment";
                                prevCommSettJson.makerLabelName = "Comment given By: "
                            }
                        }
                        // prevCommSettJson.action = json.status;
                        this.previousCommSettDetArr.push(prevCommSettJson);
                    });
                    console.log(this.previousCommSettDetArr);
                    //taking the date value from array
                    let commSettDate: string = this.previousCommSettDetArr[0].commercialSettlementDate;
                    this.commerCialSettlementFromGroup.controls["date"].setValue(this.datePipe.transform(commSettDate, 'dd-MMM-yyyy'));
                    this.getCommSettInvItemDet(this.routeParam.complaintReferenceNo, "DI");
                    
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop the spinner
                }
            }, err => {
                console.log(err);
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner = false;//to stop the spinner
            });
    }//end of method

    //method to get prev file det
    private getPrevCommSettFileDet(complaintReferenceNo: string, complainDetailsAutoId: number) {
        this.commercialSettlementDIDataService.viewFile(complaintReferenceNo, complainDetailsAutoId,"DI").
        subscribe(res => {
          console.log("res of file det::::", res);
          if (res.msgType === 'Info') {
            let json: any = JSON.parse(res.mapDetails);
            console.log("json::::", json);
            this.prevFileArr = json;
            console.log("File details::::", this.prevFileArr);
            this.busySpinner = false;
          } else {
            this.busySpinner = false;
            this.prevFileArr = [];
          }
        },
          err => {
            console.log(err);
            this.prevFileArr = [];
            this.busySpinner = false;
            this.sessionErrorService.routeToLogin(err._body);
          });
    }//end of method

    //method to get comm sett inv item
    private getCommSettInvItemDet(compRefNo: string, plantType: string) {
        this.commercialSettlementDIDataService.getInvoiceItemDetail(compRefNo, plantType).
            subscribe(res => {
                if (res.msgType == 'Info') {
                    console.log("Comm Sett Inv Item::", res);
                    let json: any = JSON.parse(res.mapDetails);
                    this.itemDetails = json;
                    this.generateTotalCompensationAmount();//to generate total compensation amount
                    this.createItemFormgroupForSelectedItem();//creating dynamic formcontrol
                    this.getPrevCommSettFileDet(this.routeParam.complaintReferenceNo,this.itemDetails[0].complaintDetailsAutoId);
                    this.busySpinner = false;//to stop the spinner
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop the spinner
                }
            }, err => {
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner = false;//to stop the spinner
            })
    }//end of method

    //method to get complain reference details by service 
    private getviewComplainReferenceDetailsWSCall() {
        this.busySpinner = true;//to load the spinner
        let compStatus: number = this.routeParam.complaintStatus > 10 ? 40 : 10;
        this.complaintDIService.getComplainViewDetails(this.routeParam.complaintReferenceNo, compStatus).
            subscribe(res => {
                console.log("res of ref det::::", res);
                if (res.msgType === 'Info') {
                    let json: any = JSON.parse(res.mapDetails);
                    console.log("json::::", json);
                    let lastIndex = json ? json.length - 1 : 0;
                    this.commerCialSettlementFromGroup.controls['customerCode'].setValue(json[lastIndex].customerCode);
                    this.commerCialSettlementFromGroup.controls['customerName'].setValue(json[lastIndex].customerName);
                    this.commerCialSettlementFromGroup.controls['salesGroup'].setValue(json[lastIndex].salesGroup);
                    this.commerCialSettlementFromGroup.controls['salesOffice'].setValue(json[lastIndex].salesOffice);
                    let complainDetailsAutoId: number = json[lastIndex].complaintDetailsAutoId;
                    this.getInvoiceItemDetailWSCall(this.routeParam.complaintReferenceNo, compStatus, complainDetailsAutoId);//inv item details

                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop the spinner
                }
            },
                err => {
                    console.log(err);
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = err.msg;
                    this.busySpinner = false;//to stop the spinner
                    this.sessionErrorService.routeToLogin(err._body);
                });
    }//end of method

    //start method getInvoiceItemDetailWSCall to get item details
    private getInvoiceItemDetailWSCall(complaintReferenceNo: string, pageActivityId: number, complainDetailsAutoId: number) {
        this.complaintDIService.getInvoiceItemDetail(complaintReferenceNo, pageActivityId, complainDetailsAutoId).
            subscribe(res => {
                if (res.msgType === "Info") {
                    let invItemDeatilsJson: any = JSON.parse(res.mapDetails);
                    this.itemDetails = invItemDeatilsJson;
                    this.busySpinner = false;
                    console.log("item details =========.........>>>>>>>>>", this.itemDetails);
                    this.createItemFormgroupForSelectedItem();//creating dynamic formcontrol
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//stop the spinner
                }
            },
                err => {
                    console.log(err);
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = err.msg;
                    this.busySpinner = false;
                    this.sessionErrorService.routeToLogin(err._body);
                });
    }//end method of getInvoiceItemDetailWSCall

    //method to create dynamic formcontrol
    private createItemFormgroupForSelectedItem() {
        //creating an object for formgroup
        let itmFrmgroup: any = {};
        // iterating arr to creating dynamic formcontrol
        this.itemDetails.forEach(itemel => {
            console.log(" formGroup created");
            //pushing hardcoded compensationQty 
            if (!itemel.compensationQty) {
                itemel.compensationQty = 0;
            }
            if (!itemel.itemRate) {
                itemel.itemRate = 0;
            }
            if (!itemel.settlementCost) {
                itemel.settlementCost = 0;
            }
            //end of pushing hardcoded compensationQty
            // creating key
            let key = itemel.slNo;
            let compensationQtyKey = key + "_" + "compensationQty";
            let itemRateKey = key + "_" + "itemRate";

            //creating dynamic formcontrol
            itemel.compensationQtyKey = compensationQtyKey;
            itemel.itemRateKey = itemRateKey;

            itmFrmgroup[compensationQtyKey] = new FormControl(itemel.compensationQty, Validators.required);
            itmFrmgroup[itemRateKey] = new FormControl(itemel.itemRate, Validators.required);

            //creating formgroup
            this.itemListFormGroup = new FormGroup(itmFrmgroup);
        });
        console.log("ItemArr====", this.itemDetails);
    }//end of the method 

    //to generate total compensation amount
    private generateTotalCompensationAmount() {
        this.totalCompensationAmount = 0;
        for (let itemel of this.itemDetails) {
            this.totalCompensationAmount = this.totalCompensationAmount + parseFloat(itemel.settlementCost);
        }//end of for
        this.totalCompensationAmount = parseFloat(this.totalCompensationAmount.toFixed(2));
        this.commerCialSettlementFromGroup.controls['totalCompensationAmount'].setValue(this.totalCompensationAmount);

    }//end of the method

    //start method of complaintQtyErrorCorrection
    private compensationQtyItemRateErrorCorrection() {
        for (let itemEl of this.itemDetails) {
            if (itemEl.compensationQtyErrFlag || itemEl.itemRateErrFlag) {
                this.invoiceItemErrFlag = true;
                break;
            } else if ((itemEl.compensationQtyErrFlag === false || itemEl.compensationQtyErrFlag === undefined) && (itemEl.itemRateErrFlag === false || itemEl.itemRateErrFlag === undefined)) {
                this.invoiceItemErrFlag = false;
            }
        }//end of for
    }//end of the method complaintQtyErrorCorrection   

    // to change unit dropdown value 17.09.18
    public onCompensationAndItemRateChanges(checkItmParam: any) {
        console.log(" checkItmParam === ", checkItmParam);
        // let qty: number = 0;
        let compensationQty: number = 0;
        let itemRate: number = 0;
        this.itemDetails.forEach(checkItm => {
            if (checkItm.slNo == checkItmParam.slNo) {
                compensationQty = 0;
                itemRate = 0;
                for (let itmList in this.itemListFormGroup.value) {
                    let arr: string[] = itmList.split('_');
                    console.log(" arr ==== ", arr);
                    if (arr.length == 2) {
                        if (arr[0] == checkItmParam.slNo) {
                            console.log(" slno mateched ");
                            if (arr[1] == "compensationQty") {
                                compensationQty = this.itemListFormGroup.controls[itmList].value;
                                if (compensationQty < 0 || compensationQty == null || compensationQty == undefined) {//compensationQty == 0 || 
                                    checkItm.compensationQtyErrFlag = true;
                                    if (compensationQty == null || compensationQty == undefined) {//compensationQty == 0 || 
                                        checkItm.compensationQtyErrDesc = 'Compensation Quantity can′t be empty';
                                    } else if (compensationQty < 0) {
                                        checkItm.compensationQtyErrDesc = 'Compensation Quantity can′t be less than zero';
                                    }//end of else if
                                } else {
                                    if (compensationQty > checkItm.complaintQtyInMtrs) {
                                        checkItm.compensationQtyErrFlag = true;
                                        checkItm.compensationQtyErrDesc = 'Compensation Quantity can′t be greater than Complaint Qty';
                                    } else {
                                        checkItm.compensationQty = compensationQty;
                                        checkItm.compensationQtyErrFlag = false;
                                        checkItm.compensationQtyErrDesc = '';
                                    }
                                }//end of else
                                console.log(" got value compensationQty == ", compensationQty);
                            } else if (arr[1] == "itemRate") {
                                itemRate = this.itemListFormGroup.controls[itmList].value;
                                if (itemRate < 0 || itemRate == null || itemRate == undefined) {//itemRate == 0 || 
                                    checkItm.itemRateErrFlag = true;
                                    if (itemRate == null || itemRate == undefined) {//itemRate == 0 || 
                                        checkItm.itemRateErrDesc = 'Item Rate can′t be empty';
                                    } else if (itemRate < 0) {
                                        checkItm.itemRateErrDesc = 'Item Rate can′t be less than zero';
                                    }//end of else if
                                } else {
                                    checkItm.itemRate = itemRate;
                                    checkItm.itemRateErrFlag = false;
                                    checkItm.itemRateErrDesc = '';
                                }//end of else
                                console.log(" got value itemRate == ", itemRate);
                            }
                        }//end if of slno and controlname 1st element
                    }//end if of length to splited array
                }//end of  for loop of itemListFormGroup

                if (compensationQty > 0 && itemRate > 0) {
                    checkItm.settlementCost = compensationQty * itemRate;
                } else {
                    checkItm.settlementCost = 0;
                }
            }//end if of slno check between checkedItemArr element and checked item param element
        });//end of for each loop of checkedItemArr 

        this.compensationQtyItemRateErrorCorrection();
        this.generateTotalCompensationAmount();

        console.log(" itemDetails == ", this.itemDetails);
    }//end of the method 17.09.18

    //file upload event  
    public fileChange(event) {
        let plantType: string = this.localStorageService.user.plantType;
        this.fileData = new FormData();
        this.totalFileSize = 0;
        this.fileList = event.target.files;
        // console.log("this.fileList.length::",this.fileList.length);
        if (this.fileList.length > 0) {
            this.busySpinner = true;
            for (let i: number = 0; i < this.fileList.length; i++) {
                let file: File = this.fileList[i];
                this.fileData.append('uploadFile', file, file.name);
                this.totalFileSize = this.totalFileSize + file.size;
                console.log("this.totalFileSize:::::::::::", this.totalFileSize);
            }//end of for
            if (this.totalFileSize > this.fileSizeLimit) {
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = "File size should be within 100 mb !";
                this.busySpinner = false;
            } else {
                if (this.fileData != undefined) {
                    for (let i: number = 0; i < this.fileList.length; i++) {
                        console.log(" file upload", this.fileData.get('uploadFile'));
                        if (this.fileData.get('uploadFile') != null) {
                            this.formData.append('uploadFile', this.fileData.get('uploadFile'));
                        }
                    }//end of for
                }//end of if fileData is !undefined
                this.formData.append('Accept', 'application/json');
                this.formData.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
                this.formData.append('menuId', 'DEFAULT1');
                this.formData.append('userId', this.localStorageService.user.userId);
                // let formDataObj: any = {};
                // formDataObj = this.formData;
                this.complaintDIService.postFileInTempTable(plantType, this.formData).
                    subscribe(res => {
                        if (res.msgType === 'Info') {
                            this.busySpinner = false;
                            console.log("file uploaded successfully..");
                            this.fileArr.push({ fileAutoId: res.valueAdv, fileName: res.value, fileUrl: res.valueSub });
                            console.log("this.fileArr:: ", this.fileArr);
                            this.fileInputVariable.nativeElement.value = "";//reset file
                            this.formData = new FormData();
                        } else {
                            this.errorMsgObj.errMsgShowFlag = true;
                            this.errorMsgObj.errorMsg = res.msg;
                            this.formData = new FormData();
                            this.busySpinner = false;
                        }
                    }, err => {
                        console.log(err);
                        this.formData = new FormData();
                        this.errorMsgObj.errMsgShowFlag = true;
                        this.errorMsgObj.errorMsg = err.msg;
                        this.busySpinner = false;
                        this.sessionErrorService.routeToLogin(err._body);
                    });
            }
        }//end of if
    }//end of filechange method

    //commercial settlement submit method
    public commercialSettlementDISubmit() {
        this.busySpinner = true;//to load spinner
        let plantType: string = this.localStorageService.user.plantType;
        let commSetHeaderTableJson: any = {};
        commSetHeaderTableJson.complaintReferenceNo = this.commerCialSettlementFromGroup.value.complaintReferenceNo;
        commSetHeaderTableJson.commercialSettlementTotalAmount = this.commerCialSettlementFromGroup.value.totalCompensationAmount? this.commerCialSettlementFromGroup.value.totalCompensationAmount: 0;
        commSetHeaderTableJson.lastActivityId = 40;
        commSetHeaderTableJson.lastStatus = "C";
        commSetHeaderTableJson.userId = this.localStorageService.user.userId;

        let commSettDetailTableJson: any = {};
        commSettDetailTableJson.complaintReferenceNo = this.commerCialSettlementFromGroup.value.complaintReferenceNo;
        let currentDate = this.generateDate();
        commSettDetailTableJson.commercialSettlementDt = currentDate;
        commSettDetailTableJson.activityId = 40;
        commSettDetailTableJson.status = "C";
        commSettDetailTableJson.remarks = this.commerCialSettlementFromGroup.value.remarks;
        commSettDetailTableJson.userId = this.localStorageService.user.userId;

        if (this.localStorageService.user.commSetlmntLevel == 2) {//for cam
            this.commercialSettlementHeaderTableWSCall(commSetHeaderTableJson, commSettDetailTableJson, plantType);
        } else {//for CSO/EVP/FICO
            if (this.localStorageService.user.commSetlmntLevel == 5) {
                commSettDetailTableJson.status = "M";
            }else{
                commSettDetailTableJson.status = this.commerCialSettlementFromGroup.value.compensation;                
            }
            this.commercialSettlementDetailTableWSCall(commSettDetailTableJson, plantType);
        }
    }//end of method

    //method to comm sett header table submit
    commercialSettlementHeaderTableWSCall(commSetHeaderTableJson: any, commSettDetailTableJson: any, plantType: string) {
        this.commercialSettlementDIDataService.putHeader(commSetHeaderTableJson, plantType).
            subscribe(res => {
                if (res.msgType === 'Info') {
                    this.commercialSettlementDetailTableWSCall(commSettDetailTableJson, plantType);
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop spinner
                }
            }, err => {
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner = false;//to stop spinner
            });
    }//end of method

    //method to detail table submit
    commercialSettlementDetailTableWSCall(commSettDetailTableJson: any, plantType: string) {
        this.commercialSettlementDIDataService.postDetail(commSettDetailTableJson, plantType).
            subscribe(res => {
                if (res.msgType === 'Info') {
                    if (this.localStorageService.user.commSetlmntLevel == 2) {//for cam
                        let itemDet: any[] = [];//to store item det
                        this.itemDetails.forEach((el) => {
                            let itemJson: any = {};
                            itemJson.complaintReferenceNo = this.commerCialSettlementFromGroup.value.complaintReferenceNo;
                            itemJson.invoiceNo = el.invoiceNo;
                            itemJson.itemNo = el.itemNo;
                            itemJson.complaintDetailsAutoId = el.complaintDetailsAutoId;
                            itemJson.commercialSettlementAutoId = res.valueSub;
                            itemJson.commercialSettlementQty = el.compensationQty;
                            itemJson.commercialSettlementItemRate = el.itemRate;
                            itemJson.commercialSettlementItemAmount = el.settlementCost;
                            itemJson.userId = this.localStorageService.user.userId;

                            itemDet.push(itemJson);//creating item array
                        });
                        this.itemDetailsSubmit(itemDet, plantType);//calling the method to submit item det
                        this.fileDetailsSubmit(commSettDetailTableJson, res, plantType);
                    } else {
                        this.fileDetailsSubmit(commSettDetailTableJson, res, plantType);
                        this.sendEmailWSCall();
                        this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
                    }
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop spinner
                }
            }, err => {
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner = false;//to stop spinner
            });
    }//end of method

    //method to submit file
    private fileDetailsSubmit(complainDetailJson: any, res: any, plantType: string) {
        if (this.fileArr.length > 0) {
            let fileAutoIdStr: string = '';//taking a var to store files autoId
            this.fileArr.forEach(fileEl => {
                fileAutoIdStr = fileAutoIdStr ? (fileAutoIdStr + ',' + fileEl.fileAutoId) : fileEl.fileAutoId;
            });
            let complaintDetailsAutoId: string;
            for (let itemEl of this.itemDetails) {
                complaintDetailsAutoId = itemEl.complaintDetailsAutoId;
                break;
            };
            let fileJsonBody: any = {};
            fileJsonBody.complaintReferenceNo = complainDetailJson.complaintReferenceNo;
            fileJsonBody.complaintDetailsAutoId = parseInt(complaintDetailsAutoId);
            fileJsonBody.commercialSettlementAutoId = parseInt(res.valueSub);
            fileJsonBody.commSetlementLevel = this.localStorageService.user.commSetlmntLevel;
            fileJsonBody.userId = this.localStorageService.user.userId;
            fileJsonBody.fileAutoIds = fileAutoIdStr;
            this.fileUploadWSCall(plantType, fileJsonBody);//calling the file ws method
        }//end of file array check
    }

    //method to submit item det
    private itemDetailsSubmit(itemDetArr: any[], plantType: string) {
        this.commercialSettlementDIDataService.postItemDetail(itemDetArr, plantType).
            subscribe(res => {
                if (res.msgType == 'Info') {
                    this.sendEmailWSCall();
                    this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
                } else {
                    this.errorMsgObj.errMsgShowFlag = true;
                    this.errorMsgObj.errorMsg = res.msg;
                    this.busySpinner = false;//to stop spinner
                }
            }, err => {
                this.errorMsgObj.errMsgShowFlag = true;
                this.errorMsgObj.errorMsg = err.msg;
                this.busySpinner = false;//to stop spinner
            })
    }//end of method

    //method to send email ws call
    private sendEmailWSCall() {
        let mailJsonBody: any = {};
        mailJsonBody.complaintReferenceNo = this.commerCialSettlementFromGroup.value.complaintReferenceNo;
        mailJsonBody.commercialSettlementDt = this.generateDate();
        if(this.localStorageService.user.commSetlmntLevel == 5){
            mailJsonBody.status = "M";
        }else{
            mailJsonBody.status = this.commerCialSettlementFromGroup.value.compensation ? this.commerCialSettlementFromGroup.value.compensation : 'C';
        }
        mailJsonBody.remarks = this.commerCialSettlementFromGroup.value.remarks;
        mailJsonBody.userId = this.localStorageService.user.userId;
        mailJsonBody.commSetlementLevel = this.localStorageService.user.commSetlmntLevel;
        mailJsonBody.customerCode = this.commerCialSettlementFromGroup.value.customerCode;
        mailJsonBody.customerName = this.commerCialSettlementFromGroup.value.customerName;
        mailJsonBody.salesGroup = this.commerCialSettlementFromGroup.value.salesGroup;
        mailJsonBody.salesOffice = this.commerCialSettlementFromGroup.value.salesOffice;
        mailJsonBody.commercialSettlementTotalAmount = this.commerCialSettlementFromGroup.value.totalCompensationAmount? this.commerCialSettlementFromGroup.value.totalCompensationAmount: 0;
        mailJsonBody.loggedOn = this.datePipe.transform(this.commerCialSettlementFromGroup.value.date, 'MM/dd/yyyy');

        this.commercialSettlementDIDataService.sendEmail(mailJsonBody).subscribe(res => {
        }, err => {
        });
    }//end of method

    public onCancel() {
        this.router.navigate([ROUTE_PATHS.RouteComplainDIView]);
    }//end of method

    //method to delete err msg
    public deleteResErrorMsgOnClick() {
        this.errorMsgObj.errMsgShowFlag = false;
        this.errorMsgObj.errorMsg = '';
    }

}//end of class