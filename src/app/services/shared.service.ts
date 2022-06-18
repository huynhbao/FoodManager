import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, RecipeCategory } from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';
import { AppConst } from '../shared/constants/app-const';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  baseUrl = environment.apiUrl
  
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }

  getRecipeCategories(size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reciperelate/recipe-category?size=${size}`);
  }

  getRecipeOrigin(size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reciperelate/origin?size=${size}`);
  }

  getRecipeMethod(size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reciperelate/method?size=${size}`);
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

  //Report
  getReportPost(status: number, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/post?status=${status}page=${page}&size=5`);
  }

  uploadImage(file: string): Observable<any> {
    let data = {
      "file": file,
      "api_key": AppConst.API_CLOUDINARY,
      "upload_preset": AppConst.UPLOAD_PRESET_CLOUDINARY,
      "folder": AppConst.FOLDER_CLOUDINARY
    }
    return this.http.post<any>(`https://api.cloudinary.com/v1_1/fooma/auto/upload`, data);
  }
}
