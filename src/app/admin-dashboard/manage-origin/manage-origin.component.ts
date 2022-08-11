import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RecipeOrigin } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';
import { Utils } from 'src/app/shared/tools/utils';

@Component({
  selector: 'app-manage-origin',
  templateUrl: './manage-origin.component.html',
  styleUrls: ['./manage-origin.component.scss']
})
export class ManageOriginComponent implements OnInit {
  origins!: RecipeOrigin[];
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

  public onPageChange(pageNum: number): void {
    this.loadOrigins();
  }

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.origins.length; i++) {
      this.origins[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.origins.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.origins.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    });
    this.numSelected = count;
  }

  triggerModal(method: String, origin?: RecipeOrigin) {
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    } else if (method == 'confirm') {
      content = ModalConfirmComponent;
      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalRef.componentInstance.fromParent = {id: origin?.id, title: origin?.originName};
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
        id: origin?.id,
        imgUrl: origin?.imageUrl || "",
        thumbnail: true
      },
      {
        key: 'originName',
        name: 'tên xuất xứ',
        type: 'string',
        validator: {
          disabled: false,
          defaultValue: origin?.originName || '',
          valid: Validators.required,
        },
      },
      {
        key: 'imageUrl',
        name: 'Ảnh thumbnail',
        type: 'file',
        validator: {
          disabled: false,
          defaultValue: origin?.imageUrl || '',
          valid: "",
        },
      },
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private async submitCreate(form: any, img:string[]) {
    this.isLoading = true;
    const origin: RecipeOrigin = {
      id: "",
      originName: form.originName,
      imageUrl: form.imageUrl,
    };

    await new Promise(resolve => {
      this.sharedService.uploadImage(img[0]).subscribe({
        next: (res:any) => {
          const imgUrl:string = res.secure_url;
          if (imgUrl) {
            origin.imageUrl = imgUrl;
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
    
    this.adminService.createOrigin(origin).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.toastr.success(`Đã tạo mục xuất xứ`);
          this.loadOrigins();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể tạo mục xuất xứ này`, `Đã xảy ra lỗi`);
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
    
    const origin: RecipeOrigin = {
      id: form.id,
      originName: form.originName,
      imageUrl: imgUrl
    };

    if (isNewImg) {
      await new Promise(resolve => {
        this.sharedService.uploadImage(form.imageUrl).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              origin.imageUrl = imgUrl;
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

    this.adminService.updateOrigin(origin).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadOrigins();
          this.toastr.success(`Đã cập nhật mục xuất xứ`);
        } else if (res.code == 204) {
          this.toastr.info(`Không có gì thay đổi`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể cập nhật mục xuất xứ này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private submitDelete(id: string) {
    this.isLoading = true;
    this.adminService.deleteOrigin(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadOrigins();
          this.toastr.success(`Đã xóa mục xuất xứ`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể xóa mục xuất xứ này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  public loadOrigins() {
    this.isLoading = true;
    this.adminService
      .getOrigins(this.searchValue, this.currentPage)
      .subscribe({
        next: (res: any) => {
          this.collectionSize = res.totalItem;
          let origins: RecipeOrigin[] = res.items;
          this.origins = origins;
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
    this.loadOrigins();
  }

  ngOnInit(): void {
    this.loadOrigins();
  }

}
