import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';
import { SharedService } from 'src/app/services/shared.service';
import { ModalRecipeComponent } from 'src/app/shared/components/modal-recipe/modal-recipe.component';

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recipes: Recipe[] = [];
  collectionSize: any = {
    recipe_system: 0,
    ingredient: 0,
    post: 0,
    post_recipe: 0,
    report_post: 0,
    report_recipe: 0
  };
  isLoading: boolean = true;
  modalRef!: NgbModalRef;

  constructor(private managerService: ManagerService, private sharedService: SharedService, private modalService: NgbModal, private toastr: ToastrService) {
  }

  showRecipe(recipeId: string) {
    this.modalRef = this.modalService.open(ModalRecipeComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'appcustom-modal'});
    this.modalRef.componentInstance.id = recipeId;
    this.modalRef.componentInstance.showActionSystem = false;
    //const id = sessionStorage.getItem("recipeId");
    this.modalRef.result.then((result) => {
      sessionStorage.setItem("recipeId", "");
    }, (reason) => {
      sessionStorage.setItem("recipeId", "");
    });
  }
  
  private loadRecipes(role: number) {
      this.managerService.getRecipesSort("", 1, 1, role, "TotalRatingPoint", "ASC").subscribe({
        next: (res:any) => {
          if (role === 0) {
            this.collectionSize.post_recipe = res.totalItem;
          } else if (role === 1) {
            this.collectionSize.recipe_system = res.totalItem;
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
            console.log(this.recipes);
          }
          
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      });
  }

  private loadIngredients() {
    this.sharedService
      .getIngredientDb("", 0)
      .subscribe({
        next: (res: any) => {
          this.collectionSize.ingredient = res.totalItem;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
        }
      });
  }

  private loadPosts() {
    this.managerService.getPosts("", 1, 0).subscribe({
      next: (res:any) => {
        this.collectionSize.post = res.totalItem;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
  }

  private loadPostReports() {
    this.sharedService.getReportPost("", 2, 0).subscribe({
      next: (res:any) => {
        this.collectionSize.report_post = res.totalItem;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
  }

  private loadRecipeReports() {
    this.sharedService.getReportRecipe("", 2, 0).subscribe({
      next: (res:any) => {
        this.collectionSize.report_recipe = res.totalItem;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
      }
    });
  }

  //report_post: 0,
  //report_recipe: 0

  private async loadData() {
    this.isLoading = true;
    await new Promise(resolve => {
      this.loadRecipes(1);
      resolve("");
    });

    await new Promise(resolve => {
      this.loadIngredients();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadPosts();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadRecipes(0);
      resolve("");
    });

    await new Promise(resolve => {
      this.loadPostReports();
      resolve("");
    });

    await new Promise(resolve => {
      this.loadRecipeReports();
      resolve("");
    });

    this.isLoading = false;
    
  }

  ngOnInit() {
    this.loadData();
  }

}
