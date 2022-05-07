import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../services/authentication.service';

const helper = new JwtHelperService();

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            let currentTime = new Date();
            let tokenExpirationTime = helper.getTokenExpirationDate(currentUser.token);
            console.log(tokenExpirationTime);
            if (tokenExpirationTime && tokenExpirationTime.getTime() > currentTime.getTime()) {
                return true;
            }
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}