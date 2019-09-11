import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CompStatusStructureModel } from '../models/comp-status-structure.model';
export interface IcompStatusStructure {
  flowName: string, flowMsg: string, flowDate: string, headerClass?: string, footerClass?: string
}
@Component({
  selector: 'ispl-comp-status-structure',
  templateUrl: 'comp-status-structure.component.html',
  styleUrls: ['comp-status-structure.component.css']
})

export class CompStatusStructureComponent implements OnInit, OnChanges {
  @Input() compStatus;
  @Input() displayArr: any[];

  public compStatusStructure: any = {};
  public compStatusStructureList: IcompStatusStructure[] = [];
  constructor() {
  }

  ngOnInit(): void {

  }
  ngOnChanges() {
    this.compStatusStructure = new CompStatusStructureModel().compStatusStructureModel;
    // this.compStatus;
    this.compStatusStructureList = this.constructCompStatusStructureFlow();
    // console.log(this.compStatusStructureList);
  }

  
private getFlowName(statusDisplayActivityId: number):string{
  let flowname: string;
  switch(statusDisplayActivityId){
    case 10:{
      flowname = this.compStatusStructure['10'].shortName;
      break;
    }
    case 40:{
      flowname = this.compStatusStructure['40'].shortName;
      break;
    }
    case 50:{
      flowname = this.compStatusStructure['50'].shortName;
      break;
    }
    case 60:{
      flowname = this.compStatusStructure['60'].shortName;
      break;
    }
    case 70:{
      flowname = this.compStatusStructure['70'].shortName;
      break;
    }
    case 80:{
      flowname = this.compStatusStructure['80'].shortName;
      break;
    }
  }
  return flowname;
}

  private constructCompStatusStructureFlow() {
    let pageFlowData: any[] = [];

    for (let process of this.displayArr) {
      let compStatusStruc: IcompStatusStructure = {
        flowName: this.getFlowName(process.status),//process.shortName,
        flowMsg: process.difference,
        flowDate: process.completionDate
      };
      if (process.status <= this.compStatus) {
        compStatusStruc.headerClass = 'active-header-style';
        compStatusStruc.footerClass = 'active-footer-style';
        if((process.status == this.compStatus)&&(compStatusStruc.flowName=='CLOSE')){
          compStatusStruc.headerClass = 'complete-header-style';
          compStatusStruc.footerClass = 'complete-footer-style';
        }
      }else if (process.statusId != this.compStatus) {
        compStatusStruc.headerClass = 'inactive-header-style';
        compStatusStruc.footerClass = 'inactive-footer-style';
      }
      pageFlowData.push(compStatusStruc);
    }

    return pageFlowData;
  }

}