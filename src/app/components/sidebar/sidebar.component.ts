import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppConst } from 'src/app/shared/constants/app-const';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES_ADMIN: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: 'manage-user', title: 'Manage Users',  icon:'ni-bullet-list-67 text-red', class: '' },
  { path: 'manage-category', title: 'Manage category',  icon:'ni-bullet-list-67 text-info', class: '' },
];

export const ROUTES_MANAGER: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: 'manage-user', title: 'Manage Post',  icon:'ni-bullet-list-67 text-success', class: '' },
  { path: 'manage-category', title: 'Manage recipe',  icon:'ni-bullet-list-67 text-info', class: '' },
  { path: 'manage-category', title: 'View report list',  icon:'ni-bullet-list-67 text-danger', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems!: any[];
  public isCollapsed = true;
  public roleStr!: string;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    let role = this.authenticationService.currentUserValue.role;
    if (role == AppConst.ADMIN_STR) {
      this.menuItems = ROUTES_ADMIN.filter(menuItem => menuItem);
    } else if (role == AppConst.MANAGER_STR) {
      this.menuItems = ROUTES_MANAGER.filter(menuItem => menuItem);
    }
    
    // this.router.events.subscribe((event) => {
    //   this.isCollapsed = true;
    // });
  }

}
