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
  child?: RouteInfo[];
  isCollapsed?: boolean;
}
export const ROUTES_ADMIN: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: 'manage-user', title: 'Manage Users',  icon:'ni-bullet-list-67 text-red', class: '' },
  { path: 'manage-category', title: 'Manage category',  icon:'ni-bullet-list-67 text-info', class: '' },
];

export const ROUTES_MANAGER: RouteInfo[] = [
  { path: 'dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: '', title: 'Posts - Receipes',  icon:'ni-bullet-list-67 text-success', class: '', child: [
    { path: 'manage', title: 'Manage',  icon:'', class: '' },
    { path: 'pending-post', title: 'Pending Post',  icon:'', class: '' },
  ]},
  { path: '', title: 'Ingredients',  icon:'ni-bullet-list-67 text-info', class: '', child: [
    { path: 'ingredient', title: 'Manage',  icon:'', class: '' },
  ]},
  { path: 'category', title: 'View report list',  icon:'ni-bullet-list-67 text-danger', class: '' }
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

  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }

  activeNav(index) {
    this.menuItems.forEach(menuItem => {
      menuItem.isCollapsed = true;
    });
    this.menuItems[index].isCollapsed = !this.menuItems[index].isCollapsed;
    console.log(this.menuItems[index].isCollapsed);
  }

  ngOnInit(): void {
    let role = this.authenticationService.currentUserValue.currentUser.role;
    if (role == AppConst.ADMIN_STR) {
      this.menuItems = ROUTES_ADMIN.filter(menuItem => menuItem);
    } else if (role == AppConst.MANAGER_STR) {
      this.menuItems = ROUTES_MANAGER.filter(menuItem => menuItem);
    }
    const path = this.router.url.split("/")[2];
    this.menuItems.forEach(menuItem => {
      menuItem.isCollapsed = true;
      if (menuItem.path == path) {
        menuItem.isCollapsed = false;
      } else if (menuItem.child) {
        menuItem.child.forEach(child => {
          if (child.path == path) {
            menuItem.isCollapsed = false;
          }
        });
      }
    });
    //this.router.url.split("/")[2];
    //this.isCollapsed = false;
    /* this.router.events.subscribe((event) => {
       this.isCollapsed = true;
    }); */
  }

}
