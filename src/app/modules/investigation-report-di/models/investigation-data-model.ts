export class InvestigationDataModel {
    private _unloadingEquipmentList: any[] = [
        { id: '2', desc: 'Forklift', checked: false },
        { id: '3', desc: 'Crane With Sling', checked: false },
        { id: '4', desc: 'Crane With Pipe Tongs', checked: false },
        { id: '5', desc: 'Crane With Hooks', checked: false },
        { id: '6', desc: 'Others', checked: false }
    ];
    private _lubricantUsedList: any[] = [
        { id: '8', desc: 'Vegetable Oil', checked: false },
        { id: '9', desc: 'Grease', checked: false },
        { id: '10', desc: 'Soap Water', checked: false },
        { id: '11', desc: 'Any Other Material', checked: false }
    ];
    private _layingPositionList: any[] = [
        { id: '13', desc: 'Overhead / At a height', checked: false },
        { id: '14', desc: 'On Ground Level', checked: false },
        { id: '15', desc: 'Below Ground(Backfilled)', checked: false }
    ];
    private _jointingTypeList: any[] = [
        { id: '17', desc: 'Push on Joints', checked: false },
        { id: '18', desc: 'Mechanical Joint', checked: false },
        { id: '19', desc: 'Restrained Joint', checked: false },
        { id: '20', desc: 'Flanged Joint', checked: false },
        { id: '21', desc: 'Others', checked: false }
    ];

    get unloadingEquipmentList(): any[] {
        return this._unloadingEquipmentList;
    }
    get lubricantUsedList(): any[] {
        return this._lubricantUsedList;
    }
    get layingPositionList(): any[] {
        return this._layingPositionList;
    }
    get jointingTypeList(): any[] {
        return this._jointingTypeList;
    }

}