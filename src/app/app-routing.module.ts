import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin-dashboard/admin/admin.component';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager-dashboard/manager/manager.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
      }
    ]
  },
  {
    path: 'manager',
    component: ManagerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/manager-dashboard/manager-dashboard.module').then(m => m.ManagerDashboardModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
