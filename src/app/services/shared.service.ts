import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseUrl = environment.apiUrl
  private postRecipeTabbarSrc = new BehaviorSubject<boolean>(true);
  postRecipeTabbar = this.postRecipeTabbarSrc.asObservable();
  constructor(private http: HttpClient) {}

  setTabbar(value: boolean) {
    this.postRecipeTabbarSrc.next(value);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }

  getIngredientDb(search: string, page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/ingredientdb?search=${search}&page=${page}&size=5`
    );
  }

  createIngredientDB(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.baseUrl}/ingredientdb`, ingredient);
  }

  updateIngredientDB(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.baseUrl}/ingredientdb/${ingredient.id}`, ingredient);
  }

  deleteIngredientDB(id: string): Observable<Ingredient> {
    return this.http.delete<any>(`${this.baseUrl}/ingredientdb/${id}`);
  }
}
