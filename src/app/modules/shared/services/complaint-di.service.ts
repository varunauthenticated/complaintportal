import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
//import { AppUrlsConst, WebServiceConst };
//import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from './local-storage.service';
import { ComplaintDIHeaderParamModel } from '../models/complaint-di-header-param.model';

@Injectable()
export class ComplaintDIService {

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
/**
 * 
 * @param complainHeader set data to post header
 */
  public postHeader(complainHeader: any) {
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.COMPLAIN_HEADER_TABLE_ADD_URL;

    return this.http.post(actionUrl, complainHeader, { headers: headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }
  /**
   * 
   * @param complainHeader 
   */
  public getHeader(complainHeaderParam: ComplaintDIHeaderParamModel){
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.COMPLAIN_VIEW_HEADER_URL;


    let param: string = '';
    param += complainHeaderParam && complainHeaderParam.fields ? "fields="+complainHeaderParam.fields+"&" : "fields=&";
    param += complainHeaderParam && complainHeaderParam.filter ? "filter="+complainHeaderParam.filter+"&" : "filter=&";
    param += complainHeaderParam && complainHeaderParam.sortData ? "sortData="+complainHeaderParam.sortData+"&" : "sortData=&";
    param += complainHeaderParam && complainHeaderParam.orderBy ? "orderBy="+complainHeaderParam.orderBy+"&" : "orderBy=&";
    param += complainHeaderParam && complainHeaderParam.perPage ? "perPage="+complainHeaderParam.perPage+"&" : "perPage=&";
    param += complainHeaderParam && complainHeaderParam.pageNo ? "pageNo="+complainHeaderParam.pageNo+"" : "pageNo=";
        
    

    console.log(param);

    return this.http.get((actionUrl+'?'+param), { headers: headers })
    .map((res: Response) => { return res.json() })
    .catch((error: Response) => { return Observable.throw(error) });

  }
/**
 * 
 * @param complainHeader set data to update
 */
  public putHeader(complainHeader:any, plantType: string, action: string) {
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.COMPLAIN_HEADER_TABLE_ADD_URL
    +"?plantType="+plantType+"&action="+action;

    return this.http.put(actionUrl, complainHeader, { headers: headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }
/**
 * 
 * @param complainDetail set post data
 */
  public postDetail(complainDetail: any, plantType: string, action: string) {
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.COMPLAIN_DETAIL_TABLE_ADD_URL
    +"?plantType="+plantType+"&action="+action;

    return this.http.post(actionUrl, complainDetail, { headers: headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
  }

  /**
   * 
   * @param activityIdFieldName 
   */
  public getInvoiceItemDetail(compRefNo: string, activityId: number, complaintDetailsAutoId: number){
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.COMPLAIN_INVOICE_ITEM_DETAIL_VIEW_URL;
    let param = "filter="+this.localStorageService.appSettings.complaintReferenceNoFieldName+"='"+compRefNo+"' AND "
    +this.localStorageService.appSettings.activityIdFieldName+"="+activityId+" AND "
    +this.localStorageService.appSettings.complaintDetailsAutoIdFieldName+"="+complaintDetailsAutoId+
    "&sortData=&orderBy=";

    return this.http.get((actionUrl+'?'+param), { headers: headers })
    .map((res: Response) => { return res.json() })
    .catch((error: Response) => { return Observable.throw(error) });

  }

  /**
 * 
 * @param items 
 */
public postInvoiceItemDetail(items: any,plantType: string,action:string) {
  let headers: Headers = this.configService();
  let actionName: string = action? action : '';
  let actionUrl = AppUrlsConst.COMPLAIN_INVOICE_ITEM_DETAIL_ADD_URL
  +"?plantType="+plantType+"&action="+action;
  return this.http.post(actionUrl, items, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}

 /**
 * 
 * @param plantType 
 */
//method to delete item
public deleteInvoiceItemDetail(plantType: string,complaintReferenceNo: string,complaintDetailsAutoId: number,activityId: number) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAIN_INVOICE_ITEM_DETAIL_ADD_URL;
  let param = "plantType="+plantType+"&complaintReferenceNo="+complaintReferenceNo+"&complaintDetailsAutoId="+complaintDetailsAutoId
  +"&activityId="+activityId;
  return this.http.delete(actionUrl+'?'+param, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}//end of the method of deleteInvoiceItemDetail

//method to get complain reference details view
getComplainViewDetails(complaintReferenceNo: string, activityIdFieldName: number) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAIN_VIEW_DETAIL_URL;
    let param = "filter="+this.localStorageService.appSettings.complaintReferenceNoFieldName+"='"+complaintReferenceNo+"' AND "+
    this.localStorageService.appSettings.activityIdFieldName+"="+activityIdFieldName+"&sortData=&orderBy=";

  return this.http.get(actionUrl+'?'+param, { headers: headers })
    .map((res: Response) => { return res.json() })
    .catch((error: Response) => { return Observable.throw(error) });
}//end of get getComplaintReferenceDetailsView

/**
 * 
 * @param plantType 
 */
//method to delete item
public deleteFile(plantType: string,files: any) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAIN_FILE_DELETE_URL;
  let param = "plantType="+plantType;
  return this.http.put(actionUrl+'?'+param,files, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}//end of the method of deleteInvoiceItemDetail


/**
 * 
 * @param plantType 
 */
//start method of postFileInTempTable to upolad a file in temp table
public postFileInTempTable(plantType: string,formDataBody: any){
  let actionUrl = AppUrlsConst.COMPLAIN_FILE_UPLOAD_TEMP_TABLE_URL;
  let param = "plantType="+plantType;
  return this.http.post(actionUrl+'?'+param,formDataBody)
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}//end method of postFile in temp table

/**
 * 
 * @param plantType 
 */
//start method of postFile to upolad a file
public postFile(plantType: string,fileDet: any){
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAIN_FILE_UPLOAD_URL;
  let param = "plantType="+plantType;
  return this.http.post(actionUrl+'?'+param,fileDet,{ headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}//end method of postFile



// start method of viewFile to view a file
public viewFile(complaintReferenceNo:string, activityId: number, complaintDetailsAutoId: number){
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAIN_FILE_VIEW_URL;
  let param = "filter="+this.localStorageService.appSettings.complaintReferenceNoFieldName+"='"+complaintReferenceNo+"' AND "+
  this.localStorageService.appSettings.activityIdFieldName+"="+activityId+" AND "+
  this.localStorageService.appSettings.complaintDetailsAutoIdFieldName+"="+complaintDetailsAutoId+
  "&sortData=&orderBy=";
  return this.http.get(actionUrl+'?'+param, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}//end method of viewFile


public getHeadercount(complainHeaderParam: ComplaintDIHeaderParamModel,planType:any){
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.COMPLAINT_HEADER_DATA_COUNT;

  let param: string = '';
  param+="plantType="+planType+"&";
  param += complainHeaderParam && complainHeaderParam.filter ? "filter="+complainHeaderParam.filter : "filter=";
  
  console.log(param);

  return this.http.get((actionUrl+'?'+param), { headers: headers })
  .map((res: Response) => { return res.json() })
  .catch((error: Response) => { return Observable.throw(error) });
}

/**
 * 
 * @param emailObj send email
 */
public sendEmail(emailObj:any, plantType: string, action: string) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.SEND_EMAIL_URL
  +"?plantType="+plantType+"&action="+action;

  return this.http.post(actionUrl, emailObj, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}

/**
 * 
 * @param jsonBody set data to update
 */
public updateDashboardDate(jsonBody:any) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.DASHBOARD_DATE_UPDATE_URL;

  return this.http.put(actionUrl, jsonBody, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}

//update com set by switch btn
public updateComSetFromCompStatusGrid(jsonBody:any) {
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.UPDATE_COM_SET_FROM_COMP_STATUS_GRID_URL;
 
  return this.http.put(actionUrl, jsonBody, { headers: headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
}

//chart ws call
getChartData(chartType: string, plantType: string,period: string,filterData:string){
  let headers: Headers = this.configService();
  let actionUrl = AppUrlsConst.CHART_DATA_VIEW_URL + '/' + chartType;
  //[from 01-Jan-2018 to 25-Mar-2019]
  let param = 'period='+period
  +'&plantType='+plantType+
  '&filter='+filterData;//CMPLNT_LOGD_ON_ACTUAL%20BETWEEN%20CONVERT(datetime,%2701/01/2018%2000:00:00%27,103)%20AND%20CONVERT(datetime,%2725/03/2019%2023:59:59%27,103)

  return this.http.get(actionUrl + '?' + param,{headers: headers})
  .map((res:Response)=>{
    return res.json()
  })
  .catch((error:Response)=>{
    return Observable.throw(error)
  });

}

  

}