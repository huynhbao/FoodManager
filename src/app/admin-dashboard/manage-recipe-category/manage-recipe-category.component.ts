import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private adminService: AdminManageService, private modalService: NgbModal) { }

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
        id: recipeCategory?.id
      },
      {
        key: 'recipeCategoryName',
        name: 'tên danh mục công thức',
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
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private async submitUpdate(form: any) {
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
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private submitDelete(id: string) {
    this.adminService.deleteRecipeCategory(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadRecipeCategories() {
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
