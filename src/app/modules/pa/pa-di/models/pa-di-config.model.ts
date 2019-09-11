export class PADIConfigModel {
    private _paReportHeader: any[] = [
        { headerKey: 'complaintReferenceNo', headerDesc: 'Complaint Reference No', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'preventiveActionDate', headerDesc: 'Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'preventiveAction', headerDesc: 'Pa Details', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get paReportHeader(): any[] {
        return this._paReportHeader;
    }
    set paReportHeader(paReportHeader: any[]) {
        this._paReportHeader = paReportHeader;
    }
}