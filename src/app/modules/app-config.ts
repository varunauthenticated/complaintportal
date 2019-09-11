// Ctrl S
const URL_IP: string =
    'http://45.114.142.125';
// // for production
const URL_PORT: string = '91';
const URL_PATH: string = URL_IP + ':' + URL_PORT + '/';

export const AppUrlsConst: any = {
    LOGIN_URL: URL_PATH + 'api/user/login',
    CHANGE_PLANT_TYPE_URL: URL_PATH + 'api/user/loginplant',//for change plant type
    CMP_REG_RCPT_MODE_SELECT_VAL: URL_PATH + 'api/complaint/rcptmode',
    CMP_REG_LOGGED_BY_SELECT_VAL: URL_PATH + 'api/complaint/loggedby',
    CMP_REG_ACTIVITY_SELECT_VAL: URL_PATH + 'api/complaint/action',
    // complaint type, nature of complaint url added on 17.07.17
    CMP_REG_COMPLAINT_TYPE_USER_URL: URL_PATH + 'api/complaint/cmplnttype/DI',
    CMP_REG_NATURE_OF_COMPLAINT_URL: URL_PATH + 'api/complaint/nature/',
    // url for sending invoice no and getting all Invoice Details 1.08.17
    CMP_REG_INVOICE_NO_URL: URL_PATH + 'api/complaint/invoicedet/di/invoiceno/',
    CMP_REG_SUBMIT_URL: URL_PATH + 'api/complaint/di/add',

    CMP_PI_REG_SEVERITY_INDEX_RATINGS_VAL: URL_PATH + 'api/complaint/severity',

    CMP_REG_UPDATE_URL: URL_PATH + 'api/complaint/di/update', //for di update

    //  start complaint-pi-register urls
    // complaint type, nature of complaint url added on 09.08.17
    CMP_PI_REG_COMPLAINT_TYPE_USER_URL: URL_PATH + 'api/complaint/cmplnttype/PI',
    // url for sending invoice no and getting all Invoice Details 09.08.17
    CMP_PI_REG_SUBMIT_URL: URL_PATH + 'api/complaint/pi/add',
    CMP_PI_REG_INVOICE_NO_URL: URL_PATH + 'api/complaint/invoicedet/pi/invoiceno/',

    CMP_PI_REG_UPDATE_URL: URL_PATH + 'api/complaint/pi/update', //for pi update
    // end complaint-pi-register urls

    //30.06.17 for add user dropdowns
    ADD_USER_SEQURITY_QUESTION_VAL: URL_PATH + 'api/admin/secques/in',
    //user/employee create
    ADD_USER_DESIGNATION_VAL: URL_PATH + 'api/admin/desg',
    ADD_USER_DEPARTMENT_VAL: URL_PATH + 'api/admin/dept',
    ADD_USER_PLANT_TYPE_VAL: URL_PATH + 'api/admin/plntpe',
    ADD_USER_CREATE_URL: URL_PATH + 'api/admin/employee/create',
    MODIFY_USER_SUBMIT_URL: URL_PATH + 'api/admin/employee/update',
    //USER/EMPLOYEE CREATE
    ADD_USER_ROLE_NAME_VAL: URL_PATH + 'api/admin/role',
    ADD_USER_LOCATION_VAL: URL_PATH + 'api/comp/unitloc',
    //   ADD_USER_CREATE_URL:URL_PATH +'api/admin/user/create',
    //   MODIFY_USER_SUBMIT_URL: URL_PATH + 'api/admin/user/update',
    VIEW_USER_URL: URL_PATH + 'api/admin/employee/view',
    NAVIGATION_URL: URL_PATH + 'api/nav/complaint',
    DEACTIVATE_USER_URL: URL_PATH + 'api/admin/employee/deactivate',
    ACTIVATE_USER_URL: URL_PATH + 'api/admin/employee/activate',
    MANAGE_PROFILE_USER_SUBMIT_URL: URL_PATH + 'api/user/mngprofile',

    PRELI_INVESTIGATION_STENCIL_VAL: URL_PATH + 'api/complaint/preliminv/attr/Stencil',
    PRELI_INVESTIGATION_SOCKET_VAL: URL_PATH + 'api/complaint/preliminv/attr/Socket',
    PRELI_INVESTIGATION_SPIGOT_VAL: URL_PATH + 'api/complaint/preliminv/attr/Spigot',
    PRELI_INVESTIGATION_SURFACE_OUTER_VAL: URL_PATH + 'api/complaint/preliminv/attr/Surface Outer',
    PRELI_INVESTIGATION_COATING_BIT_VAL: URL_PATH + 'api/complaint/preliminv/attr/Coating',
    PRELI_INVESTIGATION_INNER_CML_VAL: URL_PATH + 'api/complaint/preliminv/attr/Inner CML',
    PRELI_INVESTIGATION_LUBRICATION_VAL: URL_PATH + 'api/complaint/preliminv/attr/Lubrication',
    PRELI_INVESTIGATION_FITTINGS_JOINTING_VAL: URL_PATH + 'api/complaint/preliminv/attr/Fittings Jointing',
    PRELI_INVESTIGATION_LOADING_RELATED_VAL: URL_PATH + 'api/complaint/preliminv/attr/Loading Related',
    PRELI_INVESTIGATION_PIPE_LAYING_VAL: URL_PATH + 'api/complaint/preliminv/attr/Pipe Laying',
    PRELI_INVESTIGATION_DIA_VAL: URL_PATH + 'api/complaint/dia',
    PRELI_INVESTIGATION_CLASSIFICATION_VAL: URL_PATH + 'api/complaint/classification',

    PRELI_INVESTIGATION_REPORT_DI_ADD_SUBMIT_URL: URL_PATH + 'api/complaint/preliminv/di/add',//preli di submit
    PRELI_INVESTIGATION_COMPLAINT_REF_NO_VAL: URL_PATH + 'api/complaint/di/cmplntrefnos',//get comp ref no list for preli di
    //preli det by complaint reference no - 02.11.17
    PRELI_INVESTIGATION_REPORT_DI_VIEW_BY_COPLAINT_REFERENCE_NO: URL_PATH + 'api/complaintview/prelidet/DI',
    //preli view
    PRELI_INVESTIGATION_REPORT_VIEW_URL: URL_PATH + 'api/complaintview/viewpreliheaderdetails', //for preli report view
    //preli update url
    MODIFY_PRELI_INVESTIGATION_REPORT_DI_SUBMIT_URL: URL_PATH + 'api/complaint/preliminv/di/update',//preli modify url

    // api/complaint/di/cmplntrefnos -getcomplaintRefno
    COMPLAINT_REFERENCE_DET_HEADER_VIEW_URL: URL_PATH + 'api/complaintview/viewheaderdetails',

    //URL FOR ALLOCATE COMPLAINT READ UPDATE
    ALLOCATE_COMPLAINT_READ_UPATE_URL: URL_PATH + 'api/util/sitevisitallocread',


    // 'api/complaint/di/view',//di complaint view
    DI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL: URL_PATH + 'api/complaint/di/viewdet',//to get complain DI det by comp ref no
    PI_COMPLAINT_REFERENCE_DETAILS_VIEW_WITHOUT_HEADER_URL: URL_PATH + 'api/complaint/pi/viewdet',//to get complain PI det by comp ref no
    DI_COMPLAINT_REFERENCE_DETAILS_VIEW_BY_ACTIVITY_ID_URL: URL_PATH + 'api/complaint/di/view/activity',
    EMPLOYEE_DET_BY_DESIGNATION_ID: URL_PATH + 'api/comp/employee/desg',
    PI_COMPLAINT_REFERENCE_DETAILS_VIEW_URL: URL_PATH + 'api/complaint/pi/view',//pi complaint view
    PI_COMPLAINT_REFERENCE_DETAILS_VIEW_BY_ACTIVITY_ID_URL: URL_PATH + 'api/complaint/pi/view/activity',

    //complain received by url 
    CMP_REG_COMP_RECEIVED_BY_VAL: URL_PATH + 'api/complaint/cmplntrcvdby',

    //for di complaint view by filteroption
    DI_COMPLAINT_VIEW_REPORT_FILTEROPTION: URL_PATH + 'api/complaint/view/report/DI',

    //for pi complaint view by filteroption
    PI_COMPLAINT_VIEW_REPORT_FILTEROPTION: URL_PATH + 'api/complaint/view/report/PI',


    //for DI complaints
    OPEN_PENDING_CLOSED_COMPLAINT_DI_VIEW: URL_PATH + 'api/complaintview/det/DI',// /PENDING <-- parameter
    //for PI complaints
    OPEN_PENDING_CLOSED_COMPLAINT_PI_VIEW: URL_PATH + 'api/complaintview/det/PI',// /PENDING <-- parameter
    DI_COMPLAINT_RESOLUTION_AND_CAPA_DETAILS_VIEW_URL: URL_PATH + 'api/complaintview/resocapa/',
    COMPLAINT_REFERENCE_NO_DROPDOWN_VAL: URL_PATH + 'api/complaint/complaintReferenceNos',//to get comp ref no dropdown val for comp reso


    // file upload url for di and pi complaint resolution and capa action
    DI_PI_COMPLAINT_RESOLUTION_UPLOAD_URL: URL_PATH + 'api/util/cmplntresl',
    DI_PI_CAPA_ACTION_UPLOAD_URL: URL_PATH + 'api/util/capaaction',

    //api/complaintview/allocdet/DEFAULT/DEFAULT
    //allocate view
    ALLOCATE_COMPLAINT_VIEW_URL: URL_PATH + 'api/complaintview/allocdet',
    //site vist by department name url 22.02.18
    SITE_VISIT_BY_DEPARTMENT: URL_PATH + 'api/complaint/sitevisitby',
    //modify allocation complaint
    MODIFY_ALLOCATE_COMPLAINT_SUBMIT_URL: URL_PATH + 'api/util/sitevisitalloc',

    //url to get faceted data for DI by clicking more than one time
    FACETED_DATA_URL_FOR_DI_PI: URL_PATH + 'api/util/facetednav',

    // for close complaint di pi
    DI_PI_CLOSE_COMPLAINT_UPLOAD_URL: URL_PATH + 'api/util/closecomp',


    // FOR SENDING CUSTOMER NAME
    DI_PI_COMPLAINT_CUSTDET_URL: URL_PATH + 'api/complaint/custdet',
    DI_PI_COMPLAINT_CUSTCODE_URL: URL_PATH + 'api/complaint/invoicedetbyitemdet',

    // for getting selected items details for di and pi
    DI_PI_SEL_INV_DET_BY_ITEMS: URL_PATH + 'api/complaint/selinvoicedetbyitemdet',

    //For saving selected invoice item details PI and DI
    DI_PI_ADD_SEL_INV_DET_BY_ITEMS: URL_PATH + 'api/complaint/add/selinvoicedetbyitemdet',
    //For deleting prev selected invoice item details PI and DI
    DI_PI_DEL_SEL_INV_DET_BY_ITEMS: URL_PATH + 'api/complaint/delete/selinvoicedetbyitemdet',
    //for user logout
    USER_LOGOUT: URL_PATH + 'api/user/logout',

    ADMIN_ROLE_VIEW: URL_PATH + 'api/admin/role/view',
    ADMIN_ROLE_CREATE: URL_PATH + 'api/admin/role/create',
    ADMIN_ROLE_UPDATE: URL_PATH + 'api/admin/role/update',

    //get mis report url
    MIS_REPORT_DETAILS_URL: URL_PATH + 'api/excel/mis',
    //rca add/edit
    RCA_ADD_EDIT_URL: URL_PATH + 'api/util/rca/rca_det',
    //rca reject url
    RCA_REJECT_URL: URL_PATH + 'api/util/rca/rca_cncl',
    //complain view url 
    COMPLAIN_VIEW_HEADER_URL: URL_PATH + 'api/complaintview/viewcomplaintheader',//di complain view from header table
    COMPLAIN_VIEW_DETAIL_URL: URL_PATH + 'api/complaintview/viewcomplaintdetail',//di complain view from detail table

    COMPLAIN_HEADER_TABLE_ADD_URL: URL_PATH + 'api/complaint/complaintheader',//HEADER TABLE ADD
    COMPLAIN_DETAIL_TABLE_ADD_URL: URL_PATH + 'api/complaint/complaintdetail',//detail table add

    COMPLAIN_INVOICE_ITEM_DETAIL_VIEW_URL: URL_PATH + 'api/complaintview/viewinvoicedetail',//di complain view invoice item detail
    COMPLAIN_INVOICE_ITEM_DETAIL_ADD_URL: URL_PATH + 'api/complaint/addinvoice',//di complain add invoice item detail
    COMPLAIN_INVOICE_ITEM_DETAIL_DELETE_URL: URL_PATH + 'api/complaint/delinvoice',//di complain delete invoice detail

    COMPLAIN_FILE_DELETE_URL: URL_PATH + 'api/complaint/modfile',//to delete file
    COMPLAIN_FILE_UPLOAD_TEMP_TABLE_URL: URL_PATH + 'api/complaint/uploadtempfile',//upload file in temp table
    COMPLAIN_FILE_UPLOAD_URL: URL_PATH + 'api/complaint/uploadfile',//to upload file
    COMPLAIN_FILE_VIEW_URL: URL_PATH + 'api/complaintview/viewfiledetail',//to view file
    COMPLAINT_HEADER_DATA_COUNT: URL_PATH + 'api/complaintview/viewcomplaintheadercount',//header data count
    SEND_EMAIL_URL: URL_PATH + 'api/comp/sendemail',//to send email
    VIEW_COMP_STATUS_WITH_COM_SET_URL: URL_PATH + 'api/complaintview/viewcomrcmsetlmnt',//view complaint status with comm set
    UPDATE_COM_SET_FROM_COMP_STATUS_GRID_URL: URL_PATH + 'api/complaint/updatecomrcmsetlmnt',//update com set from comp status grid 
    FILE_DOWNLOAD_FROM_MENU_URL: URL_PATH + 'api/util/download',//file download url from menu
    DASHBOARD_DATE_UPDATE_URL: URL_PATH + 'api/user/updatedboard',//dashboard date update url
    //commercial settlement-add url
    COMMERCIAL_SETTLEMENT_HEADER_TABLE_ADD_URL: URL_PATH + 'api/complaint/comstlmntheader',//comm-set add to HEADER TABLE 
    COMMERCIAL_SETTLEMENT_DETAIL_TABLE_ADD_URL: URL_PATH + 'api/complaint/comstlmntdetail',//comm-set add to detail TABLE 
    COMMERCIAL_SETTLEMENT_ITEM__DETAIL_TABLE_ADD_URL: URL_PATH + 'api/complaint/comstlmntinvdetail',//comm-set item detail table add
    COMMERCIAL_SETTLEMENT_FILE_UPLOAD_URL: URL_PATH + 'api/complaint/comstlmntuploadfile',//comm sett upload file 
    //comm-sett view url add
    COMMERCIAL_SETTLEMENT_VIEW_HEADER: URL_PATH + 'api/compsetlmntview/viewcomrcmsetlmntheader',//comm-sett view from header table
    COMMERCIAL_SETTLEMENT_VIEW_DETAILS: URL_PATH + 'api/compsetlmntview/viewcomrcmsetlmntdetail',//comm-sett view from detail table
    COMMERCIAL_SETTLEMENT_VIEW_INVOICE_ITEM: URL_PATH + 'api/compsetlmntview/viewcomrcmsetlmntinvoicedetail',//comm-sett view from invoice item table
    COMMERCIAL_SETTLEMENT_VIEW_FILE: URL_PATH + 'api/compsetlmntview/viewcomrcmsetlmntfiledetail',//for file view
    //commercial settlement mail url
    COMMERCIAL_SETTLEMENT_SEND_EMAIL_URL: URL_PATH + 'api/admin/sendemail',
    CHART_DATA_VIEW_URL: URL_PATH + 'api/chartview'
}

export const WebServiceConst: any = {
    contentType: 'application/json',
    accept: 'application/json'
}
