import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportRecipe } from 'src/app/models/report.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalInputComponent } from '../../components/modal-input/modal-input.component';
import { ModalRecipeComponent } from '../../components/modal-recipe/modal-recipe.component';

@Component({
  selector: 'app-report-recipe',
  templateUrl: './report-recipe.component.html',
  styleUrls: ['./report-recipe.component.scss']
})
export class ReportRecipeComponent implements OnInit {
  reportRecipes: ReportRecipe[] = [];
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

  constructor(private sharedService: SharedService, private managerService: ManagerService, private modalService: NgbModal, private authenticationService: AuthenticationService, private toastr: ToastrService) { }

  getRole() {
    return this.authenticationService.currentUserValue.currentUser.role;
  }

  private loadReports() {
    this.isLoading = true;
    
    this.sharedService.getReportRecipe(this.searchValue, this.statusSelected, this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let reportRecipes: ReportRecipe[] = res.items;
        this.reportRecipes = reportRecipes;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setRecipeByStatus(id: string, status: number, reason: string) {
    this.managerService.setRecipeByStatus(id, status, reason).subscribe({
      next: (res:any) => {
        this.loadReports();
        this.confirmModalRef.close();
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Có lỗi xảy ra. Vui lòng thử lại`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setReportStatus(id: string, recipeId: string, status: number, reason: string) {
    this.sharedService.acceptReportRecipe(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            this.setRecipeByStatus(recipeId, 0, reason);
            this.confirmModalRef.close();
          } else {
            this.loadReports();
          }
          this.toastr.success(`Thành công`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Có lỗi xảy ra. Vui lòng thử lại`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showRecipe(recipeId: string, reportId: string, reason: string) {
    this.modalRef = this.modalService.open(ModalRecipeComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = recipeId;

    if (this.statusSelected === 2) {
      this.modalRef.componentInstance.reportId = reportId;
      this.modalRef.componentInstance.reportReason = reason;
      sessionStorage.setItem("recipeId", recipeId);
      this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
      
      this.modalRef.result.then((result) => {
        sessionStorage.setItem("recipeId", "");
      }, (reason) => {
        sessionStorage.setItem("recipeId", "");
      });
    }
  }

  showPopup(content, index: number) {
    this.selectedIndex = index;
    ///this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})

    this.confirmModalRef = this.modalService.open(ModalInputComponent, {ariaLabelledBy: 'modal-basic-title', size: 'md'});
    this.confirmModalRef.componentInstance.id = this.reportRecipes[this.selectedIndex].recipeId;
    this.confirmModalRef.componentInstance.status = 0;
    this.confirmModalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  confirmDelete() {
    const reason: string = this.reportRecipes[this.selectedIndex].title;
    this.setReportStatus(this.reportRecipes[this.selectedIndex].id, this.reportRecipes[this.selectedIndex].recipeId, 2, reason);
  }

  submitFunc(id: string, reason: string, status: number) {
    this.setReportStatus(this.reportRecipes[this.selectedIndex].id, this.reportRecipes[this.selectedIndex].recipeId, 2, reason);
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

  public onPageChange(pageNum: number): void {
    this.loadReports();
  }

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.reportRecipes.length; i++) {
      this.reportRecipes[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.reportRecipes.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.reportRecipes.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    })
    this.numSelected = count;
  }

  ngOnInit(): void {
    this.loadReports();
  }

}
