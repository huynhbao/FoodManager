import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, RecipeCategory } from '../models/category.model';
import { Ingredient } from '../models/ingredient.model';
import { User } from '../models/user.model';
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
  getReportPost(search: string, status: number, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/post?postReportTitle=${search}&status=${status}&page=${page}&size=5`);
  }

  acceptReportPost(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/report/post/accept/${id}`, {});
  }

  getReportRecipe(search: string, status: number, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/recipe?recipeReportTitle=${search}&status=${status}&page=${page}&size=5`);
  }

  acceptReportRecipe(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/report/recipe/accept/${id}`, {});
  }

  getReportUser(search: string, status: number, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/report/user?userReportTitle=${search}&status=${status}&page=${page}&size=5`);
  }

  acceptReportUser(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/report/user/accept/${id}`, {});
  }

  //user
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/profile`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/update-user`, user);
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
    return this.http.put<any>(`${this.baseUrl}/user/update-password`, body);
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
