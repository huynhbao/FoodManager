import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RecipeCategory } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';
import { Utils } from 'src/app/shared/tools/utils';

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

  constructor(private adminService: AdminManageService, private sharedService: SharedService, private modalService: NgbModal, private toastr: ToastrService) { }

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
        imgUrl: recipeCategory?.imageUrl || "",
        thumbnail: true
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
      },
      {
        key: 'imageUrl',
        name: 'Ảnh thumbnail',
        type: 'file',
        validator: {
          disabled: false,
          defaultValue: recipeCategory?.imageUrl || 'assets/img/thumb/default_thumbnail.png',
          valid: "",
        },
      },
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private async submitCreate(form: any, img:string[]) {
    this.isLoading = true;
    const recipeCategory: RecipeCategory = {
      id: "",
      recipeCategoryName: form.recipeCategoryName,
      imageUrl: form.imageUrl,
    };

    await new Promise(resolve => {
      this.sharedService.uploadImage(img[0]).subscribe({
        next: (res:any) => {
          const imgUrl:string = res.secure_url;
          if (imgUrl) {
            recipeCategory.imageUrl = imgUrl;
            resolve("");
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      })
    });

    this.adminService.createRecipeCategory(recipeCategory).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
          this.toastr.success(`Đã tạo danh mục công thức`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể tạo danh mục công thức này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private async submitUpdate(form: any, imgUrl: string) {
    this.isLoading = true;
    
    let isNewImg: boolean = false;
    if (form.imageUrl != imgUrl) {
      await Utils.getBase64ImageFromUrl(imgUrl).then(base64 => {
        if (base64 != form.imageUrl) {
          isNewImg = true;
        }
      })
    }

    const recipeCategory: RecipeCategory = {
      id: form.id,
      recipeCategoryName: form.recipeCategoryName,
      imageUrl: imgUrl
    };

    if (isNewImg) {
      await new Promise(resolve => {
        this.sharedService.uploadImage(form.imageUrl).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              recipeCategory.imageUrl = imgUrl;
              resolve("");
            }
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
          }
        })
      });
    }

    this.adminService.updateRecipeCategory(recipeCategory).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipeCategories();
          this.toastr.success(`Đã cập nhật danh mục công thức`);
        } else if (res.code == 204) {
          this.toastr.info(`Không có gì thay đổi`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật danh mục công thức này`, `Đã xảy ra lỗi`);
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
          this.toastr.success(`Đã xóa danh mục công thức`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể xóa danh mục công thức này`, `Đã xảy ra lỗi`);
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
