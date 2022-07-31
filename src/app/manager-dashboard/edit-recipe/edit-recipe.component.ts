import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModel } from 'ngx-chips/core/tag-model';
import { map, Observable, of } from 'rxjs';
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
import { User } from 'src/app/models/user.model';
import { AppConst } from 'src/app/shared/constants/app-const';
import { Utils } from 'src/app/shared/tools/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss']
})
export class EditRecipeComponent implements OnInit {
  @ViewChild('tagInput') tagInputRef!: TagInputComponent;
  selectedTag;
  previews: string[] = [];
  selectedFiles?: FileList;
  categories:RecipeCategoryMany[] = [];
  categoriesDB: RecipeCategory[] = [];
  origin:RecipeOrigin[] = [];
  originsDB: RecipeOrigin[] = [];
  method:RecipeMethod[] = [];
  methodsDB: RecipeMethod[] = [];
  hashtags:string[] = [];
  ingredientsDB: RecipeIngredient[] = [];
  thumbnailNumber: number = 0;
  form!: FormGroup;
  submitted: boolean = false;
  isGettingData: boolean = true;
  isLoading: boolean = false;
  isDone: boolean = false;
  recipe!:Recipe;
  constructor(private managerService: ManagerService, private sharedService: SharedService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      preparationTime: ['', Validators.required],
      cookingTime: ['', Validators.required],
      serves: ['', Validators.required],
      calories: ['', Validators.required],
      ingredients: this.formBuilder.array([]),
      methods: this.formBuilder.array([]),
    });
  }

  get f() {
    return this.form.controls;
  }

  get formIngredient() { return this.f["ingredients"] as FormArray; }

  get formMethod() { return this.f["methods"] as FormArray; }

  loadItemDB() {
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

  mapToForm(recipe: Recipe) {
    this.form.setValue({
      name: recipe.recipeName,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      serves: recipe.serves,
      calories: recipe.calories,
      ingredients: [],
      methods: [],
    });

    recipe.recipeIngredients.forEach(ingredient => {
      this.formIngredient.push(this.formBuilder.group({
        id: [ingredient.ingredientDbid, Validators.required],
        ingredientName: [
          [{
            id: ingredient.ingredientDbid,
            ingredientName: ingredient.ingredientName
          }]
        ],
        quantity: [ingredient.quantity, Validators.required],
        unit: [{value: ingredient.unit, disabled: true}, Validators.required],
        isMain: [ingredient.isMain]
      }));
    });

    for (let i = 0; i < recipe.recipeMethods.length; i++) {
      const method = recipe.recipeMethods[i];
      this.formMethod.push(this.formBuilder.group({
        step: [method.step, Validators.required],
        content: [method.content, Validators.required],
        images: this.formBuilder.array([]),
      }));
      method.recipeMethodImages.forEach(image => {
        this.formMethod.controls[i]['controls']['images'].push(new FormControl(image.imageUrl, Validators.required));
      })
    }

    recipe.manyToManyRecipeCategories.forEach(category => {
      this.categories.push(category);
    });

    const origin:RecipeOrigin = {
      id: recipe.originId,
      originName: recipe.originName,
    }
    this.origin.push(origin);

    const method:RecipeMethod = {
      id: recipe.cookingMethodId,
      cookingMethodName: recipe.cookingMethodName
    }
    this.method.push(method);
    
    if (recipe.hashtag != "#") {
      const hashtag = recipe.hashtag.replace(/\s/g, '').split('#').slice(1);
      this.hashtags = hashtag;
    }

    for (let i = 0; i < recipe.recipeImages.length; i++) {
      const recipeImage = recipe.recipeImages[i];
      if (recipeImage.isThumbnail) {
        this.thumbnailNumber = i;
      }
      this.previews.push(recipeImage.imageUrl);
    }
    console.log(recipe);
    
    
  }


  async updateRecipe() {
    this.submitted = true;
    if (
      this.form.invalid ||
      this.previews.length === 0 ||
      this.categories.length === 0
    ) {
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
        recipeCategoryId: element["recipeCategoryId"],
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
        let recipeImage:RecipeImage = {
          imageUrl: img,
          orderNumber: i,
          status: 1,
          isThumbnail: i == this.thumbnailNumber,
        }

        if (!Utils.isURL(img)) {
          await new Promise(resolve => {
            this.sharedService.uploadImage(img).subscribe({
              next: (res:any) => {
                const imgUrl:string = res.secure_url;
                if (imgUrl) {
                  recipeImage.imageUrl = imgUrl
                  resolve("");
                }
              },
              error: (error) => {
                console.log(error);
              }
            });
          });
        }
        recipeImages.push(recipeImage);
      }

      recipeMethod.recipeMethodImages = recipeImages;
      
      recipeMethods.push(recipeMethod);
      
    }

    let recipeImages: RecipeImage[] = [];
    for (let i = 0; i < this.previews.length; i++) {
      const img = this.previews[i];
      let recipeImage:RecipeImage = {
        imageUrl: img,
        orderNumber: i,
        status: 1,
        isThumbnail: i == this.thumbnailNumber,
      }

      if (!Utils.isURL(img)) {
        await new Promise(resolve => {
          this.sharedService.uploadImage(img).subscribe({
            next: (res:any) => {
              const imgUrl:string = res.secure_url;
              if (imgUrl) {
                recipeImage.imageUrl = imgUrl
                resolve("");
              }
            },
            error: (error) => {
              console.log(error);
            }
          });
        });
      }
      recipeImages.push(recipeImage);

      
    }

    this.isLoading = false;
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
      recipeImages: recipeImages,
      recipeIngredients: recipeIngredients,
      recipeMethods: recipeMethods,
      manyToManyRecipeNutritions: []
    }

    this.managerService.updateRecipe(this.recipe.id, recipe).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.isDone = true;
          this.toastr.success(`Đã cập nhật công thức`);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
        this.toastr.error(`Không thể cập nhật công thức`);
      }
    });
  }

  print(value) {
    console.log(value)
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

  onAdding(tag: TagModel): Observable<TagModel> {
    console.log(this.thumbnailNumber);
    /* for (let c of this.formIngredient.controls) {
      const ingredientForm = c["controls"]["ingredientName"].value[0];
      console.log(tag["id"], ingredientForm.id);
      if (tag["id"] == ingredientForm.id) {
        return of();
      }
    } */
    return of(tag);
  }

  onAdd(ingredient, index: number) {
    this.formIngredient.controls[index]['controls']['unit'].patchValue(ingredient.unit);
  }

  requestAutocompleteItemsIngredient$ = (text: string): Observable<any> => {
    return this.sharedService.getIngredientDb(text).pipe(
      map((data) => {
        return data.items;
      })
    );
  };

  increaseIngredient() {
    this.formIngredient.push(this.formBuilder.group({
      ingredientName: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: [{value: '', disabled: true}, Validators.required],
      isMain: [false],
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

  loadRecipe(id: string) {
    this.managerService.getRecipeById(id).subscribe({
      next: (recipe: Recipe) => {
        let user: User = {
          id: recipe["userId"],
          fullname: recipe["name"],
          avatarUrl: recipe["userImageUrl"] || "https://i.imgur.com/EreYJ0D.png",
          role: recipe["role"]
        }

        if (user.role == AppConst.ADMIN_STR || user.role == AppConst.MANAGER_STR) {
          recipe.user = user;
          this.recipe = recipe;
          this.loadItemDB();
          this.mapToForm(recipe);
        }
        
      },
      error: (error) => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.isGettingData = false;
      },
      complete: () => {
        this.isGettingData = false;
      }
    });
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.loadRecipe(id);
    }  else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    
  }

}
