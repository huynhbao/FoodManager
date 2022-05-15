import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ForGotData {
  email: string;
  code: string
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl
  private forgotData = new BehaviorSubject<ForGotData>({email: "", code: ""});
  currentForgotData = this.forgotData.asObservable();
  
  constructor(private http: HttpClient) { }

  public get getForgotData() {
    return this.forgotData.value;
  }

  public changeForgotDataValue(value: ForGotData) {
    this.forgotData.next(value);
  }

  public forgotPassInit(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-pass-init`, {email: email});
  }

  public forgotPassValidate(code: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-pass-validate`, {email: this.getForgotData.email, code: code});
  }

  public forgotPassComplete(password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/forgot-pass-complete`, {email: this.getForgotData.email, code: this.getForgotData.code, password: password});
  }
}
