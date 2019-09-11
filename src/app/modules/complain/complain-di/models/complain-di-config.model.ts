export class ComplaintDIConfigModel {
    private _prevComplainHeader: any[] = [
        { headerKey: 'modeId', headerDesc: 'Mode of Complaint', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'complaintReferenceDt', headerDesc: 'Complaint Ref. Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'complaintTypeDesc', headerDesc: 'Complaint Type', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'natureOfComplaintDesc', headerDesc: 'Nature of Complaint', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'loggedByName', headerDesc: 'Complaint Logged By', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'siteVisit', headerDesc: 'Site Visit Required ', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get prevComplainHeader(): any[] {
        return this._prevComplainHeader;
    }
    set prevComplainHeader(prevComplainHeader: any[]) {
        this._prevComplainHeader = prevComplainHeader;
    }

    private _itemGridHeader: any[] = [
        { headerKey: 'invoiceNo', headerDesc: 'Official Document No', headerClass: 'header-style', dataClass: 'td-style-first' },
        { headerKey: 'itemNo', headerDesc: 'Item Code', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'invoiceDate', headerDesc: 'Official Document Date', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'itemName', headerDesc: 'Item Description', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'invoiceQtyInMtrs', headerDesc: 'Invoice Qty(in Mtrs)', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'complaintQtyInMtrs', headerDesc: 'Complain Qty(in Mtrs)', headerClass: 'header-style ', dataClass: 'td-style'},
        { headerKey: 'projectName', headerDesc: 'Project Name', headerClass: 'header-style', dataClass: 'td-style' },
        { headerKey: 'projectLocation', headerDesc: 'Project Location', headerClass: 'header-style-last', dataClass: 'td-style-last' }
    ]

    get itemGridHeader(): any[] {
        return this._itemGridHeader;
    }
    set itemGridHeader(itemGridHeader: any[]) {
        this._itemGridHeader = itemGridHeader;
    }
}