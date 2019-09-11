export class RCADIConfigModel {
    private _rcaReportHeader: any[] = [
        { headerKey: 'complaintReferenceNo', headerDesc: 'Complaint Reference No', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'rootCauseAnanysisDate', headerDesc: 'Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'rootCauseAnanysisRemarks', headerDesc: 'Rca Details', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get rcaReportHeader(): any[] {
        return this._rcaReportHeader;
    }
    set rcaReportHeader(rcaReportHeader: any[]) {
        this._rcaReportHeader = rcaReportHeader;
    }
}