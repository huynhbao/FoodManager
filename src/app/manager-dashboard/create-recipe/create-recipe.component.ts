import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagModel } from 'ngx-chips/core/tag-model';
import { Observable, of } from 'rxjs';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { TagInputComponent } from 'ngx-chips';
import { Category } from 'src/app/models/category.model';

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
  categoriesDB:Category[] = [];
  hashtags = [];
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
    });
  }

  get f() {
    return this.createForm.controls;
  }

  async createRecipe() {
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

  public requestAutocompleteItems$ = (text: string): Observable<TagModel[]> => {
    console.log('autocomplete', this.selectedTag);
    if (this.selectedTag) {
      return of(
        this.categoriesDB.filter(
          category => category.id === this.selectedTag.id
        )
      );
    }
    return of(this.categoriesDB);
  };

  ngOnInit(): void {
    this.sharedService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categoriesDB = categories;
        console.log(this.categoriesDB);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
