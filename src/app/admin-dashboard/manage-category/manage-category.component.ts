import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/internal/operators/map';
import { Category } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {

  public listCategory: Category[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  collectionSize = 0;
  listStatus: string[] = ["Enable", "Disable"];
  selectedStatus: string = this.listStatus[0];
  selectedCategory?: Category;
  searchValue: string = '';
  isLoading: boolean = false;
  modalRef!: NgbModalRef;
  
  constructor(private formBuilder: FormBuilder, private adminService: AdminManageService, private sharedService: SharedService, private modalService: NgbModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.isLoading = true;
    this.adminService.getCategories(this.searchValue, this.currentPage).subscribe({
      next: (res: any) => {
        this.collectionSize = res.totalItem;
        let listCategory: Category[] = res.items;
        this.listCategory = listCategory;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public onPageChange(pageNum: number): void {
    this.loadCategories();
  }

  public changePagesize(num: number): void {
    
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadCategories();
  }

  triggerModal(method: String, category?: Category) {
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    } else if (method == 'confirm') {
      content = ModalConfirmComponent;
      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalRef.componentInstance.fromParent = {id: category?.id, title: category?.categoryName};
      this.modalRef.componentInstance.submitFunc = this.submitDelete.bind(this);
      return;
    }

    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal', backdrop: 'static' });
    this.modalRef.componentInstance.fromParent = [
      {
        id: category?.id,
        imgUrl: category?.imageUrl || "",
        thumbnail: true
      },
      {
        key: "categoryName",
        name: "tên danh mục",
        type: "string",
        validator: {
          disabled: false,
          defaultValue: category?.categoryName || "",
          valid: Validators.required
        }
      },
      {
        key: 'imageUrl',
        name: 'Ảnh thumbnail',
        type: 'file',
        validator: {
          disabled: false,
          defaultValue: category?.imageUrl || '',
          valid: "",
        },
      },
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private async submitCreate(form: any, img:string[]) {
    this.isLoading = true;
    const category: Category = {
      id: "",
      categoryName: form.categoryName,
      imageUrl: form.imageUrl,
    };

    await new Promise(resolve => {
      this.sharedService.uploadImage(img[0]).subscribe({
        next: (res:any) => {
          const imgUrl:string = res.secure_url;
          if (imgUrl) {
            category.imageUrl = imgUrl;
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
    
    this.adminService.createCategory(category).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.toastr.success(`Đã tạo danh mục thành công`);
          this.loadCategories();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể tạo danh mục này`, `Đã xảy ra lỗi`);
        this.isLoading = false;
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
    
    const category: Category = {
      id: form.id,
      categoryName: form.categoryName,
      imageUrl: imgUrl
    };

    if (isNewImg) {
      await new Promise(resolve => {
        this.sharedService.uploadImage(form.imageUrl).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              category.imageUrl = imgUrl;
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

    this.adminService.updateCategory(category).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadCategories();
          this.toastr.success(`Đã cập nhật danh mục thành công`);
        } else if (res.code == 204) {
          this.toastr.info(`Không có gì thay đổi`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật danh mục này`, `Đã xảy ra lỗi`);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private submitDelete(id: string) {
    this.isLoading = true;
    this.adminService.deleteCategory(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadCategories();
          this.toastr.success(`Đã xóa danh mục này`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể xóa danh mục này`, `Đã xảy ra lỗi`);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
