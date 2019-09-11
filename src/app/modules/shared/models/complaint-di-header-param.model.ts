export class ComplaintDIHeaderParamModel {
    private _fields: string;
    private _filter: string;
    private _sortData: string;
    private _orderBy: string;
    private _perPage: string;
    private _pageNo: string;

    public get fields(): string {
        return this._fields;
    }
    public set fields(fields: string) {
        this._fields = fields;
    }

    public get filter(): string {
        return this._filter;
    }
    public set filter(filter: string) {
        this._filter = filter;
    }

    public get sortData(): string {
        return this._sortData;
    }
    public set sortData(sortData: string) {
        this._sortData = sortData;
    }
    
    public get orderBy(): string {
        return this._orderBy;
    }
    public set orderBy(orderBy: string) {
        this._orderBy = orderBy;
    }
    public get perPage(): string {
        return this._perPage;
    }
    public set perPage(perPage: string) {
        this._perPage = perPage;
    }
    public get pageNo(): string {
        return this._pageNo;
    }
    public set pageNo(pageNo: string) {
        this._pageNo = pageNo;
    }


}