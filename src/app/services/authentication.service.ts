import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { Utils } from '../shared/tools/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(
        localStorage.getItem('currentUser')!
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return JSON.parse(this.currentUserSubject.value);
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`https://foomaapp.ddns.net/api/auth/login-system`, {
        email: username,
        password: password,
      })
      .pipe(
        map((res: any) => {
          if (res) {
            const tokenInfo = JSON.stringify(Utils.getDecodedAccessToken(res.token));
            localStorage.setItem('currentUser', tokenInfo);
            this.currentUserSubject.next(tokenInfo);
            return JSON.parse(tokenInfo);
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
