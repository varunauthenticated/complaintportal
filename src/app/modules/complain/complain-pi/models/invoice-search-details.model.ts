import { Injectable } from '@angular/core';

@Injectable()
export class InvoiceSearchDetailsModel {
    private _invoiceDetails: any;
    private _selectedItemDetails: any;
    private _title: string;
    private _custCode: string;
    private _custName: string;
    private _salesGroup: string;
    private _salesOffice: string;
    private _compRefNo: string;
    private _fileData: FormData;
    private _fileList: FileList;
    private _testVar: string;

    public get invoiceDetails():any{
        return this._invoiceDetails;
    }
    public set invoiceDetails(invoiceDetails: any){
        this._invoiceDetails = invoiceDetails;
    }
    public get selectedItemDetails(): any{
        return this._selectedItemDetails;
    }
    public set selectedItemDetails(selectedItemDetails: any){
        this._selectedItemDetails = selectedItemDetails;
    }
    public get title():string{
        return this._title;
    }
    public set title(title: string){
        this._title = title;
    }
    public get custCode(): string{
        return this._custCode;
    }
    public set custCode(custCode: string){
        this._custCode = custCode;
    }    
    public get custName(): string{
        return this._custName;
    }    
    public set custName(custName: string){
        this._custName = custName;
    }
    public get salesGroup(): string{
        return this._salesGroup;
    }
    public set salesGroup(salesGroup: string){
        this._salesGroup = salesGroup;
    }
    public get salesOffice(): string{
        return this._salesOffice;
    }
    public set salesOffice(salesOffice: string){
        this._salesOffice = salesOffice;
    }   
    public get compRefNo(): string{
        return this._compRefNo;
    }
    public set compRefNo(compRefNo: string){
        this._compRefNo = compRefNo;
    }
    public get fileData(): FormData{
        return this._fileData;
    }
    public set fileData(fileData: FormData){
        this._fileData = fileData;
    }
    public get fileList(): FileList{
        return this._fileList;
    }
    public set fileList(fileList: FileList){
        this._fileList = fileList;
    }
    public get testVar(): string{
        return this._testVar;
    }
    public set testVar(testVar: string){
        this._testVar = testVar;
    }
    
    
}//end of class

