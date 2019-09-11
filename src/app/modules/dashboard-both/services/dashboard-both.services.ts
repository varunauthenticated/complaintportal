import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../app-config';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable()
export class DashboardBothService {
    private actionUrl: string;
    private headers: Headers;

    constructor(
        private http: Http,
        private localStorageService: LocalStorageService) {        
    }

    private configService(): Headers {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json'),
        headers.append('accept', 'application/json'),
        headers.append('accessToken', 'bearer ' + this.localStorageService.user.accessToken),
        headers.append('userId', this.localStorageService.user.userId),
        headers.append('menuId', 'DEFAULT1')
    return headers;
    }
    
    getLoginDetailsByPlantType(plantType: string) {
       this.headers =  this.configService();
        
        // console.log("headers of dashboard-both...",this.headers);
    this.actionUrl = AppUrlsConst.CHANGE_PLANT_TYPE_URL + "/" + plantType;
    let urlBody: any = {};
    return this.http.post(this.actionUrl,urlBody,{ headers: this.headers })
        .map(this.successCallback)
        .catch(this.errorCallBack);
    }
    private successCallback(res: Response) {
        console.log("getLoginDetailsByPlantType res...",res);
        return res.json();
    }
    private errorCallBack(error: Response) {
        console.error("getLoginDetailsByPlantType error...",error);
        return Observable.throw(error);
    }
}
