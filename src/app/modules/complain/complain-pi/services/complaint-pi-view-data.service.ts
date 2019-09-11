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
export class ViewComplaintPIDataService {

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


    //method for get Complaint view details by web service
    getComplaintViewDetails(compParaJson: any) {
        this.actionUrl = AppUrlsConst.COMPLAINT_REFERENCE_DET_HEADER_VIEW_URL;
        this.headers = this.configService();

        // return this.http.get(this.actionUrl, { headers: this.headers })
        return this.http.post(this.actionUrl,compParaJson, { headers: this.headers })
            .map(this.successCallback)
            .catch(this.errorCallBack);
        }//end of method getComplaintViewDetails

    private successCallback(res: Response) {
        return res.json();
    }

    private errorCallBack(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }


    // mehtod for getting faceted data 
    getfacetedData(jsonBody: any) {
        this.actionUrl = AppUrlsConst.FACETED_DATA_URL_FOR_DI_PI;
        this.headers = this.configService();

        return this.http.post(this.actionUrl,jsonBody, { headers: this.headers })
            .map(this.successCallbackForFaceted)
            .catch(this.errorCallBackForFaceted);
        
    } //mehtod for getting faceted data 
    private successCallbackForFaceted(res: Response) {
        return res.json();
    }

    private errorCallBackForFaceted(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }




}//end of class

