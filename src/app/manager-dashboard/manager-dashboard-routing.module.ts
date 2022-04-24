import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { PendingPostComponent } from './pending-post/pending-post.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard',  pathMatch:'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'manage-post', component: ManagePostComponent},
  { path: 'pending-post', component: PendingPostComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerDashboardRoutingModule { }
