import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReportRecipe } from 'src/app/models/report.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
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

  constructor(private sharedService: SharedService, private managerService: ManagerService, private modalService: NgbModal, private authenticationService: AuthenticationService) { }

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

  setRecipeByStatus(id: string, status: number) {
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

  setReportStatus(id: string, recipeId: string, status: number) {
    this.sharedService.acceptReportRecipe(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          if (status === 2) {
            this.setRecipeByStatus(recipeId, 0);
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

  showRecipe(recipeId: string, reportId: string) {
    this.modalRef = this.modalService.open(ModalRecipeComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = recipeId;
    this.modalRef.componentInstance.reportId = reportId;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  showPopup(content, index: number) {
    this.selectedIndex = index;
    this.confirmModalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  confirmDelete() {
    this.setReportStatus(this.reportRecipes[this.selectedIndex].id, this.reportRecipes[this.selectedIndex].recipeId, 2);
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
