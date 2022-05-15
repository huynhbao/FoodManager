import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin-dashboard/admin/admin.component';
import { AuthGuard } from './helpers/auth.guard';
import { ManagerComponent } from './manager-dashboard/manager/manager.component';
import { ChangePasswordComponent } from './shared/pages/change-password/change-password.component';
import { CodeConfirmComponent } from './shared/pages/code-confirm/code-confirm.component';
import { ForgotPasswordComponent } from './shared/pages/forgot-password/forgot-password.component';
import { LoginComponent } from './shared/pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'code-confirm', component: CodeConfirmComponent},
  { path: 'change-password', component: ChangePasswordComponent},
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
