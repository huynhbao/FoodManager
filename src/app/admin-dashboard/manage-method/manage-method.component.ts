import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RecipeMethod } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-manage-method',
  templateUrl: './manage-method.component.html',
  styleUrls: ['./manage-method.component.scss']
})
export class ManageMethodComponent implements OnInit {
  methods!: RecipeMethod[];
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
    this.loadMethods();
  }

  triggerModal(method: String, recipeMethod?: RecipeMethod) {
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    } else if (method == 'confirm') {
      content = ModalConfirmComponent;
      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalRef.componentInstance.fromParent = {id: recipeMethod?.id, title: recipeMethod?.cookingMethodName};
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
        id: recipeMethod?.id,
        imgUrl: recipeMethod?.imageUrl || "",
        thumbnail: true
      },
      {
        key: 'cookingMethodName',
        name: 'tên phương pháp',
        type: 'string',
        validator: {
          disabled: false,
          defaultValue: recipeMethod?.cookingMethodName || '',
          valid: Validators.required,
        },
      },
      {
        key: 'imageUrl',
        name: 'Ảnh thumbnail',
        type: 'file',
        validator: {
          disabled: false,
          defaultValue: recipeMethod?.imageUrl || '',
          valid: "",
        },
      },
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private async submitCreate(form: any, img:string[]) {
    this.isLoading = true;
    const method: RecipeMethod = {
      id: "",
      cookingMethodName: form.cookingMethodName,
      imageUrl: form.imageUrl,
    };

    await new Promise(resolve => {
      this.sharedService.uploadImage(img[0]).subscribe({
        next: (res:any) => {
          const imgUrl:string = res.secure_url;
          if (imgUrl) {
            method.imageUrl = imgUrl;
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
    
    this.adminService.createMethod(method).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.toastr.success(`Đã tạo phương pháp`);
          this.loadMethods();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể tạo phương pháp này`, `Đã xảy ra lỗi`);
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

    const method: RecipeMethod = {
      id: form.id,
      cookingMethodName: form.cookingMethodName,
      imageUrl: imgUrl
    };

    if (isNewImg) {
      await new Promise(resolve => {
        this.sharedService.uploadImage(form.imageUrl).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              method.imageUrl = imgUrl;
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

    this.adminService.updateMethod(method).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadMethods();
          this.toastr.success(`Đã cập nhật phương pháp`);
        } else if (res.code == 204) {
          this.toastr.info(`Không có gì thay đổi`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật phương pháp này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private submitDelete(id: string) {
    this.isLoading = true;
    this.adminService.deleteMethod(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadMethods();
          this.toastr.success(`Đã xóa phương pháp`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể xóa phương pháp này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadMethods() {
    this.isLoading = true;
    this.adminService
      .getMethods(this.searchValue, this.currentPage)
      .subscribe({
        next: (res: any) => {
          this.collectionSize = res.totalItem;
          let methods: RecipeMethod[] = res.items;
          this.methods = methods;
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
    this.loadMethods();
  }

  ngOnInit(): void {
    this.loadMethods();
  }

}
