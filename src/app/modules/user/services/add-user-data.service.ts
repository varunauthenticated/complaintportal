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
export class AddUserDataService {

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

  getSelectValDesignationDet() {
    this.actionUrl = AppUrlsConst.ADD_USER_DESIGNATION_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectValDepartmentDet() {
    this.actionUrl = AppUrlsConst.ADD_USER_DEPARTMENT_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectValPlantTypeDet() {
    this.actionUrl = AppUrlsConst.ADD_USER_PLANT_TYPE_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectValRoleName() {
    this.actionUrl = AppUrlsConst.ADD_USER_ROLE_NAME_VAL;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  getSelectValLocation() {
    this.actionUrl = AppUrlsConst.ADD_USER_LOCATION_VAL
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) });
  }

  //method for get user view details by web service
  getUserViewDetails() {
    this.actionUrl = AppUrlsConst.VIEW_USER_URL;
    this.headers = this.configService();
    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) })
  }//end of method getUserViewDetails

  authenticate(user: any) {
    this.actionUrl = AppUrlsConst.ADD_USER_CREATE_URL;
    this.headers = this.configService();
    return this.http.post(this.actionUrl, user, { headers: this.headers })
      .map(this.successCallback)
      .catch(this.errorCallBack);
  }//end of authenticate method

  private successCallback(res: Response) {
    return res.json();
  }//end of successCallBack

  private errorCallBack(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }//end of errorCallBack

  //create a method for get user details by userId
  getUserDetailsByUserId(userId: string) {
    //checking userId is null or not
    // if(userId == null){
    // }
    this.actionUrl = AppUrlsConst.VIEW_USER_URL + "/" + userId;
    this.headers = this.configService();

    return this.http.get(this.actionUrl, { headers: this.headers })
      .map((res: Response) => { return res.json() })
      .catch((error: Response) => { return Observable.throw(error) })
  }//end of getUserDetailsByUserId method

  //create a method to submit user modify details
  userModifyDetailsSubmit(userModifyDetails: any) {
    this.actionUrl = AppUrlsConst.MODIFY_USER_SUBMIT_URL;
    this.headers = this.configService();
    return this.http.patch(this.actionUrl, userModifyDetails, { headers: this.headers })
      .map(this.successCallbackForModifyUser)
      .catch(this.errorCallBackForModifyUser);
  }//end of userModifyDetailsSubmit method

  private successCallbackForModifyUser(res: Response) {
    return res.json();
  }//end of successCallbackForModifyUser

  private errorCallBackForModifyUser(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }//end of errorCallBackForModifyUser

}//end of class
