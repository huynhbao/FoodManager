import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseUrl = environment.apiUrl
  constructor(private http: HttpClient) { }

  getIngredientDb(search: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/ingredientdb?search=${search}&page=${page}&size=5`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }

  createIngredientDB(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.baseUrl}/ingredientdb/create`, ingredient);
  }

  updateIngredientDB(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.baseUrl}/ingredientdb/update`, ingredient);
  }
}
