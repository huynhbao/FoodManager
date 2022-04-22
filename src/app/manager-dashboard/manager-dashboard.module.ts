import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerDashboardRoutingModule } from './manager-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagePostComponent } from './manage-post/manage-post.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    DashboardComponent,
    ManagePostComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ManagerDashboardRoutingModule
  ]
})
export class ManagerDashboardModule { }
