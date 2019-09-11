import { ROUTE_PATHS } from '../../../router/router-paths';
export class DIPolygonModel {

    private _requiredSiteVisit: any[] = [ 
     {processName:'Registration', processUrl:'#'+ROUTE_PATHS.RouteComplainDIRegister},
     {processName:'Investigation Report',processUrl:'#'+ROUTE_PATHS.RouteInvestigationReportDiAdd},
     {processName:'RCA',processUrl:""},
     {processName:'CA',processUrl:""},
     {processName:'PA' ,processUrl:""},
     {processName:'Close',processUrl:'#'+ROUTE_PATHS.RouteCloseComplaintDI}
    ]

    private _notRequiredSiteVisit: string[] = [ 
        'Registration',
        'Complaint Resolution',
        'CAPA' ,
        'Close'
       ]

    public get siteVisitRequired(): string[]{
        return this._requiredSiteVisit;
    }

    public get siteVisitNotRequired(): string[] {
        return this._notRequiredSiteVisit;
    }
}