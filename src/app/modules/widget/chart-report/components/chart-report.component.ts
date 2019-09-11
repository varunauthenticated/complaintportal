import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { APP_DASHBOARD_ANIMATIONS } from "../../../shared/components/animations/app-animations";
import { ComplaintDIService } from '../../../shared/services/complaint-di.service';
import { Subscription } from 'rxjs/Subscription';//to get route param
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { DatePipe } from '@angular/common';

////pareto
// const data = {
//     "chart": {
//         "caption": " Top Hardware Defects Frequency",
//         "subcaption": "Last year - ACME Computers",
//         "theme": "fusion",
//         "yaxisname": "# reported instances",
//         "syaxisname": "% of total instances",
//         "decimals": "1",
//         "drawcrossline": "1"
//     },
//     "data": [
//         {
//             "label": "Hard-Disk",
//             "value": "40"
//         },
//         {
//             "label": "PCB",
//             "value": "22"
//         },
//         {
//             "label": "Printer",
//             "value": "12"
//         },
//         {
//             "label": "CDROM",
//             "value": "10"
//         },
//         {
//             "label": "Keyboard",
//             "value": "6"
//         }
//     ]
// };
// //end of pareto const


@Component({
    selector: 'ispl-widget-chart-report',
    templateUrl: 'chart-report.component.html',
    styleUrls: ['chart-report.component.css'],
    animations: APP_DASHBOARD_ANIMATIONS
})

export class ChartReportComponent implements OnInit, OnChanges {
    // @Input() chartData: any;
    @Input() chartData: any;

    routeParam: string = '';

    //bar chart
    dataSourceForBarChart: Object;
    chartConfig: Object;
    //end of bar chart
    widthOfPieChart;
    heightOfPieChart;
    typeOfPieChart;
    dataFormatOfPieChart;
    dataSourceOfPieChart;
    dataSourceForParetoChart: any = {};
    //pareto
    width = 1000;
    height = 500;
    type = 'pareto2d';
    dataFormat = 'json';
    //end of pareto
    //date
    private fromDate: string;
    private toDate: string;


    constructor(
        private complaintDIService: ComplaintDIService,
        private activatedroute: ActivatedRoute,
        private router: Router,
        private localStorageService: LocalStorageService,
        private datePipe: DatePipe

    ) {

    }//end of constructor

    ngOnChanges() {
        console.log("called");
        // this.ngOnInit();
    }

    ngOnInit(): void {
        this.activatedroute.params.subscribe(params => {
            this.routeParam = params.chartType ? params.chartType : '';
            this.routeParam = params.chartType ? params.chartType : '';
        });
       
        if (this.routeParam) {
            let toDate = this.localStorageService.user.toDate;
            let fDateForShow = this.localStorageService.user.fromDate;
            let fDate = this.datePipe.transform(fDateForShow, 'yyyy-MM-dd');//'dd-MMM-yyyy'
            this.fromDate = this.datePipe.transform(fDateForShow, 'dd-MMM-yyyy');//to show the from date
            this.toDate = this.datePipe.transform(toDate, 'dd-MMM-yyyy');//to show the to date//date,'dd-MMM-yyyy'
            this.setChartData();
            switch (this.routeParam) {
                case 'pie':
                    this.getPieChartData();
                    break;
                case 'bar':
                    this.getBarData();
                case 'pareto':
                    this.getParetoData();
            }//end of switch
        } else {
            this.getPieChartData();//method to get pie chart data
            this.getBarData();//method to get bar chart data
        }
        //bar chart
        this.chartConfig = {
            width: this.routeParam ? '1000' : '600',
            height: this.routeParam ? '500' : '300',
            type: 'column2d',
            dataFormat: 'json',
        };
        //pie chart
        this.widthOfPieChart = this.routeParam ? 1000 : 600;
        this.heightOfPieChart = this.routeParam ? 500 : 300;
        this.typeOfPieChart = 'pie2d';
        this.dataFormatOfPieChart = 'json';

    }//end of oninit


    //method to get chartData
    setChartData() {
        let filterforPI: string =
            "CMPLNT_LOGD_ON BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
            + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";
        let filterforDI = "CMPLNT_LOGD_ON_ACTUAL BETWEEN CONVERT(datetime,\'" + this.datePipe.transform(this.fromDate, 'dd/MM/yyyy')
            + " 00:00:00\',103) AND CONVERT(datetime,\'" + this.datePipe.transform(this.toDate, 'dd/MM/yyyy') + " 23:59:59\',103)";
        let filter: string = '';
        switch (this.localStorageService.user.plantType) {
            case 'DI':
                filter = filterforDI;
                break;

            case 'PI':
                filter = filterforPI;
                break;
        }
        let period: string = '[from ' + this.fromDate + ' to ' + this.toDate + ']';

        this.chartData = {
            filter: filter,
            period: period,
            plantType: this.localStorageService.user.plantType
        }
    }
    //chart wscall
    getPieChartData() {
        let charttype: string = 'pie';

        let chartData = {};
        this.complaintDIService.getChartData(charttype, this.chartData.plantType, this.chartData.period, this.chartData.filter).subscribe((res) => {
            if (res.msgType === 'Info') {
                chartData = res;
                let pieData = {};
                pieData['chart'] = JSON.parse(chartData['chart']);
                pieData['data'] = chartData['data'];
                // let chartdata: any = this.chartData;
                this.dataSourceOfPieChart = pieData;
            }
        }), err => {
            console.log(err);
        }
    }//end of method

    //method to get bar chart data
    getBarData() {
        let charttype: string = 'bar';
        let chartData = {};
        this.complaintDIService.getChartData(charttype, this.chartData.plantType, this.chartData.period, this.chartData.filter).subscribe((res) => {
            if (res.msgType === 'Info') {
                chartData = res;
                let barData = {};
                barData['chart'] = JSON.parse(chartData['chart']);
                barData['data'] = chartData['data'];
                this.dataSourceForBarChart = barData;
            }
        }), err => {
            console.log(err);
        }
    }//end of method
    //method to get pareto data
    getParetoData() {
        let charttype: string = 'pareto';
        let chartData = {};
        this.complaintDIService.getChartData(charttype, this.chartData.plantType, this.chartData.period, this.chartData.filter).subscribe((res) => {
            if (res.msgType === 'Info') {
                chartData = res;
                let paretoData = {};
                paretoData['chart'] = JSON.parse(chartData['chart']);
                paretoData['data'] = chartData['data'];
                this.dataSourceForParetoChart = paretoData;
            }
        }), err => {
            console.log(err);
        }
    }//end of method

}//end of class