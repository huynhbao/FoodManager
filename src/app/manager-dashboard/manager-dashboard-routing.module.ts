import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { ManagementComponent } from './management/management.component';
import { PendingPostComponent } from './pending-post/pending-post.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'manage', component: ManagementComponent,
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
        path: 'recipe', component: ManagePostComponent,
      }
    ]
  },
  { path: 'pending-post', component: PendingPostComponent },
  { path: 'post/:id', component: PostDetailComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerDashboardRoutingModule {}
