export class AppSettingsModel{
  private _authExpireInSec: number;
  private _companyId: string;
  private _diffBetwnCmplntRefDtAndLoggedOnDt: number;
  private _loginUserPassMaxLength: number;
  private _loginUserPassMinLength: number;
  private _rolePrefix: string;
  private _areaSalesOrZonalManagerDesignationId: string;
  private _complaintRegistrationActivityId: number;
  private _preliminaryInvestigationActivityId: number;
  private _closeComplaintActivityId: number;
  private _pendingComplaintActivityId: number;
  private _activityIdFieldName: string;
  private _lastActivityIdFieldName: string;
  private _complaintDetailsAutoIdFieldName: string;
  private _resolutionOfComplaintsAtCustomerPlaceActivityId: number;
  private _analyseCustomerComplaintsAndActionPlanActivityId: number;
  private _changeInQapOrwiOrisoProceedureActivityId: number;
  private _menuDetails:any;
  private _complaintReferenceNoFieldName: string;
  private _validComplaintFieldName: string;
  private _complaintLoggedByFieldName: string;
  private _complaintReceivedByOther: string;
  private _siteVisitActivityId: number;
  private _defaultActivityId: number;
  private _notificationInMilliSecond: number;
  private _siteVisitByFieldName: string;
  private _siteVisitRequiredFieldName: string;
  private _allocationOfComplaintReadFieldName: string;

  get defaultActivityId(): number{
    return this._defaultActivityId;
  }
  set defaultActivityId(defaultActivityId: number){
    this._defaultActivityId = defaultActivityId;
  }
  
  get siteVisitActivityId(): number { 
    return this._siteVisitActivityId;
  }
  set siteVisitActivityId(siteVisitActivityId: number){
    this._siteVisitActivityId = siteVisitActivityId;
  }
  
  get complaintReceivedByOther():string{
    return this._complaintReceivedByOther;
  }

  set complaintReceivedByOther(complaintReceivedByOther:string){
    this._complaintReceivedByOther = complaintReceivedByOther;
  }
  get resolutionOfComplaintsAtCustomerPlaceActivityId(): number{
    return this._resolutionOfComplaintsAtCustomerPlaceActivityId;
  }
  set resolutionOfComplaintsAtCustomerPlaceActivityId(resolutionOfComplaintsAtCustomerPlaceActivityId: number){
    this._resolutionOfComplaintsAtCustomerPlaceActivityId = resolutionOfComplaintsAtCustomerPlaceActivityId;
  }

  get analyseCustomerComplaintsAndActionPlanActivityId(): number{
    return this._analyseCustomerComplaintsAndActionPlanActivityId;
  }
  set analyseCustomerComplaintsAndActionPlanActivityId(analyseCustomerComplaintsAndActionPlanActivityId: number) {
    this._analyseCustomerComplaintsAndActionPlanActivityId = analyseCustomerComplaintsAndActionPlanActivityId;
  }

  get changeInQapOrwiOrisoProceedureActivityId(): number{
    return this._changeInQapOrwiOrisoProceedureActivityId;
  }
  set changeInQapOrwiOrisoProceedureActivityId(changeInQapOrwiOrisoProceedureActivityId:number) {
    this._changeInQapOrwiOrisoProceedureActivityId = changeInQapOrwiOrisoProceedureActivityId;
  }

  get authExpireInSec(): number {
    return this._authExpireInSec;
  }
  set authExpireInSec(authExpireInSec: number) {
    this._authExpireInSec = authExpireInSec;
  }

  get companyId(): string {
    return this._companyId;
  }
  set companyId(companyId: string) {
    this._companyId = companyId;
  }

  get complaintReferenceNoFieldName(): string {
    return this._complaintReferenceNoFieldName;
  }
  set complaintReferenceNoFieldName(complaintReferenceNoFieldName: string) {
    this._complaintReferenceNoFieldName = complaintReferenceNoFieldName;
  }

  get diffBetwnCmplntRefDtAndLoggedOnDt(): number {
    return this._diffBetwnCmplntRefDtAndLoggedOnDt;
  }
  set diffBetwnCmplntRefDtAndLoggedOnDt(diffBetwnCmplntRefDtAndLoggedOnDt: number) {
    this._diffBetwnCmplntRefDtAndLoggedOnDt = diffBetwnCmplntRefDtAndLoggedOnDt;
  }
  get loginUserPassMaxLength(): number {
    return this._loginUserPassMaxLength;
  }
  set loginUserPassMaxLength(loginUserPassMaxLength: number) {
    this._loginUserPassMaxLength = loginUserPassMaxLength;
  }

   get loginUserPassMinLength(): number {
    return this._loginUserPassMinLength;
  }
  set loginUserPassMinLength(loginUserPassMinLength: number) {
    this._loginUserPassMinLength = loginUserPassMinLength;
  }

   get rolePrefix(): string {
    return this._rolePrefix;
  }
  set rolePrefix(rolePrefix: string) {
    this._rolePrefix = rolePrefix;
  }

  get areaSalesOrZonalManagerDesignationId(): string {
    return this._areaSalesOrZonalManagerDesignationId;
  }
  set areaSalesOrZonalManagerDesignationId(areaSalesOrZonalManagerDesignationId: string) {
    this._areaSalesOrZonalManagerDesignationId = areaSalesOrZonalManagerDesignationId;
  }

  get complaintRegistrationActivityId(): number {
    return this._complaintRegistrationActivityId;
  }
  set complaintRegistrationActivityId(complaintRegistrationActivityId: number) {
    this._complaintRegistrationActivityId = complaintRegistrationActivityId;
  }

   get preliminaryInvestigationActivityId(): number {
    return this._preliminaryInvestigationActivityId;
  }
  set preliminaryInvestigationActivityId(preliminaryInvestigationActivityId: number) {
    this._preliminaryInvestigationActivityId = preliminaryInvestigationActivityId;
  }

  get closeComplaintActivityId(): number {
    return this._closeComplaintActivityId;
  }
  set closeComplaintActivityId(closeComplaintActivityId: number) {
    this._closeComplaintActivityId = closeComplaintActivityId;
  }

  get pendingComplaintActivityId(): number {
    return this._pendingComplaintActivityId;
  }
  set pendingComplaintActivityId(pendingComplaintActivityId: number) {
    this._pendingComplaintActivityId = pendingComplaintActivityId;
  }

  get activityIdFieldName(): string{
    return this._activityIdFieldName;
  }
  set activityIdFieldName(activityIdFieldName: string){
    this._activityIdFieldName = activityIdFieldName;
  }

  get lastActivityIdFieldName(): string {
    return this._lastActivityIdFieldName;
  }
  set lastActivityIdFieldName(lastActivityIdFieldName: string) {
    this._lastActivityIdFieldName = lastActivityIdFieldName;
  }

  get complaintDetailsAutoIdFieldName(): string{
    return this._complaintDetailsAutoIdFieldName;
  }
  set complaintDetailsAutoIdFieldName(complaintDetailsAutoIdFieldName: string){
    this._complaintDetailsAutoIdFieldName = complaintDetailsAutoIdFieldName;
  }
  
   get getMenuDetails():any{
    return this._menuDetails;
  }
  set menuDetails(menuDet:any){
     this._menuDetails = menuDet ;
  }

  get validComplaintFieldName(): string {
    return this._validComplaintFieldName;
  }
  set validComplaintFieldName(validComplaintFieldName: string) {
    this._validComplaintFieldName = validComplaintFieldName;
  }

  get complaintLoggedByFieldName(): string {
   return this._complaintLoggedByFieldName;
  }
  set complaintLoggedByFieldName(complaintLoggedByFieldName: string){
    this._complaintLoggedByFieldName = complaintLoggedByFieldName;
  }

  get notificationInMilliSecond(): number {
    return this._notificationInMilliSecond;
  }
  set notificationInMilliSecond(notificationInMilliSecond: number) {
    this._notificationInMilliSecond = notificationInMilliSecond;
  }

  get siteVisitByFieldName(): string {
    return this._siteVisitByFieldName;
  }
  set siteVisitByFieldName(siteVisitByFieldName: string) {
    this._siteVisitByFieldName = siteVisitByFieldName;
  }

  get siteVisitRequiredFieldName(): string {
    return this._siteVisitRequiredFieldName;
  }
  set siteVisitRequiredFieldName(siteVisitRequiredFieldName: string) {
    this._siteVisitRequiredFieldName = siteVisitRequiredFieldName;
  }

  get allocationOfComplaintReadFieldName(): string {
    return this._allocationOfComplaintReadFieldName;
  }
  set allocationOfComplaintReadFieldName(allocationOfComplaintReadFieldName: string) {
    this._allocationOfComplaintReadFieldName = allocationOfComplaintReadFieldName;
  }
}//end of class