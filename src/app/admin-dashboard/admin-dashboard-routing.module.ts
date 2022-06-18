import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageOriginComponent } from './manage-origin/manage-origin.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const AdminDashboardRoutes: Routes = [
  { path: '', redirectTo: 'user',  pathMatch:'full' },
  { path: 'user', component: ManageUserComponent},
  { path: 'category', component: ManageCategoryComponent},
  { path: 'origin', component: ManageOriginComponent},
];