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
export class AllocateComplaintDIDataService {

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
    getAllocateComplaintDIViewDetails(compParaJson: any, viewEditParam: string) {
        let viewEditVar: string = viewEditParam;
        this.actionUrl = AppUrlsConst.COMPLAINT_REFERENCE_DET_HEADER_VIEW_URL;
        this.headers = this.configService();     

        

        // return this.http.get(this.actionUrl, { headers: this.headers })
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

    getAlertMethod(viewEditParam: string){
        this.headers = this.configService();
        if (viewEditParam == 'Alert') {
            let actionUrlForAllocateReadUrl: string = AppUrlsConst.ALLOCATE_COMPLAINT_READ_UPATE_URL;
            let alertJson: any = {};
            alertJson.employeeId = this.localStorageService.user.employeeId ;
            console.log(" this.headers of getAlertMethod......... ",this.headers);
            return this.http.patch(actionUrlForAllocateReadUrl, alertJson, { headers: this.headers })
                .map(this.successCallback)
                .catch(this.errorCallBack);
        }//end of if
    }

    //method to get complain reference details view
    getComplaintReferenceDetailsView(complaintReferenceNo: string, fileActivityId: number) {
        let fileActivityIdStr: string = fileActivityId.toString();
        this.actionUrl = AppUrlsConst.DI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL + "/" + complaintReferenceNo + "/" + fileActivityIdStr;
        this.headers = this.configService();

        return this.http.get(this.actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of get getComplaintReferenceDetailsView


    //logged by service call
    getSelectValSiteVisitBy(departmentNameParam: string) {
        let departmentName: string = departmentNameParam;
        let actionUrl = AppUrlsConst.SITE_VISIT_BY_DEPARTMENT + "/" + departmentNameParam;
        this.headers = this.configService();

        return this.http.get(actionUrl, { headers: this.headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of site visit by

    //method for Allocate Complaint Modify data submit
    allocateComplaintSubmitDetails(allocateComplaintDetails: any) {
        this.actionUrl = AppUrlsConst.MODIFY_ALLOCATE_COMPLAINT_SUBMIT_URL;
        this.headers = this.configService();
        return this.http.patch(this.actionUrl, allocateComplaintDetails, { headers: this.headers })
            .map(this.successAllocateComplaintCallback)
            .catch(this.errorAllocateComplaintCallBack);
    }//end of method

    private successAllocateComplaintCallback(res: Response) {
        return res.json();
    }

    private errorAllocateComplaintCallBack(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }







}//end of class

