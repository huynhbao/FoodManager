import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TagInputComponent } from 'ngx-chips';
import { TagModel } from 'ngx-chips/core/tag-model';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { RecipeMethod, RecipeOrigin } from 'src/app/models/category.model';
import { Recipe, RecipeCategory as RecipeCategoryMany } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalConfirmComponent } from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { ModalInputComponent } from 'src/app/shared/components/modal-input/modal-input.component';
import { ModalRecipeComponent } from 'src/app/shared/components/modal-recipe/modal-recipe.component';

@Component({
  selector: 'app-manage-recipe',
  templateUrl: './manage-recipe.component.html',
  styleUrls: ['./manage-recipe.component.scss']
})
export class ManageRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  listHashtag: string[] = ["Hashtag"];
  listCategory: RecipeCategoryMany[] = [];
  listCategoryDB: RecipeCategoryMany[] = [];
  listCountry: RecipeOrigin[] = [];
  listCountryDB: RecipeOrigin[] = [];
  listMethod: RecipeMethod[] = [];
  listMethodDB: RecipeMethod[] = [];
  listTime = [];
  currentPage: number = 1;
  itemsPerPage = 5;
  pageSize: number = 10;
  collectionSize: number = 0;
  masterSelected: boolean = false;
  numSelected: number = 0;
  hastagSelected: number = 0;
  isLoading: boolean = false;
  isLoadingHashtag: boolean = false;
  search: string = "";
  statusSelected: number = 1;
  isCollapsed = true;
  @ViewChild('tagInput') tagInputRef!: TagInputComponent;
  selectedTag;
  modalRef!: NgbModalRef;

  constructor(private managerService: ManagerService, private route: ActivatedRoute, public router: Router, private sharedService: SharedService, private modalService: NgbModal, private toastr: ToastrService) {
  }

  initFilter() {
    if (!this.isCollapsed) {
      this.loadItemDB();
    }
  }

  onTagSelected(event) {
    this.selectedTag = event;
    this.tagInputRef.dropdown.show();
  }

  validators = [ Validators.pattern("^[0-9]*$") ];

  requestAutocompleteItemsCategory$ = (text: string): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.listCategoryDB.filter((category) => category.recipeCategoryId === this.selectedTag.id)
      );
    }
    return of(this.listCategoryDB);
  };

  requestAutocompleteItemsCountry$ = (text: string): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.listCountryDB.filter((country) => country.id === this.selectedTag.id)
      );
    }
    return of(this.listCountryDB);
  };

  requestAutocompleteItemsMethod$ = (text: string): Observable<TagModel[]> => {
    if (this.selectedTag) {
      return of(
        this.listMethodDB.filter((method) => method.id === this.selectedTag.id)
      );
    }
    return of(this.listMethodDB);
  };

  loadItemDB() {
    this.sharedService.getRecipeCategories(50).subscribe({
      next: (categories: any) => {
        this.listCategoryDB = categories.items;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.sharedService.getRecipeMethod(50).subscribe({
      next: (methods: any) => {
        this.listMethodDB = methods.items;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.sharedService.getRecipeOrigin(50).subscribe({
      next: (origins: any) => {
        this.listCountryDB = origins.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  searchByFilter() {
    let hashTag: string = "";
    let category: string = "";
    let country: string = "";
    let method: string = "";
    let time: string = "";

    if (this.listCategory.length !== 0) {
      category = this.listCategory[0]["id"];
    }

    if (this.listCountry.length !== 0) {
      country = this.listCountry[0].id;
    }

    if (this.listMethod.length !== 0) {
      method = this.listMethod[0].id;
    }

    if (this.listTime.length !== 0) {
      time = this.listTime[0]["value"];
    }

    if (this.hastagSelected !== 0) {
      hashTag = this.listHashtag[this.hastagSelected].replace("#", "");
    }
    
    this.isLoading = true;
    
    this.managerService.getRecipesByFilter(this.search, this.statusSelected, hashTag, category, country, method, time, this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let recipes: Recipe[] = res.items;
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          let user: User = {
            id: recipe['userId'],
            fullname: recipe['name'],
            avatarUrl: recipe['userImageUrl'],
            role: recipe['role']
          };
          recipe.user = user;
        });
        
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private loadRecipes() {
    this.isLoading = true;
    
    this.managerService.getRecipes(this.search, this.statusSelected, this.currentPage).subscribe({
      next: (res:any) => {
        this.collectionSize = res.totalItem;
        let recipes: Recipe[] = res.items;
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          let user: User = {
            id: recipe['userId'],
            fullname: recipe['name'],
            avatarUrl: recipe['userImageUrl'],
            role: recipe['role']
          };
          recipe.user = user;
        });
        
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  filterByStatus(status: number) {
    this.statusSelected = status;
    this.hastagSelected = 0;
    this.currentPage = 1;
    this.loadRecipes();
  }

  onSearchChange(searchValue) {
    this.search = searchValue;
    this.currentPage = 1;
    this.loadRecipes();
  }

  loadHashtag(hashtagParam?: string) {
    if (this.listHashtag.length !== 1) {
      return
    }
    this.isLoadingHashtag = true;
    this.managerService.getHashtag().subscribe({
      next: (res) => {
        this.listHashtag = ["All"];
        this.listHashtag =  [...this.listHashtag, ...res.items];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        for (let i = 0; i < this.listHashtag.length; i++) {
          const hashtag = this.listHashtag[i];
          if (hashtag == hashtagParam) {
            this.hastagSelected = i;
            this.filterHashtag(i);
            break
          }
        }
        this.isLoadingHashtag = false;
      }
    });
  }

  filterHashtag(index: number) {
    this.isLoading = true;
    this.hastagSelected = index;
    let hastagValue: string = this.listHashtag[index].replace("#", "");
    if (index == 0) {
      hastagValue = "";
    }
    
    this.managerService.getPostsByHashtag(hastagValue, this.currentPage = 0).subscribe({
      next: (res:any) => {
        this.recipes = [];
        this.collectionSize = res.totalItem;
        let recipes: Recipe[] = res.items;
        this.recipes = recipes;
        this.recipes.forEach(recipe => {
          let user: User = {
            id: recipe['userId'],
            fullname: recipe['name'],
            avatarUrl: recipe['userImageUrl'],
            role: recipe['role']
          };
          recipe.user = user;
        });
        
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  showPopupConfirm(recipe: Recipe) {
    this.modalRef = this.modalService.open(ModalConfirmComponent, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.componentInstance.fromParent = {id: recipe.id, title: recipe.recipeName};
    this.modalRef.componentInstance.submitFunc = this.showPopupConfirmCb.bind(this);
  }

  showPopupConfirmCb(id:string) {
    this.setRecipeByStatus(id, 0);
    this.modalRef.close();
  }

  showPopup(id: string, status: number) {
    this.modalRef = this.modalService.open(ModalInputComponent, {ariaLabelledBy: 'modal-basic-title', size: 'md'});
    this.modalRef.componentInstance.id = id;
    this.modalRef.componentInstance.status = status;
    this.modalRef.componentInstance.submitFunc = this.submitFunc.bind(this);
  }

  showRecipe(recipeId: string) {
    this.modalRef = this.modalService.open(ModalRecipeComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = recipeId;
    this.modalRef.componentInstance.showAction = true;
    this.modalRef.componentInstance.submitFunc = this.loadRecipes.bind(this);
  }

  setRecipeByStatus(id: string, status: number, reason?: string) {
    this.isLoading = true;
    const recipe = this.recipes.find((x) => x.id === id);
    
    if (!recipe) return;
    
    this.managerService.setRecipeByStatus(id, status, reason).subscribe({
      next: (res:any) => {
        console.log(res);
        if (res.code == 200) {
          this.recipes = this.recipes.filter((x) => x.id !== id);
          if (status === 0) {
            this.toastr.success(`Đã xóa bài viết`);
          } else if (status === 1) {
            this.toastr.success(`Đã kích hoạt bài viết`);
          } else if (status === 3) {
            this.toastr.success(`Đã từ chối bài viết`);
          }
          this.loadRecipes();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(`Không thể thực hiện hành động này`, `Đã xảy ra lỗi`);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  submitFunc(id: string, reason: string, status: number) {
    this.setRecipeByStatus(id, status, reason);
    this.modalRef.close();
  }


  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    return hashtag;
  }

  public checkUncheckAll() {
    for (var i = 0; i < this.recipes.length; i++) {
      this.recipes[i].isSelected = this.masterSelected;
    }
    this.numSelected = this.masterSelected ? this.recipes.length : 0;
  }

  // Check All Checkbox Checked
  public isAllSelected() {
    let count = 0;
    this.masterSelected = this.recipes.every(function (item: any) {
      if (item.isSelected == true) {
        count++;
      }
      return item.isSelected == true;
    })
    this.numSelected = count;
  }

  public onPageChange(pageNum: number): void {
    //this.pageSize = this.itemsPerPage * (pageNum - 1);
    this.loadRecipes();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log(id);
    if (id) {
      this.showRecipe(id);
    } else {
      this.loadRecipes();
    }
  }

}
