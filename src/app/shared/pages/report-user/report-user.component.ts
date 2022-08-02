import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportUser } from 'src/app/models/report.model';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalBanUserComponent } from '../../components/modal-ban-user/modal-ban-user.component';
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

  constructor(private sharedService: SharedService, private managerService: ManagerService, private modalService: NgbModal, private toastr: ToastrService, private authenticationService: AuthenticationService) { }

  getRole() {
    return this.authenticationService.currentUserValue.currentUser.role;
  }
  
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

  setReportStatus(id: string) {
    this.sharedService.acceptReportUser(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.loadReports();
          this.toastr.success(`Đã bỏ qua báo cáo`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể thực hiện hành động này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  banUser(reportUser: ReportUser, index: number) {
    this.selectedIndex = index;
    const user:User = {
      id: reportUser.reportedUserId,
      name: reportUser.reportedUserName
    }
    this.modalRef = this.modalService.open(ModalBanUserComponent, {ariaLabelledBy: 'modal-basic-title'});
    this.modalRef.componentInstance.user = user;
    this.modalRef.componentInstance.reportId = reportUser.id;
    this.modalRef.componentInstance.submitFunc = this.submitBanUser.bind(this);
  }

  submitBanUser(reportId: string) {
    this.sharedService.acceptReportUser(reportId).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.loadReports();
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

  /* confirmDelete() {
    this.setReportStatus(this.reportUsers[this.selectedIndex].id, this.reportUsers[this.selectedIndex].userId, 2);
  } */

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
