import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { RouterModule } from '@angular/router';
import { AdminDashboardRoutes } from './admin-dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/modules/shared/shared.module';
import { ManageOriginComponent } from './manage-origin/manage-origin.component';
import { ManageMethodComponent } from './manage-method/manage-method.component';
import { ManageRecipeCategoryComponent } from './manage-recipe-category/manage-recipe-category.component';


@NgModule({
  declarations: [
    ManageUserComponent,
    DashboardComponent,
    ManageCategoryComponent,
    FilterPipe,
    ManageOriginComponent,
    ManageMethodComponent,
    ManageRecipeCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    RouterModule.forChild(AdminDashboardRoutes),
  ]
})
export class AdminDashboardModule { }
