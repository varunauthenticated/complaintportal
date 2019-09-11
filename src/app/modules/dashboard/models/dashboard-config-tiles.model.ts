export class DashboardConfigTilesModel{
    private _dashboardConfigTilesModel: any[]=[
        {key:'Modify tiles date range', value:'Modify tiles date range'}
    ];
    get dashboardConfigTilesModel(){
        return this._dashboardConfigTilesModel;
    }
    set dashboardConfigTilesModel(dashboardConfigTilesModel:any[]){
        this._dashboardConfigTilesModel = dashboardConfigTilesModel;
    }
}