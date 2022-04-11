import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminManageService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>("https://fooma.free.beeceptor.com/categories");
  }
}
