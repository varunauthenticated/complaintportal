import { ROUTE_PATHS } from '../../router/router-paths';

export class MenuWsMapModel{
   private _userMenuIcons:any={
    SMM0000001:'fa fa-book',   
    SMM0000002:'fa fa-book',
    SMM0000003:'fa fa-gears',
    SMM0000004:'fa fa-pie-chart',
    SMM0000005:'fa fa-pie-chart',
   } 
   private _userMenu:any ={
    homeNavigation: '#'+ROUTE_PATHS.RouteDashboard,
    SSM0000002: '#'+ROUTE_PATHS.RouteComplainDIRegister,//di reg
    SSM0000003: '#'+ROUTE_PATHS.RouteComplainDIView,//for view di
    SSM0000026: '#'+ROUTE_PATHS.RouteComplainDIView,//for view di - [SSM0000026- modify menu id]
    SSM0000017: '#'+ROUTE_PATHS.RouteAddUser,
    SSM0000019: '#'+ROUTE_PATHS.RouteViewUser,
    logout: '#'+ROUTE_PATHS.RouteLogout,
    manageProfile: '#'+ROUTE_PATHS.RouteManageProfile,
    dashboardBoth: '#'+ROUTE_PATHS.RouteDashboardBoth,
    SSM0000005: '#'+ROUTE_PATHS.RouteInvestigationReportDiAdd,//preli add
    //new add for ComplainPiRegister navigation 09-08-17
    SSM0000011:  '#'+ROUTE_PATHS.RouteComplainPIRegister,
    SSM0000012: '#'+ROUTE_PATHS.RouteComplainPIView,
    SSM0000032: '#'+ROUTE_PATHS.RouteViewComplainDIStatus,//to view complain di status   
    SSM0000007: '#'+ROUTE_PATHS.RouteComplaintResolutionDI, // for  adding Corrective Preventive Action
    SSM0000004: '#'+ROUTE_PATHS.RouteAllocateComplaint+"/Edit",//for allocate complint modify
    SSM0000031:'#'+ROUTE_PATHS.RouteAllocateComplaint+"/View",//for allocate complint view
    allocateViewByNotificationClick:'#'+ROUTE_PATHS.RouteAllocateComplaint+"/Notification",//for allocate complint modify
    SSM0000008: '#'+ROUTE_PATHS.RouteCAPAActionDI+"/modify", // for modify capa action di
    SSM0000028: '#'+ROUTE_PATHS.RouteCAPAActionDI+"/view", // for view capa action di
    //pi capa and reso
    SSM0000013: '#'+ROUTE_PATHS.RouteComplaintResolutionPI ,// for ComplaintResolutionPI
    SSM0000014: '#'+ROUTE_PATHS.RouteCAPAActionPI, // for capa action PI
    SSM0000009: '#'+ROUTE_PATHS.RouteCloseComplaintDI, //for close complaint di
    SSM0000015: '#'+ROUTE_PATHS.RouteCloseComplaintPI, //for close complaint pi
    //role management
    SSM0000022: '#'+ROUTE_PATHS.RouteAddRole,
    SSM0000024: '#'+ROUTE_PATHS.RouteViewRole,
    SSM0000030: '#'+ROUTE_PATHS.RouteMisReportView+"/di",//mis report di grid view
    // rcadiadd: '#'+ROUTE_PATHS.RouteAddPADI,//route add rca di
    SSM0000038: '#'+ ROUTE_PATHS.RouteChartComponentFull+"/bar",
    SSM0000036: '#'+ ROUTE_PATHS.RouteChartComponentFull+"/pie",
    SSM0000033: '#'+ ROUTE_PATHS.RouteChartComponentFull+"/pareto"
   };

   get userMenu(): any {
      return this._userMenu ;
   } 

   get userMenuIcons():any{
       return this._userMenuIcons;
   }
}

