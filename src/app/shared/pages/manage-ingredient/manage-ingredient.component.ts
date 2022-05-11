import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, pipe } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalCreateComponent } from '../../components/modal-create/modal-create.component';
import { ModalUpdateComponent } from '../../components/modal-update/modal-update.component';

@Component({
  selector: 'app-manage-ingredient',
  templateUrl: './manage-ingredient.component.html',
  styleUrls: ['./manage-ingredient.component.scss'],
})
export class ManageIngredientComponent implements OnInit {
  ingredients!: Ingredient[];
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  searchValue: string = '';
  modalRef!: NgbModalRef;

  constructor(
    private managerService: ManagerService,
    private sharedService: SharedService,
    private modalService: NgbModal,
  ) {}

  public onPageChange(pageNum: number): void {
    this.loadIngredients();
  }

  public changePagesize(num: number): void {
    this.itemsPerPage = this.pageSize + num;
  }

  // The master checkbox will check/ uncheck all items
  public checkUncheckAll() {
    for (var i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.ingredients.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.ingredients.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    });
    this.numSelected = count;
  }

  triggerModal(method: String, ingredient?: Ingredient) {
    // this.categoryForm.reset();
    let content: any = ModalCreateComponent;
    if (method == 'create') {
      content = ModalCreateComponent;
    } else if (method == 'update') {
      content = ModalUpdateComponent;
    }
    let listValue: { id: string; value: string }[] = [];

    this.sharedService.getCategories().subscribe({
      next: (categorys: Category[]) => {
        categorys.forEach((category) => {
          listValue.push({ id: category.id, value: category.categoryName });
        });
        listValue.sort((a, b) => a.value.localeCompare(b.value));
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.modalRef = this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          windowClass: 'appcustom-modal',
          backdrop: 'static',
        });
        
        this.modalRef.componentInstance.fromParent = [
          {
            id: ingredient?.id
          },
          {
            key: 'ingredientName',
            name: 'Ingredient Name',
            type: 'string',
            validator: {
              disabled: false,
              defaultValue: ingredient?.ingredientName || '',
              valid: Validators.required,
            },
          },
          {
            key: 'imageUrl',
            name: 'Image URL',
            type: 'string',
            validator: {
              disabled: false,
              defaultValue: ingredient?.imageUrl ||'',
              valid: Validators.required,
            },
          },
          {
            key: 'unit',
            name: 'Unit',
            type: 'string',
            validator: {
              disabled: false,
              defaultValue: ingredient?.unit || '',
              valid: Validators.required,
            },
          },
          {
            key: 'category',
            name: 'Category Name',
            type: 'boolean',
            value: listValue,
            validator: {
              disabled: false,
              defaultValue: ingredient?.categoryId ? listValue.find(v => v.id == ingredient?.categoryId) : listValue[0],
              valid: Validators.required,
            },
          },
        ];
        this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate : this.submitUpdate;
      }
    });
    
  }

  private submitCreate(form: any) {
    const ingredient: Ingredient = {
      id: '',
      categoryId: form.category.id,
      ingredientName: form.ingredientName,
      createDate: new Date(),
      imageUrl: form.imageUrl,
      status: 1,
      categoryName: form.category.value,
      unit: form.unit,
    };
    this.modalService.dismissAll();
    this.loadIngredients();
    /* this.sharedService.createIngredientDB(ingredient).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalRef.close();
        }
      },
      error: (error) => {
        console.log(error);
      },
    }); */
  }

  private submitUpdate(form: any) {
    const ingredient: Ingredient = {
      id: form.id,
      categoryId: form.category.id,
      ingredientName: form.ingredientName,
      createDate: new Date(),
      imageUrl: form.imageUrl,
      status: 1,
      categoryName: form.category.value,
      unit: form.unit,
    };
    this.sharedService.updateIngredientDB(ingredient).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.modalService.dismissAll();
          this.loadIngredients();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public loadIngredients() {
    this.sharedService
      .getIngredientDb(this.searchValue, this.currentPage)
      .subscribe({
        next: (res: any) => {
          this.collectionSize = res.totalItem;
          let ingredients: Ingredient[] = res.items;
          this.ingredients = ingredients;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnInit(): void {
    this.loadIngredients();
  }
}
