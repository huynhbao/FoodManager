import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { RouterModule } from '@angular/router';
import { HomeDashboardRoutes } from './home-dashboard-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ManageUserComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(HomeDashboardRoutes),
  ]
})
export class HomeDashboardModule { }
