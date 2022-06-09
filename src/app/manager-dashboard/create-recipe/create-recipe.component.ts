import { HttpClient } from '@angular/common/http';
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
import { filter } from 'rxjs/operators';

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
  constructor(
    private managerService: ManagerService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
      unit: [{value: '', disabled: true}, Validators.required]
    }));

    this.formMethod.push(this.formBuilder.group({
      step: ['', Validators.required],
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
    /* if (
      this.createForm.invalid ||
      this.previews.length === 0 ||
      this.hashtags.length === 0 ||
      this.categories.length === 0
    ) {
      return;
    } */
    //this.isLoading = true;

    const hashtag = '#' + this.hashtags.map((e) => e['value']).join(' #');

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
        ingredientName: ingredientForm.categoryName,
        quantity: c["controls"]["quantity"].value,
        unit: c["controls"]["unit"].value,
        isMain: true,
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
        step: i,
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
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        
      }
    });
    
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
  console.log("🚀 ~ file: create-recipe.component.ts ~ line 319 ~ CreateRecipeComponent ~ onAdding ~ index", tag)
    
    return of(tag);
  }

  onAdd(ingredient, index: number) {
    //console.log("🚀 ~ file: create-recipe.component.ts ~ line 325 ~ CreateRecipeComponent ~ onAdd ~ event", event, index)
    this.formIngredient.controls[index]['controls']['unit'].patchValue(ingredient.unit);
  }

  requestAutocompleteItemsIngredient$ = (text: string): Observable<any> => {
    let arr: any[] = [
      {
        categoryId: 'a03736d9-a346-48ad-a040-d5ddc72dacf3',
        categoryName: 'thịt',
        createDate: '2022-04-19T22:31:54.92',
        id: undefined,
        imageUrl:
          'https://superawesomevectors.com/wp-content/uploads/2016/09/steak-meat-flat-vector-800x566.jpg',
        ingredientName: 'phao câu gà',
        name: 'phao câu gà',
        status: 1,
        unit: 'gram',
      },
    ];
    
    //console.log(this.ingredients[1]);
    /* for (let i = 0; i < this.ingredients.length; i++) {
      const element = this.ingredients[i];
      console.log(element[i]);
      arr.push(element[i]);
    } */
    return this.sharedService.getIngredientDb(text).pipe(
      map((data) => {
        let arr2 = data.items;
        let ids = arr.map(c => c.categoryId);
        arr = arr.concat(arr2.filter(({categoryId}) => !ids.includes(categoryId)))
        const array1 = data.items.filter((val) => !arr.includes(val));
        console.log(arr2);
        return arr2;
      })
    );
    /* return this.sharedService.getIngredientDb("").pipe(
      map(data => {
        data.json()
      }
    )); */
  };

  increaseIngredient() {
    this.formIngredient.push(this.formBuilder.group({
      ingredientName: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: [{value: '', disabled: true}, Validators.required]
    }));
  }

  removeIngredient(index) {
    if (this.formIngredient.length == 1) return;
    this.formIngredient.removeAt(index);
  }

  increaseMethod() {
    this.formMethod.push(this.formBuilder.group({
      step: ['', Validators.required],
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
