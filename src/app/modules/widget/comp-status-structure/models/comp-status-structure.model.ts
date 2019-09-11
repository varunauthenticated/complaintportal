export class CompStatusStructureModel {
    private _compStatusStructureModel: any = {
        '10': { status: 10, shortName: 'REG' },
        '40': { status: 40, shortName: 'INV' },
        '50': { status: 50, shortName: 'RCA' },
        '60': { status: 60, shortName: 'CA' },
        '70': { status: 70, shortName: 'PA' },
        '80': { status: 80, shortName: 'CLOSE' }
    };


    get compStatusStructureModel(): any {
        return this._compStatusStructureModel;
    }

    set compStatusStructureModel(compStatusStructureModel: any) {
        this._compStatusStructureModel = compStatusStructureModel;
    }
}