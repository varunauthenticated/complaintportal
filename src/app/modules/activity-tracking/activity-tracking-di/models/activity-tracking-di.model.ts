export class ActiivityTrackingModel {

    private _activityTrackingGridConfig: any = {
        'complainRefNo': {
            headerDesc: 'Complaint Number', headerClass: 'header-first-td-style', dataClass: 'tbody-first-td-style'
        },
        'statusDisplay': {
            headerDesc: 'Status', headerClass: 'header-mid-td-style', dataClass: 'tbody-mid-td-style'
        },
        'commercialSett': {
            headerDesc: 'Commercial Settlement', headerClass: 'header-last-td-style', dataClass: 'tbody-last-td-style'
        }
    }

    private _activityTrackingGridConfigWithOutCommSet: any = {
        'complainRefNo': {
            headerDesc: 'Complaint Number', headerClass: 'header-first-td-style', dataClass: 'tbody-first-td-style'
        },
        'statusDisplay': {
            headerDesc: 'Status', headerClass: 'header-last-td-style', dataClass: 'tbody-last-td-style-partial-grid'
        }
    }

    //model for facted data
    private _facetedDataModel: any[] = [
        {facetedDesc:'reg', facetedDisplayName:'Registration',activityId: 10},
        {facetedDesc:'inv', facetedDisplayName:'Investigation Report',activityId: 40},
        {facetedDesc:'rca', facetedDisplayName:'Root Cause Analysis',activityId: 50},
        {facetedDesc:'ca', facetedDisplayName:'Corrective Action',activityId: 60},
        {facetedDesc:'pa', facetedDisplayName:'Preventive Action',activityId: 70},
        {facetedDesc:'close', facetedDisplayName:'Close',activityId: 80}
    ];

    get facetedDataModel(): any[]{
        return this._facetedDataModel;
    }
    set facetedDataModel(facetedDataModel: any[]){
        this._facetedDataModel = facetedDataModel;
    }

    get activityTrackingGridConfig(): any{
        return this._activityTrackingGridConfig;
    }
    set activityTrackingGridConfig(activityTrackingGridConfig: any){
        this._activityTrackingGridConfig = activityTrackingGridConfig;
    }

    get activityTrackingGridConfigWithOutCommSet(): any {
        return this._activityTrackingGridConfigWithOutCommSet;
    }

    set activityTrackingGridConfigWithOutCommSet(activityTrackingGridConfigWithOutCommSet: any) {
        this._activityTrackingGridConfigWithOutCommSet = activityTrackingGridConfigWithOutCommSet;
    }
}