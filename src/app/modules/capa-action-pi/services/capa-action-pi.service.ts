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
export class CAPAActionPIService {

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
    getcomplaintViewDetails(compParaJson: any) {
        this.actionUrl = AppUrlsConst.COMPLAINT_REFERENCE_DET_HEADER_VIEW_URL;
        this.headers = this.configService();
        return this.http.post(this.actionUrl, compParaJson, { headers: this.headers })
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

    //method to get complain reference details view
    getComplaintReferenceDetailsView(complaintReferenceNo: string,fileActivityId: number) {
        let fileActivityIdStr : string = fileActivityId.toString();
    // complaintReferenceNo = "DIKG1718H290001";
    this.actionUrl = AppUrlsConst.PI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL + "/" + complaintReferenceNo + "/" + fileActivityIdStr;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
        .map((res: Response) => { return res.json() })
        .catch((error: Response) => { return Observable.throw(error) });
    }//end of get getComplaintReferenceDetailsView


    //method to capasubmit with file upload
    capasubmitWithFileUpload(capaFormData: any) {        
        this.actionUrl = AppUrlsConst.DI_PI_CAPA_ACTION_UPLOAD_URL;        
        return this.http.patch(this.actionUrl, capaFormData)
            .map(this.successCallbackForFileUpload)
            .catch(this.errorCallBackForFileUpload);
    }//end of method capasubmit with file upload

    private successCallbackForFileUpload(res: Response) {
        console.error("success of capa submit with file upload in service class", res);
        return res.json();
    }
    private errorCallBackForFileUpload(error: Response) {
        console.error("error of capa submit with file upload in service class", error);
        return Observable.throw(error);
    }

}//end of class

