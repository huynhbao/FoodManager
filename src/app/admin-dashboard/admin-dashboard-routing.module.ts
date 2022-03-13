import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const AdminDashboardRoutes: Routes = [
  { path: 'manage-user',      component: ManageUserComponent },
];

/* @NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeDashboardRoutingModule { } */
