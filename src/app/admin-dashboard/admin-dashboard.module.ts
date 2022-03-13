import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { RouterModule } from '@angular/router';
import { AdminDashboardRoutes } from './admin-dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(AdminDashboardRoutes),
  ]
})
export class AdminDashboardModule { }
