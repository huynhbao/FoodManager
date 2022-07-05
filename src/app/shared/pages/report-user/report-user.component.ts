import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReportUser } from 'src/app/models/report.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalUserComponent } from '../../components/modal-user/modal-user.component';

@Component({
  selector: 'app-report-user',
  templateUrl: './report-user.component.html',
  styleUrls: ['./report-user.component.scss']
})
export class ReportUserComponent implements OnInit {
  reportUsers: ReportUser[] = [];
  currentPage: number = 1;
  itemsPerPage = 5;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  isLoading: boolean = false;
  isLoadingHashtag: boolean = false;
  statusSelected: number = 2;
  searchValue: string = "";
  modalRef!: NgbModalRef;
  selectedIndex: number = 0;
  confirmModalRef!: NgbModalRef;

  constructor(private sharedService: SharedService, private managerService: ManagerService, private modalService: NgbModal) { }

  private loadReports() {
    this.isLoading = true;
    
    this.sharedService.getReportUser(this.searchValue, this.statusSelected, this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let reportUsers: ReportUser[] = res.items;
        this.reportUsers = reportUsers;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setUserByStatus(id: string, status: number) {
    this.managerService.setRecipeByStatus(id, status).subscribe({
      next: (res:any) => {
        this.loadReports();
        this.confirmModalRef.close();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setReportStatus(id: string, userId: string, status: number) {
    this.sharedService.acceptReportUser(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            this.setUserByStatus(userId, 0);
            this.confirmModalRef.close();
          } else {
            this.loadReports();
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showUser(userId: string, reportId: string) {
    this.modalRef = this.modalService.open(ModalUserComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = userId;
    this.modalRef.componentInstance.reportId = reportId;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  showPopup(content, index: number) {
    this.selectedIndex = index;
    this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  confirmDelete() {
    this.setReportStatus(this.reportUsers[this.selectedIndex].id, this.reportUsers[this.selectedIndex].userId, 2);
  }

  submitFunc() {
    this.loadReports();
  }

  filterByStatus(status: number) {
    this.statusSelected = status;
    this.loadReports();
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadReports();
  }

  onPageChange(pageNum: number): void {
    this.loadReports();
  }

  ngOnInit(): void {
    this.loadReports();
  }

}
