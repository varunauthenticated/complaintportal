import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../../app-config';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ActivityTrackingDIParamModel } from '../models/activity-tracking-di-param.model';
import { ComplaintDIHeaderParamModel } from '../../../shared/models/complaint-di-header-param.model';

@Injectable()
export class ActivityTrackingDIService {

  constructor(
    private http: Http,
    private localStorageService: LocalStorageService) {

  }

  private configService(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('accessToken', 'bearer '+ this.localStorageService.user.accessToken);
    headers.append('userId', this.localStorageService.user.userId);
    headers.append('menuId', 'DEFAULT1');
    
    return headers;
  }

  /**
   * 
   * @param complainHeaderParam 
   */
  public getComStatusDet(complainHeaderParam: ComplaintDIHeaderParamModel){//activityTrackingDIParam: ActivityTrackingDIParamModel){
    let headers: Headers = this.configService();
    let actionUrl = AppUrlsConst.VIEW_COMP_STATUS_WITH_COM_SET_URL;// + '?plantType=DI&pageNo=0&perPage=0'; //+ this.localStorageService.user.plantType;

    let param: string = '';
    param += complainHeaderParam && complainHeaderParam.filter ? "filter="+complainHeaderParam.filter+"&" : "filter=&";
    param += complainHeaderParam && complainHeaderParam.perPage ? "perPage="+complainHeaderParam.perPage+"&" : "perPage=&";
    param += complainHeaderParam && complainHeaderParam.pageNo ? "pageNo="+complainHeaderParam.pageNo+"" : "pageNo=";

    return this.http.get((actionUrl+'?'+param), { headers: headers })
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


}