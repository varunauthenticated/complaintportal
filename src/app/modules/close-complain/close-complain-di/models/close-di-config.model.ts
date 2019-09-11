export class CloseDIConfigModel {
    private _closeReportHeader: any[] = [
        { headerKey: 'complaintReferenceNo', headerDesc: 'Complaint Reference No', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'closeDate', headerDesc: 'Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'acknoledgementReceived', headerDesc: 'Acknoledgement Received', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'closeRemarks', headerDesc: 'Remarks', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get closeReportHeader(): any[] {
        return this._closeReportHeader;
    }
    set closeReportHeader(closeReportHeader: any[]) {
        this._closeReportHeader = closeReportHeader;
    }
}