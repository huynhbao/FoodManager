import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ROUTES_ADMIN, ROUTES_MANAGER } from '../sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminManageService } from 'src/app/services/admin-manage.service';
import { AppConst } from '../../constants/app-const';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public focus?: boolean;
  public listTitles!: any[];
  public location: Location;
  title: string = 'Dashboard';
  constructor(
    location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private adminManageService: AdminManageService
  ) {
    this.location = location;
  }

  ngOnInit() {
    let role = this.authenticationService.currentUserValue.currentUser.role;
    if (role == AppConst.ADMIN_STR) {
      this.listTitles = ROUTES_ADMIN.filter(menuItem => menuItem);
    } else if (role == AppConst.MANAGER_STR) {
      this.listTitles = ROUTES_MANAGER.filter(menuItem => menuItem);
    }
  }

  getUser() {
    return this.authenticationService.currentUserValue;
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    titlee = titlee.split('/')[2];
    /* this.listTitles.forEach(item => {
      if (item.path == titlee) {
        return item.title;
      } else if (item.child !== undefined) {
        console.log(item.child);
        item.child.forEach(child => {
          if (child.path == titlee) {
            return child.title;
          }
        });
      }
    });
 */
    return 'Dashboard';
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
