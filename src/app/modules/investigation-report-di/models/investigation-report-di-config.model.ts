export class InvestigationReportDIConfigModel {
    private _prevInvReportHeader: any[] = [
        { headerKey: 'investigationReportDate', headerDesc: 'Investigation Report Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'custCode', headerDesc: 'Customer Code', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'customerName', headerDesc: 'Customer Name', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'siteVisitMade', headerDesc: 'Site Visit Made', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'sampleCollected', headerDesc: 'Sample Collected', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    private _invItemGridHeader: any[] = [
        { headerKey: 'invoiceNo', headerDesc: 'Official Document No', headerClass: 'header-style-first', dataClass: 'td-style-first' },
        { headerKey: 'itemNo', headerDesc: 'Item Code', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'itemName', headerDesc: 'Item Description', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'invoiceDate', headerDesc: 'Official Document Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'invoiceQtyInMtrs', headerDesc: 'Invoice Qty(in Mtrs)', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'complaintQtyInMtrs', headerDesc: 'Complaint Qty(in Mtrs)', headerClass: 'header-style bold-font', dataClass: 'td-style'},
        { headerKey: 'complaintTypeDesc', headerDesc: 'Complaint Type', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'natureOfComplaintDesc', headerDesc: 'Nature of Complaint', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'complaintDetails', headerDesc: 'Detail of Complaint', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'projectName', headerDesc: 'Project Name', headerClass: 'header-style', dataClass: 'td-style'},
        { headerKey: 'projectLocation', headerDesc: 'Project Location', headerClass: 'header-style-last', dataClass: 'td-style-last'}
    ]

    get prevInvReportHeader(): any[] {
        return this._prevInvReportHeader;
    }
    set prevInvReportHeader(prevInvReportHeader: any[]) {
        this._prevInvReportHeader = prevInvReportHeader;
    }

    get invItemGridHeader(): any[] {
        return this._invItemGridHeader;
    }
    set invItemGridHeader(invItemGridHeader: any[]) {
        this._invItemGridHeader = invItemGridHeader;
    }

}