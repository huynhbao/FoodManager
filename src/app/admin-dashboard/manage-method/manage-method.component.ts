import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RecipeMethod } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';

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

  constructor(private adminService: AdminManageService, private modalService: NgbModal) { }

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
        id: recipeMethod?.id
      },
      {
        key: 'cookingMethodName',
        name: 'Cooking Method Name',
        type: 'string',
        validator: {
          disabled: false,
          defaultValue: recipeMethod?.cookingMethodName || '',
          valid: Validators.required,
        },
      }
    ];
    this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
  }

  private submitCreate(form: any) {
    const method: RecipeMethod = {
      id: "",
      cookingMethodName: form.cookingMethodName
    };
    
    this.adminService.createMethod(method).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadMethods();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private async submitUpdate(form: any) {
    const method: RecipeMethod = {
      id: form.id,
      cookingMethodName: form.cookingMethodName
    };

    this.adminService.updateMethod(method).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadMethods();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private submitDelete(id: string) {
    this.adminService.deleteMethod(id).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadMethods();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadMethods() {
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