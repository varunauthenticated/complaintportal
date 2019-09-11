import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppUrlsConst, WebServiceConst } from '../../../app-config';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Injectable()
export class CommercialSettlementDIDataService {
    constructor(
        private http: Http,
        private localStorageService: LocalStorageService
    ) {
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
* @param complainHeader set data to update
*/
    public putHeader(complainHeader: any, plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_HEADER_TABLE_ADD_URL
            + "/" + plantType;

        return this.http.put(actionUrl, complainHeader, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of method

    /**
   * 
   * @param complainDetail set post data
   */
    public postDetail(complainDetail: any, plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_DETAIL_TABLE_ADD_URL
            + "/" + plantType;

        return this.http.post(actionUrl, complainDetail, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of method

    /**
  * 
  * @param itemDetail set post data
  */
    public postItemDetail(itemDetail: any, plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_ITEM__DETAIL_TABLE_ADD_URL
            + "/" + plantType;

        return this.http.post(actionUrl, itemDetail, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of method

    /**
 * 
 * @param plantType 
 */
    //start method of postFile to upolad a file
    public postFile(plantType: string, fileDet: any) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_FILE_UPLOAD_URL + "di";
        let param = "plantType=" + plantType;
        return this.http.post(actionUrl + '?' + param, fileDet, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end method of postFile

    /**
 * 
 * @param emailObj send email
 */
    public sendEmail(emailObj: any) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_SEND_EMAIL_URL + "di";

        return this.http.post(actionUrl, emailObj, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }

    //view comm sett ws
    //method to comm-sett header ws call
    getCommercialSettlementHeaderDetails(complaintReferenceNo: string, plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_VIEW_HEADER;
        let param = "plantType=" + plantType + "&filter="
            + this.localStorageService.appSettings.complaintReferenceNoFieldName + "='" + complaintReferenceNo + "'";
        return this.http.get(actionUrl + '?' + param, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of get header ws call

    //method to get commercial settlement details view
    getCommercialSettlementViewDetails(complaintReferenceNo: string, activityId: number, plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_VIEW_DETAILS;
        let param = "plantType=" + plantType + "&filter="
            + this.localStorageService.appSettings.complaintReferenceNoFieldName + "='" + complaintReferenceNo + "'";

        return this.http.get(actionUrl + '?' + param, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of get getCommercialSettlementViewDetails

    //method to get inv item det
    public getInvoiceItemDetail(compRefNo: string, plantType: string) {//activityId: number, complaintDetailsAutoId: number,
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_VIEW_INVOICE_ITEM;
        let param = "plantType=" + plantType + "&filter=" + this.localStorageService.appSettings.complaintReferenceNoFieldName + "='" + compRefNo + "'";

        return this.http.get((actionUrl + '?' + param), { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end of method

    // start method of viewFile to view a file
    public viewFile(complaintReferenceNo: string,complaintDetailsAutoId: number,plantType: string) {
        let headers: Headers = this.configService();
        let actionUrl = AppUrlsConst.COMMERCIAL_SETTLEMENT_VIEW_FILE;
        let param = "plantType=" + plantType + "&filter=" + this.localStorageService.appSettings.complaintReferenceNoFieldName + "='" + complaintReferenceNo + "' AND " +
            this.localStorageService.appSettings.complaintDetailsAutoIdFieldName + "=" + complaintDetailsAutoId +
            "&sortData=&orderBy=";
        return this.http.get(actionUrl + '?' + param, { headers: headers })
            .map((res: Response) => { return res.json() })
            .catch((error: Response) => { return Observable.throw(error) });
    }//end method of viewFile
}