import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class AdminManageService {
  private searchSrc = new BehaviorSubject<string>('');
  currentSearch = this.searchSrc.asObservable();
  baseUrl = environment.apiUrl
  
  constructor(private http: HttpClient) {}

  changeSearchValue(value: string) {
    this.searchSrc.next(value);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `https://fooma.free.beeceptor.com/categories`
    );
  }
}
