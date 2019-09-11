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
export class ViewUserDataService {

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


    //method for get user view details by web service
    getUserViewDetails(sortData?: string, orderType?: string) {
        if (sortData == null) {
            sortData = "";
        }

        if (orderType == undefined) {
            orderType = "";
        }

        if (orderType == null) {
            orderType = "";
        }

        if (sortData.trim() != "" && orderType.trim() != "") {
            this.actionUrl = AppUrlsConst.VIEW_USER_URL + "/" + sortData + "/" + orderType;
        }
        else {
            this.actionUrl = AppUrlsConst.VIEW_USER_URL;
        }

        this.headers = this.configService();

        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) })
    }//end of method getUserViewDetails

   


    //user deletion method
    deactivateEmployee(userIdForDeactivate: string[]){

        this.actionUrl = AppUrlsConst.DEACTIVATE_USER_URL; 
        let employeesForDeactivate: any = {};
        employeesForDeactivate.employees = userIdForDeactivate;
        
        this.headers = this.configService();

        return this.http.patch(this.actionUrl, employeesForDeactivate , { headers: this.headers })
           .map(this.successCallback)
            .catch(this.errorCallBack);
        }//end of delete user method

        private successCallback(res: Response) {
            return res.json();
        }

        private errorCallBack(error: Response) {
            console.error(error);
            return Observable.throw(error);
        }

         //user deletion method
    activateEmployee(userIdForActivate: string[]){
        
        this.actionUrl = AppUrlsConst.ACTIVATE_USER_URL; 
        let employeesForActivate: any = {};
        employeesForActivate.employees = userIdForActivate;
        
        this.headers = this.configService();

        return this.http.patch(this.actionUrl, employeesForActivate , { headers: this.headers })
            .map(this.successCallback)
            .catch(this.errorCallBack);
        }//end of delete user method

}//end of class

