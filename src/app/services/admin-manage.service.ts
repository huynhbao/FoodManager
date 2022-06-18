import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Category, RecipeOrigin } from '../models/category.model';

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

  getCategories(page: number): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${this.baseUrl}/category?page=${page}&size=5`
    );
  }

  getUsers(search: string = "", status: number, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/user/users?name=${search}&status=${status}&page=${page}&size=5`
    );
  }

  //origin
  getOrigins(search: string = "", page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/reciperelate/origin?page=${page}&size=5`
    );
  }

  createOrigin(origin: RecipeOrigin): Observable<RecipeOrigin> {
    return this.http.post<RecipeOrigin>(`${this.baseUrl}/reciperelate/origin`, origin);
  }

  updateOrigin(origin: RecipeOrigin): Observable<RecipeOrigin> {
    return this.http.put<RecipeOrigin>(`${this.baseUrl}/reciperelate/origin${origin.id}`, origin);
  }

  deleteOrigin(id: string): Observable<RecipeOrigin> {
    return this.http.delete<any>(`${this.baseUrl}/reciperelate/origin${id}`);
  }
}
