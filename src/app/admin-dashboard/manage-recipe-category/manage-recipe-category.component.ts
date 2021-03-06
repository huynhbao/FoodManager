import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RecipeCategory } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';

@Component({
  selector: 'app-manage-recipe-category',
  templateUrl: './manage-recipe-category.component.html',
  styleUrls: ['./manage-recipe-category.component.scss']
})
export class ManageRecipeCategoryComponent implements OnInit {
  recipeCategories!: RecipeCategory[];
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  searchValue: string = '';
  modalRef!: NgbModalRef;
  isLoading: boolean = false;

  constructor(private adminService: AdminManageService, private modalService: NgbModal, private toastr: ToastrService) { }

  onPageChange(pageNum: number): void {
    this.loadRecipeCategories();
  }

  triggerModal(method: String, recipeCategory?: RecipeCategory) {
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    } else if (method == 'confirm') {
      content = ModalConfirmComponent;
      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalRef.componentInstance.fromParent = {id: recipeCategory?.id, title: recipeCategory?.recipeCategoryName};
      this.modalRef.componentInstance.submitFunc = this.submitDelete.bind(this);
      return;
    }

    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'appcustom-modal',
      backdrop: 'static',
    });
    
    this.modalRef.componentInstance.fromParent = [
      {
        id: recipeCategory?.id,
        thumbnail: false
      },
      {
        key: 'recipeCategoryName',
        name: 't??n danh m???c c??ng th???c',
        type: 'string',
        validator: {
          disabled: false,
          defaultValue: recipeCategory?.recipeCategoryName || '',
          valid: Validators.required,
        },
      }
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private submitCreate(form: any) {
    this.isLoading = true;
    const recipeCategory: RecipeCategory = {
      id: "",
      recipeCategoryName: form.recipeCategoryName
    };
    
    this.adminService.createRecipeCategory(recipeCategory).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
          this.toastr.success(`???? t???o danh m???c c??ng th???c`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? t???o danh m???c c??ng th???c n??y`, `???? x???y ra l???i`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private async submitUpdate(form: any) {
    this.isLoading = true;
    const recipeCategory: RecipeCategory = {
      id: form.id,
      recipeCategoryName: form.recipeCategoryName
    };

    this.adminService.updateRecipeCategory(recipeCategory).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
          this.toastr.success(`???? c???p nh???t danh m???c c??ng th???c`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? c???p nh???t danh m???c c??ng th???c n??y`, `???? x???y ra l???i`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private submitDelete(id: string) {
    this.isLoading = true;
    this.adminService.deleteRecipeCategory(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
          this.toastr.success(`???? x??a danh m???c c??ng th???c`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? x??a danh m???c c??ng th???c n??y`, `???? x???y ra l???i`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadRecipeCategories() {
    this.isLoading = true;
    this.adminService
      .getRecipeCategory(this.searchValue, this.currentPage)
      .subscribe({
        next: (res: any) => {
          this.collectionSize = res.totalItem;
          let recipeCategories: RecipeCategory[] = res.items;
          this.recipeCategories = recipeCategories;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadRecipeCategories();
  }

  ngOnInit(): void {
    this.loadRecipeCategories();
  }

}
