import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, pipe } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from '../../components/modal-confirm/modal-confirm.component';
import { ModalCreateComponent } from '../../components/modal-create/modal-create.component';
import { ModalUpdateComponent } from '../../components/modal-update/modal-update.component';
import { Utils } from '../../tools/utils';

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
    } else if (method == 'confirm') {
      content = ModalConfirmComponent;
      this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
      this.modalRef.componentInstance.fromParent = {id: ingredient?.id, title: ingredient?.ingredientName};
      this.modalRef.componentInstance.submitFunc = this.submitDelete.bind(this);
      return;
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
            id: ingredient?.id,
            imgUrl: ingredient?.imageUrl || "" 
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
          {
            key: 'imageUrl',
            name: 'Upload Image',
            type: 'file',
            validator: {
              disabled: false,
              defaultValue: ingredient?.imageUrl ||'',
              valid: "",
            },
          },
        ];
        this.modalRef.componentInstance.submitFunc = method == "create" ? this.submitCreate.bind(this) : this.submitUpdate.bind(this);
      }
    });
    
  }

  private submitCreate(form: any, img:string[]) {
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
    this.sharedService.uploadImage(img[0]).subscribe({
      next: (res:any) => {
        const imgUrl:string = res.secure_url;
        if (imgUrl) {
          ingredient.imageUrl = imgUrl;
          this.sharedService.createIngredientDB(ingredient).subscribe({
            next: (res:any) => {
              console.log(res);
              if (res.code == 200) {
                this.modalService.dismissAll();
                this.loadIngredients();
                //this.modalRef.close();
              }
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    })
  }

  private async submitUpdate(form: any, imgUrl: string) {
    let isNewImg: boolean = false;
    if (form.imageUrl != imgUrl) {
      await Utils.getBase64ImageFromUrl(imgUrl).then(base64 => {
        if (base64 != form.imageUrl) {
          isNewImg = true;
        }
      })
    }

    const ingredient: Ingredient = {
      id: form.id,
      categoryId: form.category.id,
      ingredientName: form.ingredientName,
      createDate: new Date(),
      imageUrl: imgUrl, //form.imageUrl,
      status: 1,
      categoryName: form.category.value,
      unit: form.unit,
    };

    if (isNewImg) {
       this.sharedService.uploadImage(form.imageUrl).subscribe({
        next: (res:any) => {
          const imgUrl:string = res.secure_url;
          if (imgUrl) {
            ingredient.imageUrl = imgUrl;
            this.sharedService.updateIngredientDB(ingredient).subscribe({
              next: (res:any) => {
                console.log(res);
                if (res.code == 200 || res.code == 204) {
                  this.modalService.dismissAll();
                  this.loadIngredients();
                }
              },
              error: (error) => {
                console.log(error);
              },
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      })
    } else {
      this.sharedService.updateIngredientDB(ingredient).subscribe({
        next: (res:any) => {
          console.log(res);
          if (res.code == 200 || res.code == 204) {
            this.modalService.dismissAll();
            this.loadIngredients();
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
    
  }

  private submitDelete(id: string) {
    this.sharedService.deleteIngredientDB(id).subscribe({
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

  onSearchChange(searchValue) {
    this.searchValue = searchValue;
    this.currentPage = 1;
    this.loadIngredients();
  }

  ngOnInit(): void {
    this.loadIngredients();
  }
}
