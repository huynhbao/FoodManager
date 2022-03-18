import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const AdminDashboardRoutes: Routes = [
  { path: '', redirectTo: 'dashboard',  pathMatch:'full' },
  { path: 'dashboard',      component: DashboardComponent},
  { path: 'manage-user',      component: ManageUserComponent },
  { path: 'manage-category',      component: ManageCategoryComponent },
];