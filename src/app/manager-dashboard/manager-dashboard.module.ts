import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
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
import { faClock, faUsers, faFire } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    DashboardComponent,
    ManagePostComponent,
    PendingPostComponent,
    ManagementComponent,
    PostDetailComponent,
    ManageIngredientComponent,
    TimePipe,
    ManageRecipeComponent,
    RecipeDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
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
      faFire
    );
  }
}
