import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../../app-config';
import { LocalStorageService } from "../../../shared/services/local-storage.service";

@Injectable()
export class ComplaintPIRegisterDataService {

  private actionUrl: string;
  private headers: Headers;

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService) {

  }

  private configService(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken);
    headers.append('userId', this.localStorageService.user.userId);
    headers.append('menuId', 'DEFAULT1');
    return headers;
  }
 

  getSelectValReceiptMode() {
    let actionUrl = AppUrlsConst.CMP_REG_RCPT_MODE_SELECT_VAL;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  // mehtod for getting SeverityIndexRatings
  getSelectValSeverityIndexRatings() {
    let actionUrl = AppUrlsConst.CMP_PI_REG_SEVERITY_INDEX_RATINGS_VAL;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }// end of the mehtod for getting SeverityIndexRatings


  getSelectValLoggedBy() {
    let actionUrl = AppUrlsConst.CMP_REG_LOGGED_BY_SELECT_VAL + "/" + "PI";
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectComplaintType() {
    let actionUrl = AppUrlsConst.CMP_PI_REG_COMPLAINT_TYPE_USER_URL;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectValNatureOfComplaint(complaintTypeId: string) {
    let actionUrl = AppUrlsConst.CMP_REG_NATURE_OF_COMPLAINT_URL + complaintTypeId;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  //method for getting all the invoice details and passing invoice no as parameter
  getInvoiceDetails(invoiceNo: string) {
    let actionUrl = AppUrlsConst.CMP_PI_REG_INVOICE_NO_URL + invoiceNo;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of getInvoiceDetails method

  //for complaint submit pi
  complainSubmit(formData: any) {
    this.actionUrl = AppUrlsConst.CMP_PI_REG_SUBMIT_URL;
    return this.http.post(this.actionUrl, formData)
    .map(this.successCallback)
    .catch(this.errorCallBack); 
  }//for complaint submit pi

  //method complaint pi update 
  complaintUpdate(formData: any) {
    this.actionUrl = AppUrlsConst.CMP_PI_REG_UPDATE_URL;
    return this.http.patch(this.actionUrl, formData)
    .map(this.successCallback)
    .catch(this.errorCallBack); 
  }//method complaint pi update 


  private successCallback(res: Response) {
    console.log("complaint pi success : " , res);
    return res.json();
  }

  private errorCallBack(error: Response) {
    console.error("complaint pi error : " , error);
    return Observable.throw(error);
  }

  //method to get complain reference details view
  getComplaintReferenceDetailsView(complaintReferenceNo: string) {
    this.actionUrl = AppUrlsConst.PI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL + "/" + complaintReferenceNo;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get getComplaintReferenceDetailsView

  //method to get complain reference details 
    getComplaintReferenceDetails(complaintReferenceNo: string,fileActivityId: number){
      let fileActivityIdStr: string = fileActivityId.toString();
        this.actionUrl = AppUrlsConst.PI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL + "/" + complaintReferenceNo + "/" + fileActivityIdStr;
        this.headers = this.configService();

        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of get getComplaintReferenceDetails

  // mehtod for getting ComplainReceivedBy
  getSelectValComplainReceivedBy() {
    let actionUrl = AppUrlsConst.CMP_REG_COMP_RECEIVED_BY_VAL;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getCustomerDet(customerName: string){
    // this.actionUrl 
    let actnUrl = AppUrlsConst.DI_PI_COMPLAINT_CUSTDET_URL;
    this.headers = this.configService();
    let user : any = {};
    user.customerName = customerName;
    user.plantType = this.localStorageService.user.plantType;
    console.log(" user======>",user);
    return this.http.post(actnUrl, user, { headers: this.headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }

  getCustomerInvDet(custCode: string){
    let actnUrl = AppUrlsConst.DI_PI_COMPLAINT_CUSTCODE_URL;
    this.headers = this.configService();
    let user : any = {};
    user.customerCode = custCode;
    user.plantType = this.localStorageService.user.plantType;
    user.invoiceNo = "";
    user.itemCode = "";
    console.log(" user======>",user);
    return this.http.post(actnUrl, user, { headers: this.headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }



}
