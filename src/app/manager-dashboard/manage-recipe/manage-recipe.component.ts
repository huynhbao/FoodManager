import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-manage-recipe',
  templateUrl: './manage-recipe.component.html',
  styleUrls: ['./manage-recipe.component.scss']
})
export class ManageRecipeComponent implements OnInit {
  recipes: Recipe[] = [];
  listHashtag: string[] = ["All"];
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
  constructor(private managerService: ManagerService, private route: ActivatedRoute, public router: Router, private sharedService: SharedService) {
  }

  private loadRecipes() {
    this.isLoading = true;
    
    this.managerService.getRecipes(this.search, this.statusSelected, this.listHashtag[this.hastagSelected], this.currentPage).subscribe({
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

  setRecipeByStatus(id: string, status: number) {
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
    let hashtagParam = this.route.snapshot.params['hashtag'];
    if (hashtagParam) {
      this.loadHashtag("#" + hashtagParam);
    } else {
      this.loadRecipes();
    }
  }

}
