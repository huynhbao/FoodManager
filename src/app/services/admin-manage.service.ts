import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Category, RecipeCategory, RecipeMethod, RecipeOrigin } from '../models/category.model';

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

  getCategories(search: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/category/by-name?search=${search}&page=${page}&size=5`
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

  deleteOrigin(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/reciperelate/origin${id}`);
  }


  //method
  getMethods(search: string = "", page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/reciperelate/method?page=${page}&size=5`
    );
  }

  createMethod(method: RecipeMethod): Observable<RecipeMethod> {
    return this.http.post<RecipeMethod>(`${this.baseUrl}/reciperelate/method`, method);
  }

  updateMethod(method: RecipeMethod): Observable<RecipeMethod> {
    return this.http.put<RecipeMethod>(`${this.baseUrl}/reciperelate/method${method.id}`, method);
  }

  deleteMethod(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/reciperelate/method${id}`);
  }

  //recipe category
  getRecipeCategory(search: string = "", page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/reciperelate/recipe-category?page=${page}&size=5`
    );
  }

  createRecipeCategory(recipeCategory: RecipeCategory): Observable<RecipeCategory> {
    return this.http.post<RecipeCategory>(`${this.baseUrl}/reciperelate/recipe-category`, recipeCategory);
  }

  updateRecipeCategory(recipeCategory: RecipeCategory): Observable<RecipeCategory> {
    return this.http.put<RecipeCategory>(`${this.baseUrl}/reciperelate/recipe-category${recipeCategory.id}`, recipeCategory);
  }

  deleteRecipeCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/reciperelate/recipe-category${id}`);
  }
}
