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
import { ManageIngredientComponent } from '../shared/pages/manage-ingredient/manage-ingredient.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ManagePostComponent,
    PendingPostComponent,
    ManagementComponent,
    PostDetailComponent,
    ManageIngredientComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ManagerDashboardRoutingModule
  ]
})
export class ManagerDashboardModule { }
