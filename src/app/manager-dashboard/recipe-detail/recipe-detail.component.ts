import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Recipe } from 'src/app/models/recipe.model';
import { User } from 'src/app/models/user.model';
import { ManagerService } from 'src/app/services/manager.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe!: Recipe;
  isLoading: boolean = true;

  constructor(private managerService: ManagerService, private route: ActivatedRoute, private router: Router, private config: NgbCarouselConfig) {
    config.interval = 0;
  }

  splitDescription(value: string) {
    value = value.replace(/\s/g, '');
    let hashtag = value.split('#').slice(1);
    
    return hashtag;
  }

  private loadRecipe(id: string) {
    this.managerService.getRecipeById(id).subscribe({
      next: (recipe: Recipe) => {
        
        let user: User = {
          id: recipe["userId"],
          fullname: recipe["name"],
          avatarUrl: recipe["userImageUrl"] || "https://i.imgur.com/EreYJ0D.png"
        } 
        this.recipe = recipe;
        this.recipe.user = user;
        console.log(this.recipe);
      },
      error: (error) => {
        //this.router.navigate(['manager/manage/post']);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    if (id) {
      this.loadRecipe(id);
    }
  }

}
