import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/internal/operators/map';
import { Category } from 'src/app/models/category.model';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { ModalUpdateComponent } from 'src/app/shared/components/modal-update/modal-update.component';

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
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private adminManageService: AdminManageService) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.adminManageService.getCategories(this.searchValue, this.currentPage).subscribe({
      next: (res: any) => {
        this.collectionSize = res.totalItem;
        let listCategory: Category[] = res.items;
        this.listCategory = listCategory;
      },
      error: (error) => {
        console.log(error);
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

  triggerModal(method: String, dto: any) {
    // this.categoryForm.reset();
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    }

    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal', backdrop: 'static' });
    modalRef.componentInstance.fromParent = [
      //new Category(0, "", new Date(), false),
      {},
      {
        key: "id",
        name: "ID",
        type: "string",
        validator: {
          disabled: true,
          defaultValue: dto.id ?? "",
          valid: Validators.required
        }
      },
      {
        key: "name",
        name: "Name",
        type: "string",
        validator: {
          disabled: false,
          defaultValue: dto.name ?? "",
          valid: Validators.required
        }
      },
      {
        key: "status",
        name: "Status",
        type: "boolean",
        value: ["Enable", "Disable"],
        validator: {
          disabled: false,
          defaultValue: dto.status !== undefined ? (dto.status == 1 ? "Enable" : "Disable") : "Enable",
          valid: Validators.required
        }
      },
    ];
    modalRef.result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCofirmModal(content: any, category: Category) {
    this.selectedCategory = category;
    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }



  changeSelectStatus(selectedStatus: string) {
    this.selectedStatus = selectedStatus;
  }

  updateCategory(category: Category) {
    this.selectedCategory = category;
    /* this.categoryForm.setValue({
      categoryID: this.selectedCategory.$id,
      categoryName: this.selectedCategory.$name
    }); */
    const modalRef = this.modalService.open(ModalCreateComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal' });
    modalRef.result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
