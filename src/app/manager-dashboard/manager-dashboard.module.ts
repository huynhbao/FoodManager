import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingPostComponent } from './pending-post/pending-post.component';
import { ManagementComponent } from './management/management.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { TimePipe } from '../shared/pipes/time.pipe';
import { ManageIngredientComponent } from '../shared/pages/manage-ingredient/manage-ingredient.component';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { ManageRecipeComponent } from './manage-recipe/manage-recipe.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faClock as farClock,
} from '@fortawesome/free-regular-svg-icons';
import { faClock, faUsers, faFire, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { CreatePostComponent } from './create-post/create-post.component';
import { TagInputModule } from 'ngx-chips';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { ManageRecipeAdministratorComponent } from './manage-recipe-administrator/manage-recipe-administrator.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { EditPostComponent } from './edit-post/edit-post.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManagePostComponent,
    PendingPostComponent,
    ManagementComponent,
    PostDetailComponent,
    ManageIngredientComponent,
    ManageRecipeComponent,
    RecipeDetailComponent,
    CreatePostComponent,
    CreateRecipeComponent,
    ManageRecipeAdministratorComponent,
    EditRecipeComponent,
    EditPostComponent,
  ],
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ManagerDashboardRoutingModule,
    SharedModule,
    FontAwesomeModule,
  ]
})
export class ManagerDashboardModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faClock,
      farClock,
      faUsers,
      faFire,
      faCheckCircle
    );
  }
}
