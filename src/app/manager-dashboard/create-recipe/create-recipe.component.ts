import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModel } from 'ngx-chips/core/tag-model';
import { map, Observable, of, fromEvent, from } from 'rxjs';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { TagInputComponent } from 'ngx-chips';
import {
  Category,
  RecipeCategory,
  RecipeMethod,
  RecipeOrigin,
} from 'src/app/models/category.model';
import { RecipeIngredient, RecipeCategory as RecipeCategoryMany, RecipeImage, RecipeMethod as RecipeMethod_R, Recipe, CreateRecipe } from 'src/app/models/recipe.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalCreateComponent } from 'src/app/shared/components/modal-create/modal-create.component';
import { Ingredient } from 'src/app/models/ingredient.model';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss'],
})
export class CreateRecipeComponent implements OnInit {
  @ViewChild('tagInput') tagInputRef!: TagInputComponent;
  selectedTag;
  previews: string[] = [];
  selectedFiles?: FileList;
  categories = [];
  categoriesDB: RecipeCategory[] = [];
  origin = [];
  originsDB: RecipeOrigin[] = [];
  method = [];
  methodsDB: RecipeMethod[] = [];
  hashtags = [];
  ingredients: [][] = [];
  ingredientsDB: RecipeIngredient[] = [];
  thumbnailNumber: number = 0;
  createForm: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  isDone: boolean = false;
  validatorsEmpty = [Validators.required];
  modalRef!: NgbModalRef;
  listValue: { id: string; value: string }[] = [];
  
  constructor(
    private managerService: ManagerService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      preparationTime: ['', Validators.required],
      cookingTime: ['', Validators.required],
      serves: ['', Validators.required],
      calories: ['', Validators.required],
      ingredients: this.formBuilder.array([]),
      methods: this.formBuilder.array([]),
    });

    this.formIngredient.push(this.formBuilder.group({
      ingredientName: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: [{value: '', disabled: true}, Validators.required],
      isMain: [false]
    }));

    this.formMethod.push(this.formBuilder.group({
      step: [''],
      content: ['', Validators.required],
      images: this.formBuilder.array([])
    }));
  }

  get f() {
    return this.createForm.controls;
  }

  get formIngredient() { return this.f["ingredients"] as FormArray; }

  get formMethod() { return this.f["methods"] as FormArray; }

  getFormIngredientAt(i: number) {
    return this.formIngredient.at(i) as FormGroup;
  }

  async createRecipe() {
    this.submitted = true;
    
    if (
      this.createForm.invalid ||
      this.previews.length === 0 ||
      this.origin.length === 0 ||
      this.method.length === 0 ||
      this.categories.length === 0 ||
      this.ingredients.length === 0
    ) {
      this.scrollToError();
      this.toastr.error(`Ki???m tra c??c th??ng tin ch??a ??i???n ?????y ?????`, `???? x???y ra l???i`);
      return;
    }
    
    this.isLoading = true;

    let hashtag = "";

    if (this.hashtags.length !== 0) {
      hashtag = '#' + this.hashtags.map((e) => e['value']).join(' #');
    }

    let manyToManyRecipeCategories: RecipeCategoryMany[] = [];
    for (let i = 0; i < this.categories.length; i++) {
      const element = this.categories[i];
      const category:RecipeCategoryMany = {
        recipeCategoryId: element["id"],
        recipeCategoryName: element["recipeCategoryName"]
      }
      manyToManyRecipeCategories.push(category);
    }

    let recipeIngredients: RecipeIngredient[] = [];
    for (let c of this.formIngredient.controls) {
      const ingredientForm = c["controls"]["ingredientName"].value[0];
      const ingredient: RecipeIngredient = {
        ingredientDbid: ingredientForm.id,
        ingredientName: ingredientForm.ingredientName,
        quantity: c["controls"]["quantity"].value,
        unit: c["controls"]["unit"].value,
        isMain: c["controls"]["isMain"].value,
        status: 1
      }
      recipeIngredients.push(ingredient);
    }

    console.log(recipeIngredients);

    let recipeMethods: RecipeMethod_R[] = [];
    for (let i = 0; i < this.formMethod.controls.length; i++) {
      const methodForm = this.formMethod.controls[i]["controls"];
      let recipeMethod: RecipeMethod_R = {
        content: methodForm.content.value,
        recipeMethodImages: [],
        step: i + 1,
        status: 1,
      }

      let recipeImages: RecipeImage[] = [];
      for (let j = 0; j < methodForm.images.controls.length; j++) {
        const img:string = methodForm.images.controls[j].value;
        await new Promise(resolve => {
          let recipeImage:RecipeImage = {
            imageUrl: "",
            orderNumber: i,
            status: 1,
            isThumbnail: i == this.thumbnailNumber,
          }
  
          this.sharedService.uploadImage(img).subscribe({
            next: (res:any) => {
              const imgUrl:string = res.secure_url;
              if (imgUrl) {
                recipeImage.imageUrl = imgUrl
                recipeImages.push(recipeImage);
                resolve("");
              }
            },
            error: (error) => {
              console.log(error);
            }
          });
  
  
        });
      }

      recipeMethod.recipeMethodImages = recipeImages;
      
      recipeMethods.push(recipeMethod);
      
    }

    let recipeImages: RecipeImage[] = [];
    for (let i = 0; i < this.previews.length; i++) {
      await new Promise(resolve => {
        const img = this.previews[i];
        let recipeImage:RecipeImage = {
          imageUrl: "",
          orderNumber: i,
          status: 1,
          isThumbnail: i == this.thumbnailNumber,
        }

        this.sharedService.uploadImage(img).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              recipeImage.imageUrl = imgUrl
              recipeImages.push(recipeImage);
              resolve("");
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      });
      
    }


    let recipe:CreateRecipe = {
      originId: this.origin["0"]["id"],
      cookingMethodId: this.method["0"]["id"],
      recipeName: this.f['name'].value,
      description: this.f['description'].value,
      preparationTime: this.f['preparationTime'].value,
      cookingTime: this.f['cookingTime'].value,
      serves: this.f['serves'].value,
      calories: this.f['calories'].value,
      hashtag: hashtag,
      manyToManyRecipeCategories: manyToManyRecipeCategories,
      manyToManyRecipeNutritions: [],
      recipeImages: recipeImages,
      recipeIngredients: recipeIngredients,
      recipeMethods: recipeMethods
    }
    
    console.log(recipe);

    this.managerService.createRecipe(recipe).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.isDone = true;
          this.toastr.success(`???? th??m c??ng th???c th??nh c??ng`);
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
        this.toastr.error(`Kh??ng th??? th??m c??ng th???c`, `???? x???y ra l???i`);
      },
      complete: () => {
      }
    });
    
    
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    if (this.createForm.invalid) {
      const firstElementWithError = document.querySelector('.ng-invalid[formControlName]')!;
      console.log(firstElementWithError);
      this.scrollTo(firstElementWithError);
      return;
    }
    
    if (this.origin.length === 0) {
      const firstElementWithError = document.querySelector("#origin")!;
      console.log("#origin", firstElementWithError);
      this.scrollTo(firstElementWithError);
      return;
    }

    if (this.method.length === 0) {
      const firstElementWithError = document.querySelector("#method")!;
      console.log(firstElementWithError);
      this.scrollTo(firstElementWithError);
      return;
    }

    if (this.categories.length === 0) {
      const firstElementWithError = document.querySelector("#categories")!;
      console.log(firstElementWithError);
      this.scrollTo(firstElementWithError);
      return;
    }

    if (this.previews.length === 0) {
      const firstElementWithError = document.querySelector("#previews")!;
      console.log(firstElementWithError);
      this.scrollTo(firstElementWithError);
      return;
    }
    
  }

  selectFilesMethod(event: any, index: number): void {
    this.selectedFiles = event.target.files;
    
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.formMethod.controls[index]['controls']['images'].push(new FormControl(e.target.result, Validators.required));
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  removeImgMethod(indexMethod, i) {
    this.formMethod.controls[indexMethod]['controls']['images'].removeAt(i);
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  removeImgPreview(item) {
    var index = this.previews.indexOf(item);
    this.previews.splice(index, 1);
  }

  setThumbnail(index) {
    this.thumbnailNumber = index;
  }

  onTagSelected(event) {
    this.selectedTag = event;
    this.tagInputRef.dropdown.show();
  }

  requestAutocompleteItemsMethod$ = (text: string): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.methodsDB.filter((method) => method.id === this.selectedTag.id)
      );
    }
    return of(this.methodsDB);
  };

  requestAutocompleteItemsOrigin$ = (text: string): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.originsDB.filter((origin) => origin.id === this.selectedTag.id)
      );
    }
    return of(this.originsDB);
  };

  requestAutocompleteItemsCategory$ = (
    text: string
  ): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.categoriesDB.filter(
          (category) => category.id === this.selectedTag.id
        )
      );
    }
    return of(this.categoriesDB);
  };

  newIngredient:string = "";

  onAdding(tag: TagModel): Observable<TagModel> {
    if (tag["ingredientDbid"] === 1) {
      this.newIngredient = tag["ingredientName"];
      /* new Promise((resolve, reject) => {
        console.log(this.modalService);
        this.modalRef = this.modalService.open(ModalCreateComponent, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          windowClass: 'appcustom-modal',
          backdrop: 'static',
        });
        resolve("")
      });
      this.modalService.open(ModalCreateComponent, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        windowClass: 'appcustom-modal',
        backdrop: 'static',
      });
      of(this.modalRef);
      console.log(1);
      this.modalRef.componentInstance.fromParent = [
        {
          id: "",
          imgUrl: "",
          thumbnail: true
        },
        {
          key: 'ingredientName',
          name: 'T??n nguy??n li???u',
          type: 'string',
          validator: {
            disabled: false,
            defaultValue: "",
            valid: Validators.required,
          },
        },
        {
          key: 'unit',
          name: '????n v???',
          type: 'string',
          validator: {
            disabled: false,
            defaultValue: "",
            valid: Validators.required,
          },
        },
        {
          key: 'category',
          name: 'T??n danh m???c',
          type: 'boolean',
          value: this.listValue,
          validator: {
            disabled: false,
            defaultValue: this.listValue[0],
            valid: Validators.required,
          },
        },
        {
          key: 'imageUrl',
          name: '???nh thumbnail',
          type: 'file',
          validator: {
            disabled: false,
            defaultValue: "",
            valid: "",
          },
        },
      ];
      this.modalRef.componentInstance.submitFunc = this.createIngredientCb.bind(this); */
    }
    return of(tag);
  }

  onAdd(ingredient, index: number) {
    this.formIngredient.controls[index]['controls']['unit'].patchValue(ingredient.unit);
  }

  requestAutocompleteItemsIngredient$ = (text: string): Observable<any> => {
    return this.sharedService.getIngredientDb(text).pipe(
      map((data) => {
        let arr2 = data.items;
        const addOption = {
          ingredientDbid: 1,
          ingredientName: "Th??m nguy??n li???u: " + text
        }

        let match:boolean = false;
        for (let i = 0; i < arr2.length; i++) {
          const element = arr2[i];
          if (element.ingredientName == text) {
            match = true;
            break;
          }
        }

        if (!match) {
          arr2.push(addOption);
        }
        
        return arr2;
      })
    );
  };

  private createIngredientCb(form: any, img:string[]) {
    this.isLoading = true;
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
                //this.loadIngredients();
                this.toastr.success(`???? t???o nguy??n li???u`);
                //this.modalRef.close();
              }
            },
            error: (error) => {
              this.toastr.error(`Kh??ng th??? t???o nguy??n li???u n??y`, `???? x???y ra l???i`);
              console.log(error);
            },
            complete: () => {
              this.isLoading = false;
            }
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  increaseIngredient() {
    this.formIngredient.push(this.formBuilder.group({
      ingredientName: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: [{value: '', disabled: true}, Validators.required],
      isMain: [false]
    }));
  }

  removeIngredient(index) {
    if (this.formIngredient.length == 1) return;
    this.formIngredient.removeAt(index);
  }

  increaseMethod() {
    this.formMethod.push(this.formBuilder.group({
      step: [''],
      content: ['', Validators.required],
      images: this.formBuilder.array([])
    }));
  }

  removeMethod(index) {
    if (this.formMethod.length == 1) return;
    this.formMethod.removeAt(index);
  }

  ngOnInit(): void {
    this.sharedService.getRecipeCategories(50).subscribe({
      next: (categories: any) => {
        this.categoriesDB = categories.items;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.sharedService.getRecipeMethod(50).subscribe({
      next: (methods: any) => {
        this.methodsDB = methods.items;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.sharedService.getRecipeOrigin(50).subscribe({
      next: (origins: any) => {
        this.originsDB = origins.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  print(value) {
    console.log(value);
  }
}
