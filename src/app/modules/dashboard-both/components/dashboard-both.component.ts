import { Component, Input, OnInit } from '@angular/core';
import { APP_DASHBOARD_ANIMATIONS } from "../../shared/components/animations/app-animations";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardBothModalComponent } from './dashboard-both-modal/dashboard-both-modal.component';

@Component({
  selector: 'dashboard-both',
  templateUrl: 'dashboard-both.component.html',
  styleUrls: ['dashboard-both.component.css'],
  animations: APP_DASHBOARD_ANIMATIONS
})
export class DashboardBothComponent implements OnInit {
  result: Array<any>;
  tiles1: any = {
    tilesHeader: 'Registered Complaints',
    tilesBodyText: 'Total Registered Complaints',
    tilesBodyNumber: '--',
    color: '#00ad21',
    buttonText: 'View Details',
    buttonLink: 'filtered'
  };
  tiles2: any = {
    tilesHeader: 'Closed Complaints',
    tilesBodyText: 'Total Closed Complaints',
    tilesBodyNumber: '--',
    color: '#3078BE',
    buttonText: 'View Details',
    buttonLink: 'filtered'
  };
  tiles3: any = {
    tilesHeader: 'Open Complaints',
    tilesBodyText: 'Total Open Complaints',
    tilesBodyNumber: '--',
    color: '#00ad21',
    buttonText: 'View Details',
    buttonLink: 'filtered'
  };
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private modalService: NgbModal,//modal
  ) {
    console.log("Dashboard Both Constructor...");
    this.onOpenModal1();
  }
  ngOnInit() {
    // this.onOpenModal1();
  }   
  private onOpenModal1(){
    this.onOpenModal();
  }

  //onOpenModal for opening modal from modalService
  private onOpenModal() {
    // const modalRef = 
    this.modalService.open(DashboardBothModalComponent);
    // modalRef.componentInstance.modalTitle = 'Information';
   
  }//end of method onOpenModal


}//end of class
