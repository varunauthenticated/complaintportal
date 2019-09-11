const ROUTE_LOGIN: string = 'login';
const ROUTE_LOGIN_FULL: string = '/' + ROUTE_LOGIN;

const ROUTE_LOGOUT: string = 'logout';
const ROUTE_LOGOUT_FULL: string = '/' + ROUTE_LOGOUT;

const ROUTE_HOME: string = 'home';
const ROUTE_HOME_FULL: string = '/' + ROUTE_HOME;

const ROUTE_DASHBOARD: string = 'dashboard';
const ROUTE_DASHBOARD_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_DASHBOARD;

//dashboard for both user
const ROUTE_DASHBOARD_BOTH: string = 'dashboardboth';
const ROUTE_DASHBOARD_BOTH_FULL: string = '/' + ROUTE_DASHBOARD_BOTH;

const ROUTE_ADD_USER: string = 'adduser';
const ROUTE_MODIFY_USER_ID: string = ROUTE_ADD_USER + '/' + ':userId';
const ROUTE_MODIFY_USER_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_USER;//modify
const ROUTE_ADD_USER_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_USER;//add

const ROUTE_VIEW_USER: string = 'viewuser';
const ROUTE_VIEW_USER_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_USER;

const ROUTE_MANAGE_PROFILE : string = 'manageprofile';
const ROUTE_MANAGE_PROFILE_FULL : string = ROUTE_HOME_FULL + '/' + ROUTE_MANAGE_PROFILE;

const CHART_ROUTE: string = 'chart';
const ROUTE_CHART_COMPONENT: string = CHART_ROUTE + '/'+':chartType';
const ROUTE_CHART_COMPONENT_FULL: string = ROUTE_HOME_FULL + '/' + CHART_ROUTE;

//add complaint di
const ROUTE_COMP_DI_REG: string = 'compregisterdi';
const ROUTE_COMP_DI_REG_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_DI_REG;

//for modify complaint di
const ROUTE_MODIFY_COMPLAINT_REFERENCE_NO: string = ROUTE_COMP_DI_REG + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_COMPLAINT_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_DI_REG;//modify complaint

//view complaint DI
const ROUTE_COMP_DI_VIEW: string = 'viewcomplaindi';//for complaint di view
//const ROUTE_COMP_DI_VIEW_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_DI_VIEW;
const ROUTE_COMP_DI_VIEW_DETAILS: string = ROUTE_COMP_DI_VIEW + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_COMP_DI_VIEW_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_DI_VIEW;//view

//view complaint di according to parameter
const ROUTE_COMP_DI_VIEW_FROM_DASHBOARD: string = 'complainViewDIDashboard';
const ROUTE_COMP_DI_VIEW_WITH_PARAMETER: string = ROUTE_COMP_DI_VIEW_FROM_DASHBOARD + '/' + ':activitytype';//for complaint di view from dashboard
const ROUTE_COMP_DI_VIEW_WITH_PARAMETER_FULL: string = ROUTE_HOME_FULL + '/' +  ROUTE_COMP_DI_VIEW_FROM_DASHBOARD;

//for route view compliaint status
const ROUTE_VIEW_COMP_DI_STATUS: string = 'compdistatusview';
const ROUTE_VIEW_COMP_DI_STATUS_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_COMP_DI_STATUS;

//for complain pi register 09.08.17
const ROUTE_COMP_PI_REG: string = 'compregisterpi';
const ROUTE_COMP_PI_REG_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_PI_REG;

//for complaint pi view
const ROUTE_COMP_PI_VIEW: string = 'complainviewpi';
const ROUTE_COMP_PI_VIEW_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_PI_VIEW;

//for complaint pi details view
const ROUTE_COMP_PI_REG_DET_VIEW_CONST: string = 'complaintregpidetview';
const ROUTE_COMP_PI_REG_DETAILS_VIEW: string = ROUTE_COMP_PI_REG_DET_VIEW_CONST + '/' + ':complaintReferenceNo';
const ROUTE_COMP_PI_REG_DETAILS_VIEW_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_PI_REG_DET_VIEW_CONST;

//view complaint pi according to parameter
const ROUTE_COMP_PI_VIEW_WITH_PARAMETER: string = ROUTE_COMP_PI_VIEW + '/' + ':activitytype';//for complaint di view
const ROUTE_COMP_PI_VIEW_WITH_PARAMETER_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_PI_VIEW;

//for modify complain pi
const ROUTE_MODIFY_COMPLAINT_PI_REFERENCE_NO: string = ROUTE_COMP_PI_REG + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_COMPLAINT_PI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMP_PI_REG;//modify pi complaint

//new add for PRELIMINRY_INVESTIGATION_DI 19.07.17
const ROUTE_INVESTIGATION_REPORT_DI_ADD_CONST: string = 'addinvestigationreportdi';
const ROUTE_INVESTIGATION_REPORT_DI_ADD: string = ROUTE_INVESTIGATION_REPORT_DI_ADD_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_INVESTIGATION_REPORT_DI_ADD_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_INVESTIGATION_REPORT_DI_ADD_CONST;//add

//new add for view INVESTIGATION_REPORT_DI (inv report view details)
const ROUTE_INVESTIGATION_REPORT_DI_VIEW: string = 'viewinvestigationreportdi';
const ROUTE_VIEW_DETAILS_INVESTIGATION_REPORT_DI: string =  ROUTE_INVESTIGATION_REPORT_DI_VIEW +'/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_VIEW_DETAILS_INVESTIGATION_REPORT_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_INVESTIGATION_REPORT_DI_VIEW;

//new add for single view ROUTE_VIEW_DETAILS_INVESTIGATION_REPORT_DI 15.02.18

//complaint reference no search
const ROUTE_COMPLAINT_REFERENCE_NO_SEARCH_CONST: string = 'complaintReferenceNoSearch';
const ROUTE_COMPLAINT_REFERENCE_NO_SEARCH: string = ROUTE_COMPLAINT_REFERENCE_NO_SEARCH_CONST+ '/'+ ':invoiceNo'+ '/' + ':itemCode';
const ROUTE_COMPLAINT_REFERENCE_NO_SEARCH_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_REFERENCE_NO_SEARCH_CONST;


//new add for allocate complaint add
const ROUTE_ADD_ALLOCATE_COMPLAINT: string = 'allocateComplaintadd';
const ROUTE_ADD_ALLOCATE_COMPLAINT_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_ALLOCATE_COMPLAINT;

//new add for allocate complaint route
const ROUTE_ALLOCATE_COMPLAINT_CONST: string = 'allocateComplaint';
//const ROUTE_ALLOCATE_COMPLAINT_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ALLOCATE_COMPLAINT;

const ROUTE_ALLOCATE_COMPLAINT: string = ROUTE_ALLOCATE_COMPLAINT_CONST + '/' + ':viewEditParam';//route path for menu
const ROUTE_ALLOCATE_COMPLAINT_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_ALLOCATE_COMPLAINT_CONST;

//new add for modify allocate complaint single view cum add/edit -- 22.02.18
const ROUTE_MODIFY_ALLOCATE_COMPLAINT: string =  ROUTE_ALLOCATE_COMPLAINT_CONST + '/' + ':complaintReferenceNo'+ '/' + ':viewEditParam';
const ROUTE_MODIFY_ALLOCATE_COMPLAINT_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ALLOCATE_COMPLAINT_CONST;

//complaint resolution di
const ROUTE_COMPLAINT_RESOLUTION_DI: string = 'complaintresolutiondi';
const ROUTE_COMPLAINT_RESOLUTION_DI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_RESOLUTION_DI;
//Complaint Resolution pi single view cum add/edit
const ROUTE_MODIFY_COMPLAINT_RESOLUTION_DI: string = ROUTE_COMPLAINT_RESOLUTION_DI + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_COMPLAINT_RESOLUTION_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMPLAINT_RESOLUTION_DI;
// Capa Action DI Route
const ROUTE_CAPA_DI_CONST: string = 'capaactiondi';
const ROUTE_CAPA_ACTION_DI: string = ROUTE_CAPA_DI_CONST + '/' + ':viewEditParam';//route path for menu
const ROUTE_CAPA_ACTION_DI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_CAPA_DI_CONST;
//capa actn pi single view cum add/edit
const ROUTE_MODIFY_CAPA_ACTION_DI: string = ROUTE_CAPA_DI_CONST + '/' + ':viewEditParam'+ '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_CAPA_ACTION_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_CAPA_DI_CONST;
//pi capa and reso
// Capa Action PI Route
const ROUTE_CAPA_ACTION_PI: string ='capaactionpiview';
const ROUTE_CAPA_ACTION_PI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_CAPA_ACTION_PI;
//capa actn pi single view cum add/edit
const ROUTE_MODIFY_CAPA_ACTION_PI: string = ROUTE_CAPA_ACTION_PI + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_CAPA_ACTION_PI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_CAPA_ACTION_PI;
// Complaint Resolution PI Route
const ROUTE_COMPLAINT_RESOLUTION_PI: string ='rootcauseanalysispi';
const ROUTE_COMPLAINT_RESOLUTION_PI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_RESOLUTION_PI;
//Complaint Resolution pi single view cum add/edit
const ROUTE_MODIFY_COMPLAINT_RESOLUTION_PI: string = ROUTE_COMPLAINT_RESOLUTION_PI + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_COMPLAINT_RESOLUTION_PI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMPLAINT_RESOLUTION_PI;
//close complaint di
const ROUTE_CLOSE_COMPLAINT_DI: string ='closeComplaintdi';
const ROUTE_CLOSE_COMPLAINT_DI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_CLOSE_COMPLAINT_DI;
//Complaint Resolution di single view cum add/edit
const ROUTE_MODIFY_CLOSE_COMPLAINT_DI: string = ROUTE_CLOSE_COMPLAINT_DI + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_CLOSE_COMPLAINT_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_CLOSE_COMPLAINT_DI;
//close complaint pi
const ROUTE_CLOSE_COMPLAINT_PI: string ='closecomplaintpi';
const ROUTE_CLOSE_COMPLAINT_PI_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_CLOSE_COMPLAINT_PI;
//Complaint Resolution di single view cum add/edit
const ROUTE_MODIFY_CLOSE_COMPLAINT_PI: string = ROUTE_CLOSE_COMPLAINT_PI + '/' + ':complaintReferenceNo';
const ROUTE_MODIFY_CLOSE_COMPLAINT_PI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_CLOSE_COMPLAINT_PI;

//pi invoice search
const ROUTE_COMPLAINT_PI_INVOICE_SEARCH: string ='complaintPIInvoiceSearch';
const ROUTE_COMPLAINT_PI_INVOICE_SEARCH_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_PI_INVOICE_SEARCH;

//pi customer search
const ROUTE_COMPLAINT_PI_CUSTOMER_SEARCH: string ='complaintPICustomerSearch';
const ROUTE_COMPLAINT_PI_CUSTOMER_SEARCH_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_PI_CUSTOMER_SEARCH;
//di invoice search
const ROUTE_COMPLAINT_DI_INVOICE_SEARCH: string ='complaintDIInvoiceSearch';
const ROUTE_COMPLAINT_DI_INVOICE_SEARCH_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_DI_INVOICE_SEARCH;

//di customer search
const ROUTE_COMPLAINT_DI_CUSTOMER_SEARCH: string ='complaintDICustomerSearch';
const ROUTE_COMPLAINT_DI_CUSTOMER_SEARCH_FULL: string = ROUTE_HOME_FULL + '/'+ ROUTE_COMPLAINT_DI_CUSTOMER_SEARCH;

const ROUTE_ADD_ROLE: string = 'addrole';
const ROUTE_MODIFY_ROLE_ID: string = ROUTE_ADD_ROLE + '/' + ':roleId';
const ROUTE_MODIFY_ROLE_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_ROLE;//modify
const ROUTE_ADD_ROLE_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_ROLE;//add

const ROUTE_VIEW_ROLE: string = 'viewrole';
const ROUTE_VIEW_ROLE_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_ROLE;

//close di
const ROUTE_ADD_CLOSE_COMPLAIN_DI_CONST: string = 'addclosecomplaindi';
const ROUTE_ADD_CLOSE_COMPLAIN_DI: string = ROUTE_ADD_CLOSE_COMPLAIN_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_ADD_CLOSE_COMPLAIN_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_CLOSE_COMPLAIN_DI_CONST;//add
const ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI_CONST: string = 'viewclosecomplaindi';//close complain view
const ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI: string = ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI_CONST;//view


//rca di
const ROUTE_ADD_RCA_DI_CONST: string = 'addrcadi';
const ROUTE_ADD_RCA_DI: string = ROUTE_ADD_RCA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_ADD_RCA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_RCA_DI_CONST;//add
const ROUTE_VIEW_DETAILS_RCA_DI_CONST: string = 'viewrcadi';//rca view
const ROUTE_VIEW_DETAILS_RCA_DI: string = ROUTE_VIEW_DETAILS_RCA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_VIEW_DETAILS_RCA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_DETAILS_RCA_DI_CONST;//view


//ca di
const ROUTE_ADD_CA_DI_CONST: string = 'addcadi';
const ROUTE_ADD_CA_DI: string = ROUTE_ADD_CA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_ADD_CA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_CA_DI_CONST;//add
const ROUTE_VIEW_DETAILS_CA_DI_CONST: string = 'viewcadi';//ca view
const ROUTE_VIEW_DETAILS_CA_DI: string = ROUTE_VIEW_DETAILS_CA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_VIEW_DETAILS_CA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_DETAILS_CA_DI_CONST;//view


//pa di
const ROUTE_ADD_PA_DI_CONST: string = 'addpadi';
const ROUTE_ADD_PA_DI: string = ROUTE_ADD_PA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_ADD_PA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_ADD_PA_DI_CONST;//add
const ROUTE_VIEW_DETAILS_PA_DI_CONST: string = 'viewpadi';//pa view
const ROUTE_VIEW_DETAILS_PA_DI: string = ROUTE_VIEW_DETAILS_PA_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus';
const ROUTE_VIEW_DETAILS_PA_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_VIEW_DETAILS_PA_DI_CONST;//view


//for mis report
const ROUTE_MIS_REPORTS: string = 'misreport';
const ROUTE_MIS_REPORTS_VIEW: string = ROUTE_MIS_REPORTS + '/' + ':plantType';
const ROUTE_MIS_REPORTS_VIEW_FULL: string =  ROUTE_HOME_FULL + '/' + ROUTE_MIS_REPORTS;
const ROUTE_MIS_REPORTS_VIEW_DETAILS: string = ROUTE_MIS_REPORTS + '/' + ':plantType' + '/' + ':complaintReferenceNo';
const ROUTE_MIS_REPORT_VIEW_DETAILS_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_MIS_REPORTS;

//commercial settlement di
const ROUTE_COMM_SET_DI_CONST: string = 'commercialsettlementdi';
const ROUTE_COMM_SET_DI: string = ROUTE_COMM_SET_DI_CONST + '/' + ':complaintReferenceNo'+ '/' + ':complaintStatus' + '/' + ':commsettcount';
const ROUTE_COMM_SET_DI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMM_SET_DI_CONST;//add

//commercial settlement pi
const ROUTE_COMM_SET_PI_CONST: string = 'commercialsettlementpi';
const ROUTE_COMM_SET_PI: string = ROUTE_COMM_SET_PI_CONST + '/' + ':complaintReferenceNo' + '/' + ':commsettcount';
const ROUTE_COMM_SET_PI_FULL: string = ROUTE_HOME_FULL + '/' + ROUTE_COMM_SET_PI_CONST;//add


// Full route path (/login, /home/dashboard etc.)
export const ROUTE_PATHS = {
    RouteLogin: ROUTE_LOGIN_FULL,
    RouteLogout: ROUTE_LOGOUT_FULL,
    RouteHome: ROUTE_HOME_FULL,
    RouteComplainPIRegister: ROUTE_COMP_PI_REG_FULL, //complain register pi 09.08.17
    RouteDashboard: ROUTE_DASHBOARD_FULL,
    RouteDashboardBoth: ROUTE_DASHBOARD_BOTH_FULL,//for dashboard full
    RouteViewComplainDIStatus: ROUTE_VIEW_COMP_DI_STATUS_FULL,//for comp di status view
    RouteComplainDIRegister: ROUTE_COMP_DI_REG_FULL,//complaint di reg from menu
    RouteComplainDIView: ROUTE_COMP_DI_VIEW_FULL,//complain di view full
    RouteModifyComplaint: ROUTE_MODIFY_COMPLAINT_DI_FULL,//modify di complaint
    RouteComplaintDIViewWithParameter: ROUTE_COMP_DI_VIEW_WITH_PARAMETER_FULL,//complaint DI view with parameter for dashboard to view di
    RouteComplaintPIViewWithParameter: ROUTE_COMP_PI_VIEW_WITH_PARAMETER_FULL,//complaint PI view with parameter
    RouteAddUser: ROUTE_ADD_USER_FULL,//add
    RouteModifyUser: ROUTE_MODIFY_USER_FULL,//modify user
    RouteViewUser: ROUTE_VIEW_USER_FULL,
    RouteManageProfile: ROUTE_MANAGE_PROFILE_FULL,
    //new add for PRELIMINRY_INVESTIGATION_DI 19.07.17
    RouteInvestigationReportDiAdd: ROUTE_INVESTIGATION_REPORT_DI_ADD_FULL,//preli add  
    RouteViewDetailsInvestigationReportDi: ROUTE_VIEW_DETAILS_INVESTIGATION_REPORT_DI_FULL,//preli view details for single view
    RouteComplaintReferenceNoSearch: ROUTE_COMPLAINT_REFERENCE_NO_SEARCH_FULL,//to search comp ref no of investigation reoport
    RouteComplainPIView: ROUTE_COMP_PI_VIEW_FULL,//for complaint pi view
    RouteComplainPIRegDetailsView: ROUTE_COMP_PI_REG_DETAILS_VIEW_FULL,//comp pi reg det view
    RouteModifyPIComplaint: ROUTE_MODIFY_COMPLAINT_PI_FULL,//for complain pi modify
    RouteAllocateComplaint: ROUTE_ALLOCATE_COMPLAINT_FULL,//allocate complaint full
    RouteAddAllocateComplaint: ROUTE_ADD_ALLOCATE_COMPLAINT_FULL,//allocate complaint add full
    RouteModifyAllocateComplaint: ROUTE_MODIFY_ALLOCATE_COMPLAINT_FULL,//modify allocate complaint full
    RouteComplaintResolutionDI : ROUTE_COMPLAINT_RESOLUTION_DI_FULL,//Complaint Reso Di full
    RouteModifyComnplaintResolutionDI: ROUTE_MODIFY_COMPLAINT_RESOLUTION_DI_FULL,//route modify complaint resolution di
    RouteComplaintResolutionPI : ROUTE_COMPLAINT_RESOLUTION_PI_FULL, // ComplaintResolutionPI
    RouteModifyComplaintResolutionPI : ROUTE_MODIFY_COMPLAINT_RESOLUTION_PI_FULL,//route modify complaint reso pi
    RouteCAPAActionDI : ROUTE_CAPA_ACTION_DI_FULL,//CAPA Action full
    RouteModifyCAPAActionDI: ROUTE_MODIFY_CAPA_ACTION_DI_FULL,//route modify capa action di full
    RouteCAPAActionPI : ROUTE_CAPA_ACTION_PI_FULL,//CAPA Action full pi
    RouteModifyCAPAActionPI : ROUTE_MODIFY_CAPA_ACTION_PI_FULL,//route modify capa action
    RouteCloseComplaintDI: ROUTE_CLOSE_COMPLAINT_DI_FULL, //close complaint di
    RouteModifyCloseComplaintDI: ROUTE_MODIFY_CLOSE_COMPLAINT_DI_FULL,//modify close complaint di
    RouteCloseComplaintPI : ROUTE_CLOSE_COMPLAINT_PI_FULL, //close complaint pi
    RouteModifyCloseCoimplaintPI: ROUTE_MODIFY_CLOSE_COMPLAINT_PI_FULL,//route modify close complaint pi
    RouteComplaintPICustomerSearch: ROUTE_COMPLAINT_PI_CUSTOMER_SEARCH_FULL,//pi customer search
    RouteComplaintPIInvoiceSearch : ROUTE_COMPLAINT_PI_INVOICE_SEARCH_FULL, //pi invoice search
    RouteComplaintDICustomerSearch: ROUTE_COMPLAINT_DI_CUSTOMER_SEARCH_FULL,//di customer search
    RouteComplaintDIInvoiceSearch : ROUTE_COMPLAINT_DI_INVOICE_SEARCH_FULL, //di invoice search
    RouteAddRole: ROUTE_ADD_ROLE_FULL,//add role
    RouteModifyRole: ROUTE_MODIFY_ROLE_FULL,//modify role
    RouteViewRole: ROUTE_VIEW_ROLE_FULL,
    RouteMisReportView: ROUTE_MIS_REPORTS_VIEW_FULL,//for mis report grid view full
    RouteMisReportViewDetails: ROUTE_MIS_REPORT_VIEW_DETAILS_FULL,//for mis report details full
    RouteAddRCADI: ROUTE_ADD_RCA_DI_FULL,//add rca di
    RouteViewDetailsRCADI: ROUTE_VIEW_DETAILS_RCA_DI_FULL,//view rca
    RouteAddCADI: ROUTE_ADD_CA_DI_FULL,//add ca di
    RouteViewDetailsCADI: ROUTE_VIEW_DETAILS_CA_DI_FULL,//view ca
    RouteAddPADI: ROUTE_ADD_PA_DI_FULL,//add pa di
    RouteViewDetailsPADI: ROUTE_VIEW_DETAILS_PA_DI_FULL,//view pa
    RouteAddCloseComplainDI: ROUTE_ADD_CLOSE_COMPLAIN_DI_FULL,//add close complain di
    RouteViewDetailsCloseComplainDI: ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI_FULL,//view close complain
    RouteCommercialSettlementDI: ROUTE_COMM_SET_DI_FULL,//route di commercial settlement add
    RouteCommercialSettlementPI: ROUTE_COMM_SET_PI_FULL,//route pi commercial settlement add
    RouteChartComponentFull: ROUTE_CHART_COMPONENT_FULL
}

// Router names (like login, home, dashboard etc.)
export const ROUTER_PATHS = {
    LoginRouter: ROUTE_LOGIN,
    LogoutRouter: ROUTE_LOGOUT,
    HomeRouter: ROUTE_HOME,
    ViewComplainDIStatus: ROUTE_VIEW_COMP_DI_STATUS,//complain di status view from menu
    ComplainDIRegisterRouter: ROUTE_COMP_DI_REG,//complaint di reg from menu
    ComplainDIViewRouter: ROUTE_COMP_DI_VIEW,//complain di view
    ComplainDIViewDetailsRouter: ROUTE_COMP_DI_VIEW_DETAILS,//comp view details(Reg page in view mode)
    ModifyComplaintDIRouter: ROUTE_MODIFY_COMPLAINT_REFERENCE_NO,//modify complain di 
    DIViewComplaintWithParameterRouter: ROUTE_COMP_DI_VIEW_WITH_PARAMETER,//DI view comp with parameter from dashboard 
    ComplainPIRegisterRouter: ROUTE_COMP_PI_REG, //complain register pi 09.08.17
    ComplainPIRegDetailsViewRouter: ROUTE_COMP_PI_REG_DETAILS_VIEW,//comp pi details view
    DashboardRouter: ROUTE_DASHBOARD,
    DashboardBothRouter: ROUTE_DASHBOARD_BOTH,//dashboard both    
    AddUserRouter: ROUTE_ADD_USER,//add user
    ModifyUserRouter: ROUTE_MODIFY_USER_ID,//new add for modify
    ViewUserRouter: ROUTE_VIEW_USER,
    ManageProfileRouter: ROUTE_MANAGE_PROFILE,
    //new add for PRELIMINRY_INVESTIGATION_DI 19.07.17
    //PreliminaryInvestigationDiAddRouter: ROUTE_PRELIMINRY_INVESTIGATION_DI_ADD,//preli add
    InvestigationReportDiAddRouter: ROUTE_INVESTIGATION_REPORT_DI_ADD,//preli add
    // ViewPreliminaryInvestigationDiRouter: ROUTE_PRELIMINRY_INVESTIGATION_DI_VIEW,//preli view
    // ViewModifyPreliminaryInvestigationRouter: ROUTE_VIEW_MODIFY_PRELIMINRY_INVESTIGATION_DI,//preli view edit from menu
    // ViewModifyInvestigationReportRouter: ROUTE_VIEW_MODIFY_INVESTIGATION_REPORT_DI,//preli view edit from menu
    //ModifyPreliminaryInvestigationDiRouter: ROUTE_MODIFY_PRELIMINRY_INVESTIGATION_DI,//preli modify 
    //ViewDetailsPreliminaryInvestigationDiRouter:ROUTE_VIEW_DETAILS_PRELIMINRY_INVESTIGATION_DI,//single view of preli   
    ViewDetailsInvestigationReportDiRouter:ROUTE_VIEW_DETAILS_INVESTIGATION_REPORT_DI,//single view of preli    
    ComplaintReferenceNoSearchRouter: ROUTE_COMPLAINT_REFERENCE_NO_SEARCH,//to search comp ref no of investigation reoport
    PIViewComplaintWithParameterRouter: ROUTE_COMP_PI_VIEW_WITH_PARAMETER,//PI view comp with parameter
    ComplainPIViewRouter: ROUTE_COMP_PI_VIEW,//for complaint pi view
    modifyPIComplaintRouter: ROUTE_MODIFY_COMPLAINT_PI_REFERENCE_NO,//modify pi complain
    AllocateComplaint: ROUTE_ALLOCATE_COMPLAINT,//allocate complaint for site visit
    AddAllocateComplaint: ROUTE_ADD_ALLOCATE_COMPLAINT,//add allocate complaint for site visit
    ModifyAllocateComplaint: ROUTE_MODIFY_ALLOCATE_COMPLAINT,//modify allocate complaint for site visit
    ComplaintResolutionDI: ROUTE_COMPLAINT_RESOLUTION_DI,//Corrective Preventive Action full
    ModifyComplaintResolutionDI : ROUTE_MODIFY_COMPLAINT_RESOLUTION_DI, //modify ComplaintResolutiondI
    CAPAActionDI: ROUTE_CAPA_ACTION_DI,//CAPA Action DI
    ModifyCAPAActionDI: ROUTE_MODIFY_CAPA_ACTION_DI,//route modify capa actn di
    //pi
    CAPAActionPI: ROUTE_CAPA_ACTION_PI,//CAPA Action PI
    ModifyCAPAActionPI: ROUTE_MODIFY_CAPA_ACTION_PI,//route modify capa actn pi
    ComplaintResolutionPI : ROUTE_COMPLAINT_RESOLUTION_PI, // ComplaintResolutionPI
    ModifyComplaintResolutionPI : ROUTE_MODIFY_COMPLAINT_RESOLUTION_PI, // modify ComplaintResolutionPI
    CloseComplaintDI : ROUTE_CLOSE_COMPLAINT_DI, //close complaint di
    ModifyCloseComplaintDI : ROUTE_MODIFY_CLOSE_COMPLAINT_DI, //modify close complaint di
    CloseComplaintPI : ROUTE_CLOSE_COMPLAINT_PI,//close complaint pi
    ModifyCloseComplaintPI : ROUTE_MODIFY_CLOSE_COMPLAINT_PI, //close complaint pi
    ComplaintPIInvoiceSearch : ROUTE_COMPLAINT_PI_INVOICE_SEARCH, //pi invoice search
    ComplaintPICustomerSearch : ROUTE_COMPLAINT_PI_CUSTOMER_SEARCH, //pi customer search
    ComplaintDIInvoiceSearch : ROUTE_COMPLAINT_DI_INVOICE_SEARCH, //di invoice search
    ComplaintDICustomerSearch : ROUTE_COMPLAINT_DI_CUSTOMER_SEARCH, //di customer search
    AddRoleRouter: ROUTE_ADD_ROLE,//add role
    ModifyRoleRouter: ROUTE_MODIFY_ROLE_ID,//new add for modify
    ViewRoleRouter: ROUTE_VIEW_ROLE,
    MisReportViewRouter: ROUTE_MIS_REPORTS_VIEW,//for grid view of mis report
    MisReportViewDetailsRouter: ROUTE_MIS_REPORTS_VIEW_DETAILS,//for mis reports view details
    AddRCADIRouter: ROUTE_ADD_RCA_DI,//add rca di
    ViewDetailsRCADIRouter: ROUTE_VIEW_DETAILS_RCA_DI,//rca view details
    AddCADIRouter: ROUTE_ADD_CA_DI,//add ca di
    ViewDetailsCADIRouter: ROUTE_VIEW_DETAILS_CA_DI,//ca view details
    AddPADIRouter: ROUTE_ADD_PA_DI,//add Pa di
    ViewDetailsPADIRouter: ROUTE_VIEW_DETAILS_PA_DI,//pa view details
    AddCloseComplainDIRouter: ROUTE_ADD_CLOSE_COMPLAIN_DI,//add CloseComplain di
    ViewDetailsCloseComplainDIRouter: ROUTE_VIEW_DETAILS_CLOSE_COMPLAIN_DI,//CloseComplain view details
    CommercialsettlementDIRouter: ROUTE_COMM_SET_DI,//comm set di add route
    CommercialsettlementPIRouter: ROUTE_COMM_SET_PI,//comm set pi add route
    ChartRouter: ROUTE_CHART_COMPONENT
}
