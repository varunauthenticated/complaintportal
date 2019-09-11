import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from "../../shared/services/local-storage.service";

@Injectable()
export class InvestigationReportDIDataService {

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


  getStencilVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_STENCIL_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get stencil val

  getSocketVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_SOCKET_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get socket val

  getSpigotVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_SPIGOT_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get spigot val

  getSurfaceOuterVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_SURFACE_OUTER_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get surface outer val

  getCoatingBitVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_COATING_BIT_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get Coating Bit val

  getInnerCMLVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_INNER_CML_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get Inner CML val

  getLubricationVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_LUBRICATION_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get lubrication val

  getFittingsJointingVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_FITTINGS_JOINTING_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get fittings jointing val

  getLoadingRelatedVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_LOADING_RELATED_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get loading related val

  getPipeLayingVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_PIPE_LAYING_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get pipe laying val

  //method to get dia val
  getDiaVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_DIA_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get Dia val

  //method to get classification val
  getClassificationVal() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_CLASSIFICATION_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get classification val

  //method to get employee details for area sales manager dropdown
  getAreaSalesManagerDetailsVal(areaSalesOrZonalManagerDesignationId: string) {
    this.actionUrl = AppUrlsConst.EMPLOYEE_DET_BY_DESIGNATION_ID + "/" + areaSalesOrZonalManagerDesignationId;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of getAreaSalesManagerDetailsVal method

  // PRELI_INVESTIGATION_COMPLAINT_REF_NO_VAL
  getCompRefNoValForPreliInvestigationReport() {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_COMPLAINT_REF_NO_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of getCompRefNoValForPreliInvestigationReport

  //method to get complain reference details view
  getComplaintReferenceDetailsView(complaintReferenceNo: string, fileActivityId: number) {
    let fileActivityIdStr: string = fileActivityId.toString();
    let actionUrl = AppUrlsConst.DI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL + "/" + complaintReferenceNo + "/" + fileActivityIdStr;
    this.headers = this.configService();

    return this.http.get(actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of get getComplaintReferenceDetailsView

  //for submit preli
  submitService(formData: any) {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_REPORT_DI_ADD_SUBMIT_URL;
    return this.http.post(this.actionUrl, formData)
      .map(this.successCallbackForPreliAdd)
      .catch(this.errorCallBackForPreliAdd);
  }//end of submit preli
  private successCallbackForPreliAdd(res: Response) {
    console.log("preli success : ", res);
    return res.json();
  }
  private errorCallBackForPreliAdd(error: Response) {
    console.error("prelin error : ", error);
    return Observable.throw(error);
  }

  //for submit preli edit
  preliModifyReportSubmit(formData: any) {
    this.actionUrl = AppUrlsConst.MODIFY_PRELI_INVESTIGATION_REPORT_DI_SUBMIT_URL;
    return this.http.put(this.actionUrl, formData)
      .map(this.successCallbackForPreliModify)
      .catch(this.errorCallBackForPreliModify);
  }//end of submit preli edit
  private successCallbackForPreliModify(res: Response) {
    console.log("preli edit success res in service class: ", res);
    return res.json();
  }
  private errorCallBackForPreliModify(error: Response) {
    console.error("prelin edit error in service class : ", error);
    return Observable.throw(error);
  }

  public getSelectComplaintType() {
    let actionUrl = AppUrlsConst.CMP_REG_COMPLAINT_TYPE_USER_URL;
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

  //get comp ref no list for preli investigation report

  //method to get preli view details for edit/update
  public getPreliViewDetForUpdate(complaintRefNo: string) {
    this.actionUrl = AppUrlsConst.PRELI_INVESTIGATION_REPORT_DI_VIEW_BY_COPLAINT_REFERENCE_NO + "/" + complaintRefNo;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }//end of method to getPreliViewDetForUpdate 

  //get item by customer
  getCustomerInvDet(custCode: string){
    let actnUrl = AppUrlsConst.DI_PI_COMPLAINT_CUSTCODE_URL;
    this.headers = this.configService();
    let user : any = {};
    user.customerCode = custCode;
    user.plantType = this.localStorageService.user.plantType;
    user.invoiceNo = '';
    user.itemCode = '';
    console.log(' user======>',user);
    return this.http.post(actnUrl, user, { headers: this.headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }//end of method


}//end of class