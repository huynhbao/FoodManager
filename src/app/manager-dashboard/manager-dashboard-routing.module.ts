import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageIngredientComponent } from '../shared/pages/manage-ingredient/manage-ingredient.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { ManageRecipeComponent } from './manage-recipe/manage-recipe.component';
import { ManagementComponent } from './management/management.component';
import { PendingPostComponent } from './pending-post/pending-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage',
    children: [
      {
        path:'',
        redirectTo: 'post',
        pathMatch: 'full' 
      },
      {
        path: 'post', component: ManagePostComponent,
      },
      {
        path: 'post/:id', component: PostDetailComponent
      },
      {
        path: 'post/hashtag/:hashtag', component: ManagePostComponent,
      },
      {
        path: 'recipe', component: ManageRecipeComponent,
      },
      {
        path: 'recipe/:id', component: RecipeDetailComponent
      },
    ]
  },
  { path: 'pending-post', component: PendingPostComponent },
  { path: 'ingredient', component: ManageIngredientComponent },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerDashboardRoutingModule {}
