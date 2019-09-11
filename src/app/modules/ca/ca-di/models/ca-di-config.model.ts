export class CADIConfigModel {
    private _caReportHeader: any[] = [
        { headerKey: 'complaintReferenceNo', headerDesc: 'Complaint Reference No', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'correctiveActionDate', headerDesc: 'Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'correctiveAction', headerDesc: 'Ca Details', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get caReportHeader(): any[] {
        return this._caReportHeader;
    }
    set caReportHeader(caReportHeader: any[]) {
        this._caReportHeader = caReportHeader;
    }
}