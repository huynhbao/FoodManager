import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(private adminService: AdminManageService, private sharedService: SharedService, private modalService: NgbModal,) { }

  public onPageChange(pageNum: number): void {
    this.loadRecipe();
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
        id: origin?.id
      },
      {
        key: 'originName',
        name: 'Origin Name',
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
    const origin: RecipeOrigin = {
      id: "",
      originName: form.originName
    };
    
    this.adminService.createOrigin(origin).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipe();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private async submitUpdate(form: any) {
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
          this.loadRecipe();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private submitDelete(id: string) {
    this.adminService.deleteOrigin(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadRecipe();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public loadRecipe() {
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
      });
  }

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadRecipe();
  }

  ngOnInit(): void {
    this.loadRecipe();
  }

}
