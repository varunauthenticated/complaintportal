export class UserModel {
  private _userId: string;
  private _userDisplayName: string;
  private _accessToken: string;
  private _employeeId: string;
  private _roleId: string;
  private _roleName: string;
  private _plantType: string;
  //new add for both plant type
  private _plantTypeForBoth: string;
  //new add for from date n to date
  private _fromDate: string;
  private _toDate: string;
  private _commSetlmntLevel: number;

  get plantTypeForBoth(): string {
    return this._plantTypeForBoth;
  }
  set plantTypeForBoth(plantTypeForBoth: string) {
    this._plantTypeForBoth = plantTypeForBoth;
  }
  get userId(): string {
    return this._userId;
  }
  set userId(userId: string) {
    this._userId = userId;
  }

  get userDisplayName(): string {
    return this._userDisplayName;
  }
  set userDisplayName(userDisplayName: string) {
    this._userDisplayName = userDisplayName;
  }

  get accessToken(): string {
    return this._accessToken;
  }
  set accessToken(accessToken: string) {
    this._accessToken = accessToken;
  }

  get employeeId(): string {
    return this._employeeId;
  }
  set employeeId(employeeId: string) {
    this._employeeId = employeeId;
  }

  get roleId(): string {
    return this._roleId;
  }
  set roleId(roleId: string) {
    this._roleId = roleId;
  }

  get roleName(): string {
    return this._roleName;
  }
  set roleName(roleName: string) {
    this._roleName = roleName;
  }

  get plantType(): string {
    return this._plantType;
  }
  set plantType(plantType: string){
    this._plantType = plantType;
  }

  get fromDate():string {
    return this._fromDate;
  }
  set fromDate(fromDate:string) {
    this._fromDate = fromDate;
  }

  get toDate():string {
    return this._toDate;
  }
  set toDate(toDate:string) {
    this._toDate = toDate;
  }

  get commSetlmntLevel(): number {
    return this._commSetlmntLevel;
  }
  set commSetlmntLevel(commSetlmntLevel:number){
    this._commSetlmntLevel = commSetlmntLevel;
  }
  
}//end of class
