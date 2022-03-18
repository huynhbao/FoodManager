import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ROUTES_ADMIN } from '../sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public focus?: boolean;
  public listTitles!: any[];
  public location: Location;
  constructor(location: Location, private element: ElementRef, private router: Router, private authenticationService: AuthenticationService) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES_ADMIN.filter(listTitle => listTitle);
  }

  getUser() {
    return this.authenticationService.currentUserValue;
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    titlee = titlee.split('/')[2];
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
