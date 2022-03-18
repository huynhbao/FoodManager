import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
  //{ path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
  //{ path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
  //{ path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
  //{ path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' }
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
    this.roleStr = this.authenticationService.currentUserValue.role;
    this.menuItems = ROUTES_ADMIN.filter(menuItem => menuItem);
    // this.router.events.subscribe((event) => {
    //   this.isCollapsed = true;
    // });
  }

}
