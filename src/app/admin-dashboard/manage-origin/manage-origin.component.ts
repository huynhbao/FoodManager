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

  constructor(private adminService: AdminManageService, private modalService: NgbModal, private toastr: ToastrService) { }

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
        thumbnail: false
      },
      {
        key: 'originName',
        name: 't??n xu???t x???',
        type: 'string',
        validator: {
          disabled: false,
          defaultValue: origin?.originName || '',
          valid: Validators.required,
        },
      }
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private submitCreate(form: any) {
    this.isLoading = true;
    const origin: RecipeOrigin = {
      id: "",
      originName: form.originName
    };
    
    this.adminService.createOrigin(origin).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.toastr.success(`???? t???o m???c xu???t x???`);
          this.loadOrigins();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? t???o m???c xu???t x??? n??y`, `???? x???y ra l???i`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private async submitUpdate(form: any) {
    this.isLoading = true;
    const origin: RecipeOrigin = {
      id: form.id,
      originName: form.originName
    };
    console.log(origin);
    this.adminService.updateOrigin(origin).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadOrigins();
          this.toastr.success(`???? c???p nh???t m???c xu???t x???`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? c???p nh???t m???c xu???t x??? n??y`, `???? x???y ra l???i`);
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
          this.toastr.success(`???? x??a m???c xu???t x???`);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Kh??ng th??? x??a m???c xu???t x??? n??y`, `???? x???y ra l???i`);
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
