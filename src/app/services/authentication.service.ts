import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;
  baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(
        localStorage.getItem('currentUser')!
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return JSON.parse(this.currentUserSubject.value);
  }

  public setCurrentUserValue(userInfo) {
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    this.currentUserSubject.next(JSON.stringify(userInfo));
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${this.baseUrl}/auth/login-system`, {
        email: username,
        password: password,
      })
      .pipe(
        map((res: any) => {
          if (res) {
            const currentUser = helper.decodeToken(res.token);
            
            
            let userInfo = {
              token: res.token,
              currentUser: currentUser
            }
            localStorage.setItem('currentUser', JSON.stringify(userInfo));
            this.currentUserSubject.next(JSON.stringify(userInfo));
            return userInfo;
          } else {
            throw new Error();
          }
        })
      );
    /* .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            })); */
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null!);
  }
}
