import { Routes } from '@angular/router';
import { ProfileComponent } from '../shared/pages/profile/profile.component';
import { ReportPostComponent } from '../shared/pages/report-post/report-post.component';
import { ReportRecipeComponent } from '../shared/pages/report-recipe/report-recipe.component';
import { ReportUserComponent } from '../shared/pages/report-user/report-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBanUserComponent } from './manage-ban-user/manage-ban-user.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageMethodComponent } from './manage-method/manage-method.component';
import { ManageNotifyComponent } from './manage-notify/manage-notify.component';
import { ManageOriginComponent } from './manage-origin/manage-origin.component';
import { ManageRecipeCategoryComponent } from './manage-recipe-category/manage-recipe-category.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const AdminDashboardRoutes: Routes = [
  { path: '', redirectTo: 'dashboard',  pathMatch:'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'category', component: ManageCategoryComponent},
  { path: 'origin', component: ManageOriginComponent},
  { path: 'method', component: ManageMethodComponent},
  { path: 'recipe-category', component: ManageRecipeCategoryComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'user',
    children: [
      {
        path:'',
        redirectTo: 'active',
        pathMatch: 'full' 
      },
      {
        path: 'active', component: ManageUserComponent,
      },
      {
        path: 'ban', component: ManageBanUserComponent,
      }
    ]
  },
  { path: 'report',
    children: [
      {
        path:'',
        redirectTo: 'post',
        pathMatch: 'full' 
      },
      {
        path: 'post', component: ReportPostComponent,
      },
      {
        path: 'recipe', component: ReportRecipeComponent,
      },
    ]
  },
  {
    path: 'notify', component: ManageNotifyComponent,
  }
];