import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModel } from 'ngx-chips/core/tag-model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
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
import { RecipeIngredient } from 'src/app/models/recipe.model';
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
      unit: ['', Validators.required]
    }));

    this.formMethod.push(this.formBuilder.group({
      step: ['', Validators.required],
      content: ['', Validators.required]
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
    console.log(this.formIngredient);
    this.submitted = true;
    if (
      this.createForm.invalid ||
      this.previews.length === 0 ||
      this.hashtags.length === 0 ||
      this.categories.length === 0
    ) {
      return;
    }
    this.isLoading = true;

    const hashtag = '#' + this.hashtags.map((e) => e['value']).join(' #');

    
    //this.ingredients.filter((value, i) => {console.log(value.some(e => e["categoryId"] === '1aebc7b1-94fa-4883-9b8e-bffc9a2525b9'))});
    /* let postImages:Image[] = []; 
    for (let i = 0; i < this.previews.length; i++) {
      
      await new Promise(resolve => {
        const img = this.previews[i];
        let postImage: Image = {
          orderNumber: i,
          imageUrl: "",
          isThumbnail: i == this.thumbnailNumber,
          status: 1
        }

        this.sharedService.uploadImage(img).subscribe({
          next: (res:any) => {
            const imgUrl:string = res.secure_url;
            if (imgUrl) {
              postImage.imageUrl = imgUrl
              postImages.push(postImage);
              resolve("");
            }
          },
          error: (error) => {
            console.log(error);
          }
        });


      });
      
    }
    let post:CreatePost = {
      title: this.f['title'].value,
      content: this.f['content'].value,
      hashtag: hashtag,
      postImages: postImages
    }

    this.managerService.createPost(post).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.isDone = true;
          //this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        
      }
    }); */
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
    //const confirm = window.confirm('Do you really want to add this tag?');
    return of(tag).pipe(
      map((value) => {
        for (let i = 0; i < this.ingredients.length; i++) {
          const element = this.ingredients[i];
          console.log(element);
        }
        return tag;
      })
    );
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
        console.log(arr.concat(arr2.filter(({categoryId}) => !ids.includes(categoryId))));
        const array1 = data.items.filter((val) => !arr.includes(val));
        // console.log(arr, array1);
        return arr2;
      })
    );
    /* return this.sharedService.getIngredientDb("").pipe(
      map(data => {
        data.json()
      }
    )); */
  };

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formMethod.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.formMethod.value, event.previousIndex, event.currentIndex);
  }

  increaseIngredient() {
    this.formIngredient.push(this.formBuilder.group({
      ingredientName: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required]
    }));
  }

  removeIngredient(index) {
    if (this.formIngredient.length == 1) return;
    this.formIngredient.removeAt(index);
  }

  increaseMethod() {
    this.formMethod.push(this.formBuilder.group({
      step: ['', Validators.required],
      content: ['', Validators.required]
    }));
  }

  removeMethod(index) {
    if (this.formMethod.length == 1) return;
    this.formMethod.removeAt(index);
  }

  ngOnInit(): void {
    /* let ingredient: RecipeIngredient = {
      ingredientDbid: '',
      ingredientName: '',
      quantity: 0,
      isMain: false,
      status: 1,
    };
    this.ingredientsDB.push(ingredient); */

    /* this.sharedService.getIngredientDb("").pipe(
      map(data => {
        //data.items.json();
        console.log(data.items);
      }
    )).subscribe({
      next: (categories: any) => {
        console.log(categories);
      },
      error: (error) => {
        console.log(error);
      }
    });; */
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
