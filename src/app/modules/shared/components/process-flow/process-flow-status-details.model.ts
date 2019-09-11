import { ROUTE_PATHS } from '../../../router/router-paths';
export class ProcessFlowStatusDetailsModel {
   
    private _statusDetails: any[] = [
        {statusId: 10, statusName: 'Registration', viewRoute: '#'+ROUTE_PATHS.RouteComplainDIView, editRoute: '#'+ROUTE_PATHS.RouteComplainDIRegister},
        {statusId: 40, statusName: 'Investigation Report', viewRoute: '#'+ROUTE_PATHS.RouteViewDetailsInvestigationReportDi, editRoute: '#'+ROUTE_PATHS.RouteInvestigationReportDiAdd},
        {statusId: 50, statusName: 'Root Cause Analysis(RCA)',viewRoute: '#'+ROUTE_PATHS.RouteViewDetailsRCADI, editRoute: '#'+ROUTE_PATHS.RouteAddRCADI},
        {statusId: 60, statusName: 'Corrective Action(CA)', viewRoute: '#'+ROUTE_PATHS.RouteViewDetailsCADI, editRoute: '#'+ROUTE_PATHS.RouteAddCADI},
        {statusId: 70, statusName: 'Preventive Action(PA)', viewRoute: '#'+ROUTE_PATHS.RouteViewDetailsPADI, editRoute: '#'+ROUTE_PATHS.RouteAddPADI},
        {statusId: 80, statusName: 'Closed', viewRoute: '#'+ROUTE_PATHS.RouteViewDetailsCloseComplainDI, editRoute: '#'+ROUTE_PATHS.RouteAddCloseComplainDI}
    ]

    public get statusDetails(): any[]{
        return this._statusDetails;
    }

    public set statusDetails(statusDetails: any[]) {
        this._statusDetails = statusDetails;
    }
}