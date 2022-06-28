import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageMethodComponent } from './manage-method/manage-method.component';
import { ManageOriginComponent } from './manage-origin/manage-origin.component';
import { ManageRecipeCategoryComponent } from './manage-recipe-category/manage-recipe-category.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const AdminDashboardRoutes: Routes = [
  { path: '', redirectTo: 'user',  pathMatch:'full' },
  { path: 'user', component: ManageUserComponent},
  { path: 'category', component: ManageCategoryComponent},
  { path: 'origin', component: ManageOriginComponent},
  { path: 'method', component: ManageMethodComponent},
  { path: 'recipe-category', component: ManageRecipeCategoryComponent},
];